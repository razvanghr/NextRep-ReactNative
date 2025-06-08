import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';
import Header from '../components/Header';

interface BMICalculatorScreenProps {
  navigation: any;
}

const BMICalculatorScreen: React.FC<BMICalculatorScreenProps> = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<{
    bmi: number;
    category: string;
    description: string;
  } | null>(null);

  const calculateBMI = () => {
    if (!height || !weight) {
      Alert.alert('Error', 'Please enter both height and weight');
      return;
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (heightNum <= 0 || weightNum <= 0) {
      Alert.alert('Error', 'Please enter valid positive numbers');
      return;
    }

    let bmi: number;
    
    if (unit === 'metric') {
      const heightM = heightNum / 100;
      bmi = weightNum / (heightM * heightM);
    } else {
      bmi = (weightNum / (heightNum * heightNum)) * 703;
    }

    let category: string;
    let description: string;

    if (bmi < 18.5) {
      category = 'Underweight';
      description = 'Consider gaining weight through healthy eating and exercise';
    } else if (bmi < 25) {
      category = 'Normal weight';
      description = 'Great! Maintain your healthy lifestyle';
    } else if (bmi < 30) {
      category = 'Overweight';
      description = 'Consider losing weight through diet and exercise';
    } else {
      category = 'Obese';
      description = 'Consult with a healthcare professional for a weight management plan';
    }

    setResult({
      bmi: Math.round(bmi * 10) / 10,
      category,
      description,
    });
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setResult(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Underweight':
        return '#3498db';
      case 'Normal weight':
        return '#2ecc71';
      case 'Overweight':
        return '#f39c12';
      case 'Obese':
        return '#e74c3c';
      default:
        return colors.accent;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      
     <Header title="BMI Calculator" showBackButton={true} />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Unit Selector */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Units</Text>
          <View style={styles.unitSelector}>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: colors.cardBackground },
                unit === 'metric' && { backgroundColor: colors.accent }
              ]}
              onPress={() => setUnit('metric')}
            >
              <Text style={[
                styles.unitButtonText,
                { color: unit === 'metric' ? colors.text : colors.textSecondary }
              ]}>
                Metric (cm, kg)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.unitButton,
                { backgroundColor: colors.cardBackground },
                unit === 'imperial' && { backgroundColor: colors.accent }
              ]}
              onPress={() => setUnit('imperial')}
            >
              <Text style={[
                styles.unitButtonText,
                { color: unit === 'imperial' ? colors.text : colors.textSecondary }
              ]}>
                Imperial (in, lbs)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Measurements</Text>
          
          <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Height ({unit === 'metric' ? 'cm' : 'inches'})
            </Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
              value={height}
              onChangeText={setHeight}
              placeholder={unit === 'metric' ? '170' : '67'}
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              Weight ({unit === 'metric' ? 'kg' : 'lbs'})
            </Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
              value={weight}
              onChangeText={setWeight}
              placeholder={unit === 'metric' ? '70' : '154'}
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Calculate Button */}
        <TouchableOpacity
          style={[styles.calculateButton, { backgroundColor: colors.accent }]}
          onPress={calculateBMI}
        >
          <Text style={[styles.calculateButtonText, { color: colors.text }]}>Calculate BMI</Text>
        </TouchableOpacity>

        {/* Results */}
        {result && (
          <View style={[styles.resultContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>Your BMI Result</Text>
            
            <View style={styles.bmiDisplay}>
              <Text style={[styles.bmiNumber, { color: colors.text }]}>{result.bmi}</Text>
              <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(result.category) }]}>
                <Text style={styles.categoryText}>{result.category}</Text>
              </View>
            </View>
            
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {result.description}
            </Text>

            {/* BMI Scale */}
            <View style={styles.scaleContainer}>
              <Text style={[styles.scaleTitle, { color: colors.text }]}>BMI Scale</Text>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#3498db' }]} />
                <Text style={[styles.scaleText, { color: colors.textSecondary }]}>Underweight: Below 18.5</Text>
              </View>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#2ecc71' }]} />
                <Text style={[styles.scaleText, { color: colors.textSecondary }]}>Normal: 18.5 - 24.9</Text>
              </View>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#f39c12' }]} />
                <Text style={[styles.scaleText, { color: colors.textSecondary }]}>Overweight: 25 - 29.9</Text>
              </View>
              <View style={styles.scaleItem}>
                <View style={[styles.scaleColor, { backgroundColor: '#e74c3c' }]} />
                <Text style={[styles.scaleText, { color: colors.textSecondary }]}>Obese: 30 and above</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.resetButton, { borderColor: colors.border }]}
              onPress={resetCalculator}
            >
              <Text style={[styles.resetButtonText, { color: colors.textSecondary }]}>Calculate Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '600',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.screenPadding,
    paddingBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  unitSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  unitButton: {
    flex: 1,
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
  },
  unitButtonText: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '500',
  },
  inputContainer: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '500',
    marginBottom: Spacing.sm,
  },
  input: {
    fontSize: Typography.fontSizes.large,
    padding: Spacing.sm,
    borderBottomWidth: 1,
  },
  calculateButton: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  calculateButtonText: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '700',
  },
  resultContainer: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.medium,
  },
  resultTitle: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  bmiDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  bmiNumber: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.large,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: Typography.fontSizes.medium,
    fontWeight: '600',
  },
  description: {
    fontSize: Typography.fontSizes.medium,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  scaleContainer: {
    marginBottom: Spacing.xl,
  },
  scaleTitle: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  scaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  scaleColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: Spacing.sm,
  },
  scaleText: {
    fontSize: Typography.fontSizes.small,
  },
  resetButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '500',
  },
});

export default BMICalculatorScreen; 
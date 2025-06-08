import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';
import Header from '../components/Header';

interface BMRCalculatorScreenProps {
  navigation: any;
}

const BMRCalculatorScreen: React.FC<BMRCalculatorScreenProps> = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<{
    bmr: number;
    description: string;
    comparison: string;
  } | null>(null);

  const calculateBMR = () => {
    if (!age || !height || !weight) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (ageNum <= 0 || heightNum <= 0 || weightNum <= 0) {
      Alert.alert('Error', 'Please enter valid positive numbers');
      return;
    }

    if (ageNum < 15 || ageNum > 100) {
      Alert.alert('Error', 'Age must be between 15 and 100');
      return;
    }

    let bmr: number;
    
    if (unit === 'metric') {
      // Mifflin-St Jeor Equation (metric)
      if (gender === 'male') {
        bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
      } else {
        bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
      }
    } else {
      // Imperial units - convert first
      const weightKg = weightNum * 0.453592;
      const heightCm = heightNum * 2.54;
      
      if (gender === 'male') {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5;
      } else {
        bmr = 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;
      }
    }

    let comparison = '';
    const avgBMR = gender === 'male' ? 1800 : 1400;
    
    if (bmr > avgBMR + 200) {
      comparison = 'higher than average';
    } else if (bmr < avgBMR - 200) {
      comparison = 'lower than average';
    } else {
      comparison = 'within average range';
    }

    setResult({
      bmr: Math.round(bmr),
      description: 'This is the number of calories your body burns at complete rest to maintain vital functions like breathing, circulation, and cell production.',
      comparison: `Your BMR is ${comparison} for your gender and age group.`,
    });
  };

  const resetCalculator = () => {
    setAge('');
    setHeight('');
    setWeight('');
    setResult(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="BMR Calculator"
        showBackButton={true}
      />

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
                Metric
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
                Imperial
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Basic Information</Text>
          
          {/* Gender Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Gender</Text>
            <View style={styles.genderSelector}>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  { backgroundColor: colors.cardBackground },
                  gender === 'male' && { backgroundColor: colors.accent }
                ]}
                onPress={() => setGender('male')}
              >
                <Ionicons 
                  name="man" 
                  size={20} 
                  color={gender === 'male' ? colors.text : colors.textSecondary}
                />
                <Text style={[
                  styles.genderButtonText,
                  { color: gender === 'male' ? colors.text : colors.textSecondary }
                ]}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  { backgroundColor: colors.cardBackground },
                  gender === 'female' && { backgroundColor: colors.accent }
                ]}
                onPress={() => setGender('female')}
              >
                <Ionicons 
                  name="woman" 
                  size={20} 
                  color={gender === 'female' ? colors.text : colors.textSecondary}
                />
                <Text style={[
                  styles.genderButtonText,
                  { color: gender === 'female' ? colors.text : colors.textSecondary }
                ]}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Age (years)</Text>
            <TextInput
              style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
              value={age}
              onChangeText={setAge}
              placeholder="25"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>

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
          onPress={calculateBMR}
        >
          <Text style={[styles.calculateButtonText, { color: colors.text }]}>Calculate BMR</Text>
        </TouchableOpacity>

        {/* Results */}
        {result && (
          <View style={[styles.resultContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>Your BMR Result</Text>
            
            <View style={styles.bmrDisplay}>
              <Text style={[styles.bmrNumber, { color: colors.accent }]}>{result.bmr}</Text>
              <Text style={[styles.bmrUnit, { color: colors.textSecondary }]}>calories per day</Text>
            </View>
            
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {result.description}
            </Text>

            <Text style={[styles.comparison, { color: colors.text }]}>
              {result.comparison}
            </Text>

            <View style={styles.infoSection}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>What does this mean?</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                • BMR represents the minimum calories needed to keep your body functioning{'\n'}
                • This includes breathing, blood circulation, and cell production{'\n'}
                • To calculate total daily calories, multiply BMR by your activity level{'\n'}
                • BMR typically accounts for 60-75% of total daily energy expenditure
              </Text>
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
  genderSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    gap: Spacing.xs,
  },
  genderButtonText: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '500',
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
  bmrDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  bmrNumber: {
    fontSize: 48,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  bmrUnit: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '500',
  },
  description: {
    fontSize: Typography.fontSizes.medium,
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 22,
  },
  comparison: {
    fontSize: Typography.fontSizes.medium,
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: Spacing.xl,
  },
  infoSection: {
    marginBottom: Spacing.xl,
  },
  infoTitle: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSizes.small,
    lineHeight: 20,
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

export default BMRCalculatorScreen; 
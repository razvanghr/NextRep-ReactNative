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

interface IBWCalculatorScreenProps {
  navigation: any;
}

const IBWCalculatorScreen: React.FC<IBWCalculatorScreenProps> = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<{
    hamwi: number;
    devine: number;
    robinson: number;
    miller: number;
    range: { min: number; max: number };
  } | null>(null);

  const calculateIBW = () => {
    if (!height) {
      Alert.alert('Error', 'Please enter your height');
      return;
    }

    const heightNum = parseFloat(height);

    if (heightNum <= 0) {
      Alert.alert('Error', 'Please enter a valid positive height');
      return;
    }

    let heightInches: number;
    
    if (unit === 'metric') {
      // Convert cm to inches
      heightInches = heightNum / 2.54;
    } else {
      heightInches = heightNum;
    }

    if (heightInches < 48 || heightInches > 84) {
      Alert.alert('Error', 'Height must be between 4\'0" and 7\'0" (122-213 cm)');
      return;
    }

    // Hamwi Formula (1964)
    let hamwi: number;
    if (gender === 'male') {
      hamwi = 48 + 2.7 * (heightInches - 60);
    } else {
      hamwi = 45.5 + 2.2 * (heightInches - 60);
    }

    // Devine Formula (1974) 
    let devine: number;
    if (gender === 'male') {
      devine = 50 + 2.3 * (heightInches - 60);
    } else {
      devine = 45.5 + 2.3 * (heightInches - 60);
    }

    // Robinson Formula (1983)
    let robinson: number;
    if (gender === 'male') {
      robinson = 52 + 1.9 * (heightInches - 60);
    } else {
      robinson = 49 + 1.7 * (heightInches - 60);
    }

    // Miller Formula (1983)
    let miller: number;
    if (gender === 'male') {
      miller = 56.2 + 1.41 * (heightInches - 60);
    } else {
      miller = 53.1 + 1.36 * (heightInches - 60);
    }

    // Convert to selected unit if needed
    if (unit === 'imperial') {
      // Convert kg to lbs
      hamwi *= 2.205;
      devine *= 2.205;
      robinson *= 2.205;
      miller *= 2.205;
    }

    // Calculate healthy weight range (±10%)
    const average = (hamwi + devine + robinson + miller) / 4;
    const range = {
      min: Math.round(average * 0.9),
      max: Math.round(average * 1.1),
    };

    setResult({
      hamwi: Math.round(hamwi),
      devine: Math.round(devine),
      robinson: Math.round(robinson),
      miller: Math.round(miller),
      range,
    });
  };

  const resetCalculator = () => {
    setHeight('');
    setResult(null);
  };

  const getFormulaDescription = (formula: string) => {
    switch (formula) {
      case 'Hamwi':
        return 'Most commonly used by healthcare professionals';
      case 'Devine':
        return 'Used in pharmaceutical dosing calculations';
      case 'Robinson':
        return 'Based on large population studies';
      case 'Miller':
        return 'Accounts for modern body compositions';
      default:
        return '';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="IBW Calculator"
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
        </View>

        {/* Calculate Button */}
        <TouchableOpacity
          style={[styles.calculateButton, { backgroundColor: colors.accent }]}
          onPress={calculateIBW}
        >
          <Text style={[styles.calculateButtonText, { color: colors.text }]}>Calculate IBW</Text>
        </TouchableOpacity>

        {/* Results */}
        {result && (
          <View style={[styles.resultContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>Your Ideal Body Weight</Text>
            
            {/* Recommended Range */}
            <View style={styles.rangeDisplay}>
              <Text style={[styles.rangeLabel, { color: colors.textSecondary }]}>Recommended Range</Text>
              <Text style={[styles.rangeValue, { color: colors.accent }]}>
                {result.range.min} - {result.range.max} {unit === 'metric' ? 'kg' : 'lbs'}
              </Text>
              <Text style={[styles.rangeDescription, { color: colors.textSecondary }]}>
                Based on average of all formulas ±10%
              </Text>
            </View>

            {/* Individual Formulas */}
            <View style={styles.formulasSection}>
              <Text style={[styles.formulasTitle, { color: colors.text }]}>By Formula</Text>
              
              <View style={styles.formulaCard}>
                <View style={styles.formulaHeader}>
                  <Text style={[styles.formulaName, { color: colors.text }]}>Hamwi Formula</Text>
                  <Text style={[styles.formulaValue, { color: colors.text }]}>
                    {result.hamwi} {unit === 'metric' ? 'kg' : 'lbs'}
                  </Text>
                </View>
                <Text style={[styles.formulaDescription, { color: colors.textSecondary }]}>
                  {getFormulaDescription('Hamwi')}
                </Text>
              </View>

              <View style={styles.formulaCard}>
                <View style={styles.formulaHeader}>
                  <Text style={[styles.formulaName, { color: colors.text }]}>Devine Formula</Text>
                  <Text style={[styles.formulaValue, { color: colors.text }]}>
                    {result.devine} {unit === 'metric' ? 'kg' : 'lbs'}
                  </Text>
                </View>
                <Text style={[styles.formulaDescription, { color: colors.textSecondary }]}>
                  {getFormulaDescription('Devine')}
                </Text>
              </View>

              <View style={styles.formulaCard}>
                <View style={styles.formulaHeader}>
                  <Text style={[styles.formulaName, { color: colors.text }]}>Robinson Formula</Text>
                  <Text style={[styles.formulaValue, { color: colors.text }]}>
                    {result.robinson} {unit === 'metric' ? 'kg' : 'lbs'}
                  </Text>
                </View>
                <Text style={[styles.formulaDescription, { color: colors.textSecondary }]}>
                  {getFormulaDescription('Robinson')}
                </Text>
              </View>

              <View style={styles.formulaCard}>
                <View style={styles.formulaHeader}>
                  <Text style={[styles.formulaName, { color: colors.text }]}>Miller Formula</Text>
                  <Text style={[styles.formulaValue, { color: colors.text }]}>
                    {result.miller} {unit === 'metric' ? 'kg' : 'lbs'}
                  </Text>
                </View>
                <Text style={[styles.formulaDescription, { color: colors.textSecondary }]}>
                  {getFormulaDescription('Miller')}
                </Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <Text style={[styles.infoTitle, { color: colors.text }]}>Important Note</Text>
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                These calculations provide estimates only. Ideal weight varies based on muscle mass, bone density, overall body composition, and other factors. Consult with a healthcare professional for personalized advice.
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
  rangeDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    borderWidth: 2,
    borderColor: '#2ecc71',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  rangeLabel: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  rangeValue: {
    fontSize: Typography.fontSizes.xxlarge,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  rangeDescription: {
    fontSize: Typography.fontSizes.small,
    textAlign: 'center',
  },
  formulasSection: {
    marginBottom: Spacing.xl,
  },
  formulasTitle: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  formulaCard: {
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  formulaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  formulaName: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '600',
  },
  formulaValue: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '700',
  },
  formulaDescription: {
    fontSize: Typography.fontSizes.small,
  },
  infoSection: {
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    borderWidth: 1,
    borderColor: '#3498db',
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

export default IBWCalculatorScreen; 
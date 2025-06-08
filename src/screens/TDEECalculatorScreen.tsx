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

interface TDEECalculatorScreenProps {
  navigation: any;
}

const TDEECalculatorScreen: React.FC<TDEECalculatorScreenProps> = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'>('moderate');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    goal: {
      lose: number;
      maintain: number;
      gain: number;
    };
  } | null>(null);

  const activityLevels = [
    { key: 'sedentary', label: 'Sedentary', description: 'Little to no exercise', multiplier: 1.2 },
    { key: 'light', label: 'Light Activity', description: 'Light exercise 1-3 days/week', multiplier: 1.375 },
    { key: 'moderate', label: 'Moderate Activity', description: 'Moderate exercise 3-5 days/week', multiplier: 1.55 },
    { key: 'active', label: 'Active', description: 'Hard exercise 6-7 days/week', multiplier: 1.725 },
    { key: 'very_active', label: 'Very Active', description: 'Very hard exercise, physical job', multiplier: 1.9 },
  ];

  const calculateTDEE = () => {
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

    const activityMultiplier = activityLevels.find(level => level.key === activityLevel)?.multiplier || 1.55;
    const tdee = bmr * activityMultiplier;

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      goal: {
        lose: Math.round(tdee - 500), // 500 calorie deficit for ~1lb/week weight loss
        maintain: Math.round(tdee),
        gain: Math.round(tdee + 300), // 300 calorie surplus for lean weight gain
      },
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
        title="TDEE Calculator"
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

        {/* Activity Level */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity Level</Text>
          {activityLevels.map((level) => (
            <TouchableOpacity
              key={level.key}
              style={[
                styles.activityOption,
                { backgroundColor: colors.cardBackground },
                activityLevel === level.key && { backgroundColor: colors.accent }
              ]}
              onPress={() => setActivityLevel(level.key as any)}
            >
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioButton,
                  { borderColor: activityLevel === level.key ? colors.text : colors.border },
                  activityLevel === level.key && { backgroundColor: colors.text }
                ]} />
                <View style={styles.activityText}>
                  <Text style={[
                    styles.activityLabel,
                    { color: activityLevel === level.key ? colors.text : colors.text }
                  ]}>
                    {level.label}
                  </Text>
                  <Text style={[
                    styles.activityDescription,
                    { color: activityLevel === level.key ? colors.text : colors.textSecondary }
                  ]}>
                    {level.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Calculate Button */}
        <TouchableOpacity
          style={[styles.calculateButton, { backgroundColor: colors.accent }]}
          onPress={calculateTDEE}
        >
          <Text style={[styles.calculateButtonText, { color: colors.text }]}>Calculate TDEE</Text>
        </TouchableOpacity>

        {/* Results */}
        {result && (
          <View style={[styles.resultContainer, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>Your Results</Text>
            
            <View style={styles.resultCard}>
              <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>Basal Metabolic Rate (BMR)</Text>
              <Text style={[styles.resultValue, { color: colors.text }]}>{result.bmr} calories/day</Text>
              <Text style={[styles.resultDescription, { color: colors.textSecondary }]}>
                Calories your body burns at rest
              </Text>
            </View>

            <View style={styles.resultCard}>
              <Text style={[styles.resultLabel, { color: colors.textSecondary }]}>Total Daily Energy Expenditure</Text>
              <Text style={[styles.resultValue, { color: colors.accent }]}>{result.tdee} calories/day</Text>
              <Text style={[styles.resultDescription, { color: colors.textSecondary }]}>
                Total calories you burn per day including activity
              </Text>
            </View>

            <View style={styles.goalSection}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>Calorie Goals</Text>
              
              <View style={styles.goalCard}>
                <View style={[styles.goalIndicator, { backgroundColor: '#e74c3c' }]} />
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalLabel, { color: colors.text }]}>Weight Loss</Text>
                  <Text style={[styles.goalValue, { color: colors.text }]}>{result.goal.lose} cal/day</Text>
                  <Text style={[styles.goalDescription, { color: colors.textSecondary }]}>
                    ~1 lb/week loss
                  </Text>
                </View>
              </View>

              <View style={styles.goalCard}>
                <View style={[styles.goalIndicator, { backgroundColor: '#2ecc71' }]} />
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalLabel, { color: colors.text }]}>Maintain Weight</Text>
                  <Text style={[styles.goalValue, { color: colors.text }]}>{result.goal.maintain} cal/day</Text>
                  <Text style={[styles.goalDescription, { color: colors.textSecondary }]}>
                    Current weight
                  </Text>
                </View>
              </View>

              <View style={styles.goalCard}>
                <View style={[styles.goalIndicator, { backgroundColor: '#3498db' }]} />
                <View style={styles.goalInfo}>
                  <Text style={[styles.goalLabel, { color: colors.text }]}>Weight Gain</Text>
                  <Text style={[styles.goalValue, { color: colors.text }]}>{result.goal.gain} cal/day</Text>
                  <Text style={[styles.goalDescription, { color: colors.textSecondary }]}>
                    Lean muscle gain
                  </Text>
                </View>
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
  activityOption: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.sm,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: Spacing.md,
  },
  activityText: {
    flex: 1,
  },
  activityLabel: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '600',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: Typography.fontSizes.small,
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
  resultCard: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '500',
    marginBottom: Spacing.xs,
  },
  resultValue: {
    fontSize: Typography.fontSizes.xxlarge,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  resultDescription: {
    fontSize: Typography.fontSizes.small,
    textAlign: 'center',
  },
  goalSection: {
    marginTop: Spacing.lg,
  },
  goalTitle: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  goalIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: Spacing.md,
  },
  goalInfo: {
    flex: 1,
  },
  goalLabel: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '600',
  },
  goalValue: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '700',
    color: '#2ecc71',
  },
  goalDescription: {
    fontSize: Typography.fontSizes.small,
  },
  resetButton: {
    padding: Spacing.md,
    borderRadius: BorderRadius.medium,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  resetButtonText: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '500',
  },
});

export default TDEECalculatorScreen; 
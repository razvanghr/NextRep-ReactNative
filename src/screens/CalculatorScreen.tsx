import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';
import Header from '../components/Header';

interface CalculatorScreenProps {
  navigation: any;
}

interface CalculatorOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const calculatorOptions: CalculatorOption[] = [
  {
    id: 'tdee',
    title: 'Total Daily Energy Expenditure',
    description: 'Calculate your daily calorie needs',
    icon: 'flame',
  },
  {
    id: 'ibw',
    title: 'Ideal Body Weight',
    description: 'Find your ideal weight range',
    icon: 'scale',
  },
  {
    id: 'bmi',
    title: 'Body Mass Index',
    description: 'Check your BMI status',
    icon: 'person',
  },
  {
    id: 'bmr',
    title: 'Basal Metabolic Rate',
    description: 'Calculate your resting metabolic rate',
    icon: 'heart',
  },
];

const CalculatorScreen: React.FC<CalculatorScreenProps> = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();

  const handleCalculatorPress = (calculator: CalculatorOption) => {
    // Navigate to specific calculator screen
    switch (calculator.id) {
      case 'tdee':
        navigation.navigate('TDEECalculator');
        break;
      case 'ibw':
        navigation.navigate('IBWCalculator');
        break;
      case 'bmi':
        navigation.navigate('BMICalculator');
        break;
      case 'bmr':
        navigation.navigate('BMRCalculator');
        break;
      default:
        break;
    }
  };

  const renderCalculatorCard = (calculator: CalculatorOption) => (
    <TouchableOpacity
      key={calculator.id}
      style={[styles.calculatorCard, { backgroundColor: colors.cardBackground }]}
      onPress={() => handleCalculatorPress(calculator)}
      activeOpacity={0.8}
    >
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.accent}20` }]}>
          <Ionicons 
            name={calculator.icon as any} 
            size={24} 
            color={colors.accent} 
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.calculatorTitle, { color: colors.text }]}>{calculator.title}</Text>
          <Text style={[styles.calculatorDescription, { color: colors.textSecondary }]}>{calculator.description}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Calculator"
        showBackButton={false}
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <View style={styles.calculatorIcon}>
              <Ionicons name="calculator" size={32} color={colors.text} />
            </View>
          </View>
        </View>

        {/* Calculator Options */}
        <View style={styles.calculatorsSection}>
          {calculatorOptions.map(renderCalculatorCard)}
        </View>
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
    paddingBottom: Spacing.xl,
  },
  imageContainer: {
    height: 200,
    margin: Layout.screenPadding,
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatorsSection: {
    paddingHorizontal: Layout.screenPadding,
  },
  calculatorCard: {
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  calculatorTitle: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  calculatorDescription: {
    fontSize: Typography.fontSizes.small,
  },
  arrowContainer: {
    marginLeft: Spacing.sm,
  },
});

export default CalculatorScreen; 
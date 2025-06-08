import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';
import { Exercise } from '../constants/exerciseData';
import { DetailedExercise, fetchExerciseDetails } from '../services/exerciseApi';
import Header from '../components/Header';

interface ExerciseDetailScreenProps {
  navigation: any;
  route: any;
}

const ExerciseDetailScreen: React.FC<ExerciseDetailScreenProps> = ({ navigation, route }) => {
  const { isDarkMode, colors } = useTheme();
  const { exerciseId, exerciseName, exerciseImage } = route.params;
  
  const [exercise, setExercise] = useState<DetailedExercise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExerciseDetails();
  }, [exerciseId]);

  const loadExerciseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const detailedExercise = await fetchExerciseDetails(exerciseId);
      setExercise(detailedExercise);
    } catch (err) {
      console.error('Error loading exercise details:', err);
      setError('Failed to load exercise details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    navigation.goBack();
  };

  const getExerciseIllustration = (exerciseName: string): string => {
    const illustrations = {
      'Bench Press': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'Reverse Curl': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'Standing Triceps Kickback': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'Concentration Curl': 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    };
    return illustrations[exerciseName as keyof typeof illustrations] || 
           'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
        <Header title={exerciseName} showBackButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading exercise details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !exercise) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
        <Header title={exerciseName} showBackButton={true} />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error || colors.accent} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            {error || 'Exercise not found'}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.accent }]}
            onPress={loadExerciseDetails}
          >
            <Text style={[styles.retryButtonText, { color: colors.text }]}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      <Header title={exercise.name} showBackButton={true} />

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Exercise Illustration */}
        <View style={[styles.illustrationContainer, { backgroundColor: colors.cardBackground }]}>
          <Image
            source={{ uri: exercise.image }}
            style={[styles.exerciseIllustration, { backgroundColor: colors.secondary }]}
            resizeMode="cover"
          />
        </View>

        {/* Exercise Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="body" size={20} color={colors.accent} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Body Part: <Text style={[styles.infoValue, { color: colors.text }]}>{exercise.bodyPart}</Text>
              </Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="fitness" size={20} color={colors.accent} />
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Equipment: <Text style={[styles.infoValue, { color: colors.text }]}>{exercise.equipment}</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Target Muscles */}
        {exercise.targetMuscles && exercise.targetMuscles.length > 0 && (
          <View style={styles.musclesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Target Muscles</Text>
            <View style={styles.musclesList}>
              {exercise.targetMuscles.map((muscle) => (
                <View key={muscle.id} style={[styles.muscleItem, { backgroundColor: colors.cardBackground }]}>
                  <Text style={[styles.muscleName, { color: colors.text }]}>{muscle.name}</Text>
                  <Text style={[styles.muscleGroup, { color: colors.textSecondary }]}>{muscle.group}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Secondary Muscles */}
        {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
          <View style={styles.musclesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Secondary Muscles</Text>
            <View style={styles.musclesList}>
              {exercise.secondaryMuscles.map((muscle) => (
                <View key={muscle.id} style={[styles.muscleItem, { backgroundColor: colors.cardBackground }]}>
                  <Text style={[styles.muscleName, { color: colors.text }]}>{muscle.name}</Text>
                  <Text style={[styles.muscleGroup, { color: colors.textSecondary }]}>{muscle.group}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Instructions */}
        {exercise.instructions && exercise.instructions.length > 0 && (
          <View style={styles.instructionsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Instructions</Text>
            {exercise.instructions
              .sort((a, b) => a.order - b.order)
              .map((instruction) => (
                <View key={instruction.order} style={styles.instructionItem}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.accent }]}>
                    <Text style={[styles.stepNumberText, { color: colors.text }]}>{instruction.order}</Text>
                  </View>
                  <Text style={[styles.instructionText, { color: colors.text }]}>{instruction.description}</Text>
                </View>
              ))}
          </View>
        )}
      </ScrollView>

      {/* Finish Button */}
      <View style={[styles.bottomSection, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.finishButton, { backgroundColor: colors.accent }]}
          onPress={handleFinish}
          activeOpacity={0.8}
        >
          <Text style={[styles.finishButtonText, { color: colors.text }]}>Finish</Text>
        </TouchableOpacity>
      </View>
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
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for finish button
  },
  illustrationContainer: {
    margin: Layout.screenPadding,
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  exerciseIllustration: {
    width: '100%',
    height: 200,
  },
  infoSection: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.lg,
  },
  infoRow: {
    marginBottom: Spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: Typography.fontSizes.medium,
    marginLeft: Spacing.sm,
  },
  infoValue: {
    fontWeight: '600',
  },
  instructionsSection: {
    paddingHorizontal: Layout.screenPadding,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '700',
    marginBottom: Spacing.lg,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: Typography.fontSizes.small,
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
    fontSize: Typography.fontSizes.medium,
    lineHeight: 22,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.lg,
    borderTopWidth: 1,
  },
  finishButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  finishButtonText: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  loadingText: {
    fontSize: Typography.fontSizes.medium,
    marginTop: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Layout.screenPadding,
  },
  errorText: {
    fontSize: Typography.fontSizes.medium,
    textAlign: 'center',
    marginVertical: Spacing.lg,
  },
  retryButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.medium,
  },
  retryButtonText: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '600',
  },
  musclesSection: {
    paddingHorizontal: Layout.screenPadding,
    marginBottom: Spacing.lg,
  },
  musclesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  muscleItem: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.small,
    marginRight: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  muscleName: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  muscleGroup: {
    fontSize: Typography.fontSizes.small,
  },
});

export default ExerciseDetailScreen; 
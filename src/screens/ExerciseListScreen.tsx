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
import { ApiExercise, fetchExercisesByBodyPart } from '../services/exerciseApi';
import Header from '../components/Header';

interface ExerciseListScreenProps {
  navigation: any;
  route: any;
}

const ExerciseListScreen: React.FC<ExerciseListScreenProps> = ({ navigation, route }) => {
  const { isDarkMode, colors } = useTheme();
  const { category } = route.params;
  const [exercises, setExercises] = useState<ApiExercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadExercises();
  }, [category]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiExercises = await fetchExercisesByBodyPart(category.id);
      setExercises(apiExercises);
    } catch (err) {
      console.error('Error loading exercises:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExercisePress = (exercise: ApiExercise) => {
    setSelectedExercise(exercise.id);
    navigation.navigate('ExerciseDetail', { 
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      exerciseImage: exercise.image
    });
  };

  const renderExerciseCard = (exercise: ApiExercise) => (
    <TouchableOpacity
      key={exercise.id}
      style={[
        styles.exerciseCard,
        { backgroundColor: colors.cardBackground },
        selectedExercise === exercise.id && { borderWidth: 2, borderColor: colors.accent }
      ]}
      onPress={() => handleExercisePress(exercise)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: exercise.image }}
        style={[styles.exerciseImage, { backgroundColor: colors.secondary }]}
        resizeMode="cover"
      />
      <View style={styles.exerciseInfo}>
        <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
        <Text style={[styles.exerciseEquipment, { color: colors.textSecondary }]}>{exercise.bodyPart}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.primary} />
      
     <Header title={category.displayName} showBackButton={true} />

      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={[styles.loadingText, { color: colors.text }]}>Loading exercises...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color={colors.error || colors.accent} />
            <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.accent }]}
              onPress={loadExercises}
            >
              <Text style={[styles.retryButtonText, { color: colors.text }]}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : exercises.length > 0 ? (
          exercises.map(renderExerciseCard)
        ) : (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No exercises available</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Try selecting a different category</Text>
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

  exerciseCard: {
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.lg,
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
  exerciseImage: {
    width: '100%',
    height: 150,
  },
  exerciseInfo: {
    padding: Spacing.md,
  },
  exerciseName: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  exerciseEquipment: {
    fontSize: Typography.fontSizes.medium,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: Typography.fontSizes.medium,
    textAlign: 'center',
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
});

export default ExerciseListScreen; 
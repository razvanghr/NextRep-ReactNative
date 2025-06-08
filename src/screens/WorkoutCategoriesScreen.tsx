import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import { Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';
import { workoutCategories } from '../constants/exerciseData';
import { preloadExerciseData } from '../services/exerciseApi';
import Header from '../components/Header';

interface WorkoutCategoriesScreenProps {
  navigation: any;
}

const WorkoutCategoriesScreen: React.FC<WorkoutCategoriesScreenProps> = ({ navigation }) => {
  const { isDarkMode, colors } = useTheme();
  
  // Preload popular exercise categories in the background
  useEffect(() => {
    const preloadPopularCategories = async () => {
      try {
        // Preload the most popular exercise categories
        const popularCategories = ['chest', 'arms', 'legs'];
        await preloadExerciseData(popularCategories);
      } catch (error) {
        console.log('Background preloading failed:', error);
      }
    };

    const timer = setTimeout(preloadPopularCategories, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleCategoryPress = (category: any) => {
    navigation.navigate('ExerciseList', { category });
  };

  const renderCategoryCard = (category: any) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(category)}
      activeOpacity={0.8}
    >
      <ImageBackground
        source={{
          uri: category.image
        }}
        style={styles.cardBackground}
        imageStyle={{ borderRadius: BorderRadius.medium }}
      >
        <View style={styles.cardOverlay}>
          <Text style={styles.categoryTitle}>{category.displayName}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Workouts"
        showBackButton={false}
      />

      {/* Categories List */}
      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {workoutCategories.map(renderCategoryCard)}
      </ScrollView>
    </SafeAreaView>
  );
};

const getCategoryImage = (categoryId: string): string => {
  const images = {
    chest: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    abdominal: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    arms: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',  
    legs: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  };
  return images[categoryId as keyof typeof images] || images.chest;
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
  categoryCard: {
    height: 120,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.medium,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.medium,
    borderBottomRightRadius: BorderRadius.medium,
  },
  categoryTitle: {
    fontSize: Typography.fontSizes.xlarge,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default WorkoutCategoriesScreen; 
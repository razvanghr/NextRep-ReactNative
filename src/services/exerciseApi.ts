
import { exerciseCache, exerciseDetailCache } from './cacheService';

export interface ApiExercise {
  id: string;
  name: string;
  bodyPart: string;
  image: string;
}

export interface ExerciseInstruction {
  order: number;
  description: string;
}

export interface TargetMuscle {
  id: string;
  name: string;
  bodyPart: string;
  group: string;
}

export interface DetailedExercise {
  id: string;
  name: string;
  bodyPart: string;
  image: string;
  equipment: string;
  instructions: ExerciseInstruction[];
  targetMuscles: TargetMuscle[];
  secondaryMuscles: TargetMuscle[];
  variations?: DetailedExercise[];
}

export interface ExerciseApiResponse {
  results: ApiExercise[];
}


export const fetchExercisesByBodyPart = async (bodyPart: string): Promise<ApiExercise[]> => {
  try {
    const categoryToBodyPartMap: { [key: string]: string } = {
      'legs': 'Legs',
      'arms': 'Arms',
      'chest': 'Chest',
      'abdominal': 'Core',
      'back': 'Back',
      'shoulders': 'Shoulders'
    };

    const apiBodyPart = categoryToBodyPartMap[bodyPart.toLowerCase()] || 'Chest';
    const cacheKey = `exercises_${bodyPart.toLowerCase()}`;
    
    const cachedData = await exerciseCache.get<ApiExercise[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '5c3023ad6amshcc70062e758aa9dp1d46a5jsnffd4e0964b2a',
        'x-rapidapi-host': 'gym-fit.p.rapidapi.com'
      }
    };

    const url = `https://gym-fit.p.rapidapi.com/v1/exercises/search?number=50&offset=0&bodyPart=${encodeURIComponent(apiBodyPart)}`;
    
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ExerciseApiResponse = await response.json();
    
    const exercisesWithImages = data.results.filter(
      exercise => exercise.image && exercise.image !== 'image_coming_soon'
    );
    
    await exerciseCache.set(cacheKey, exercisesWithImages);
    
    return exercisesWithImages;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};



export const fetchExerciseDetails = async (exerciseId: string): Promise<DetailedExercise> => {
  try {
    const cacheKey = `exercise_details_${exerciseId}`;
    
    const cachedData = await exerciseDetailCache.get<DetailedExercise>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '5c3023ad6amshcc70062e758aa9dp1d46a5jsnffd4e0964b2a',
        'x-rapidapi-host': 'gym-fit.p.rapidapi.com'
      }
    };

    const url = `https://gym-fit.p.rapidapi.com/v1/exercises/${exerciseId}`;
    
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: DetailedExercise = await response.json();
    
    await exerciseDetailCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('Error fetching exercise details:', error);
    throw error;
  }
};

export const getCategoryDisplayName = (bodyPart: string): string => {
  const displayNames: { [key: string]: string } = {
    'legs': 'Leg Muscles',
    'arms': 'Arm Muscles', 
    'chest': 'Chest Muscles',
    'abdominal': 'Abdominal Muscles',
    'back': 'Back Muscles',
    'shoulders': 'Shoulder Muscles'
  };
  return displayNames[bodyPart.toLowerCase()] || bodyPart;
};

export const preloadExerciseData = async (bodyParts: string[]): Promise<void> => {
  try {
    const promises = bodyParts.map(bodyPart => fetchExercisesByBodyPart(bodyPart));
    await Promise.all(promises);
  } catch (error) {
    console.error('Error preloading exercise data:', error);
  }
}; 
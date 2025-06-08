export interface Exercise {
  id: string;
  name: string;
  category: string;
  bodyPart: string;
  equipment: string;
  instructions: string[];
  imageUrl?: string;
  gifUrl?: string;
}

export interface WorkoutCategory {
  id: string;
  name: string;
  displayName: string;
  image: string;
  description: string;
}

export const workoutCategories: WorkoutCategory[] = [
  {
    id: 'chest',
    name: 'chest',
    displayName: 'Chest',
    image: 'https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Build your chest muscles with these exercises'
  },
  {
    id: 'abdominal',
    name: 'waist',
    displayName: 'Abdominal',
    image: 'https://images.unsplash.com/photo-1601986313624-28c11ac26334?q=80&w=1848&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Strengthen your core with abdominal exercises'
  },
  {
    id: 'arms',
    name: 'upper arms',
    displayName: 'Arms',
    image: 'https://images.unsplash.com/photo-1585820114364-e6d77b1a3ca4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXJtcyUyMHRyYWluaW5nfGVufDB8fDB8fHww',
    description: 'Build stronger arms and biceps'
  },
  {
    id: 'legs',
    name: 'upper legs',
    displayName: 'Legs',
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    description: 'Develop powerful leg muscles'
  },
  {
    id: 'back',
    name: 'back',
    displayName: 'Back',
    image: 'https://images.unsplash.com/photo-1611841315886-a8ad8d02f179?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YmFjayUyMHRyYWluaW5nfGVufDB8fDB8fHww',
    description: 'Strengthen your back muscles'
  },
  {
    id: 'shoulders',
    name: 'shoulders',
    displayName: 'Shoulders',
    image: 'https://images.unsplash.com/photo-1737601833679-a82599135395?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hvdWxkZXJzJTIwdHJhaW5pbmd8ZW58MHx8MHx8fDA%3D',
    description: 'Build strong shoulders'
  },
];


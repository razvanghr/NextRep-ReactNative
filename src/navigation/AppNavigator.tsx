import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import SplashScreen from '../screens/SplashScreen';
import WorkoutCategoriesScreen from '../screens/WorkoutCategoriesScreen';
import ExerciseListScreen from '../screens/ExerciseListScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import CalculatorScreen from '../screens/CalculatorScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TDEECalculatorScreen from '../screens/TDEECalculatorScreen';
import BMICalculatorScreen from '../screens/BMICalculatorScreen';
import BMRCalculatorScreen from '../screens/BMRCalculatorScreen';
import IBWCalculatorScreen from '../screens/IBWCalculatorScreen';

import { useTheme } from '../constants/ThemeContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const WorkoutStack = createStackNavigator();
const CalculatorStack = createStackNavigator();

const WorkoutStackNavigator = () => {
  return (
    <WorkoutStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <WorkoutStack.Screen 
        name="WorkoutCategories" 
        component={WorkoutCategoriesScreen} 
      />
      <WorkoutStack.Screen 
        name="ExerciseList" 
        component={ExerciseListScreen}
      />
      <WorkoutStack.Screen 
        name="ExerciseDetail" 
        component={ExerciseDetailScreen}
      />
    </WorkoutStack.Navigator>
  );
};

const CalculatorStackNavigator = () => {
  return (
    <CalculatorStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CalculatorStack.Screen 
        name="CalculatorMain" 
        component={CalculatorScreen} 
      />
      <CalculatorStack.Screen 
        name="TDEECalculator" 
        component={TDEECalculatorScreen}
      />
      <CalculatorStack.Screen 
        name="BMICalculator" 
        component={BMICalculatorScreen}
      />
      <CalculatorStack.Screen 
        name="BMRCalculator" 
        component={BMRCalculatorScreen}
      />
      <CalculatorStack.Screen 
        name="IBWCalculator" 
        component={IBWCalculatorScreen}
      />
    </CalculatorStack.Navigator>
  );
};

const MainTabNavigator = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Workouts') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Calculator') {
            iconName = focused ? 'calculator' : 'calculator-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Workouts" 
        component={WorkoutStackNavigator} 
        options={{ title: 'Workouts' }}
      />
      <Tab.Screen 
        name="Calculator" 
        component={CalculatorStackNavigator} 
        options={{ title: 'Calculator' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabNavigator} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const LightColors = {
  primary: '#ffffff',
  secondary: '#f5f5f5',
  accent: '#4a90e2',
  text: '#000000',
  textSecondary: '#666666',
  background: '#ffffff',
  cardBackground: '#f8f9fa',
  border: '#e0e0e0',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

export const DarkColors = {
  primary: '#1a1a1a',
  secondary: '#2d2d2d',
  accent: '#4a90e2',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  background: '#0f0f0f',
  cardBackground: '#1e1e1e',
  border: '#333333',
  success: '#4caf50',
  warning: '#ff9800',
  error: '#f44336',
};

export const Typography = {
  fontSizes: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 32,
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  xlarge: 24,
};

export const Layout = {
  screenPadding: 20,
  cardPadding: 16,
};

interface ThemeContextType {
  isDarkMode: boolean;
  colors: typeof DarkColors;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true); 

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themePreference');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (isDark: boolean) => {
    try {
      await AsyncStorage.setItem('themePreference', isDark ? 'dark' : 'light');
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    saveThemePreference(newTheme);
  };

  const colors = isDarkMode ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ isDarkMode, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  Dimensions,
} from 'react-native';
import { Typography, Spacing } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000); // Show splash for 3 seconds

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        }}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 0.7 }}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            
            
            <View style={styles.textContainer}>
              <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Welcome to</Text>
              <Text style={[styles.appName, { color: colors.text }]}>NextRep</Text>
              <Text style={[styles.tagline, { color: colors.textSecondary }]}>Plan your workout with us</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  backgroundImageStyle: {
    opacity: 0.7,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  logoContainer: {
    marginBottom: Spacing.xl,
  },
  logoSymbol: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  textContainer: {
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: Typography.fontSizes.large,
    fontWeight: '400',
    marginBottom: Spacing.xs,
  },
  appName: {
    fontSize: Typography.fontSizes.xxlarge,
    fontWeight: '700',
    marginBottom: Spacing.md,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SplashScreen; 
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Typography, Spacing, BorderRadius, Layout } from '../constants/theme';
import { useTheme } from '../constants/ThemeContext';
import Header from '../components/Header';

interface SettingsScreenProps {
  navigation: any;
}

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  type: 'toggle' | 'navigate' | 'action';
  value?: boolean;
  onPress?: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { isDarkMode, colors, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handleAbout = () => {
    Alert.alert(
      'About NextRep',
      'NextRep v1.0.0\n\nA comprehensive fitness app to help you plan and track your workouts.\n\nDeveloped by: Ghilea Razvan-Alin\nEmail: ghilea.razvanalin@student.uoradea.ro',
      [{ text: 'OK' }]
    );
  };

  const handleContact = () => {
    Alert.alert(
      'Contact',
      'For support or feedback, please contact:\nghilea.razvanalin@student.uoradea.ro',
      [{ text: 'OK' }]
    );
  };

  const handlePrivacy = () => {
    Alert.alert(
      'Privacy Policy',
      'Your privacy is important to us. This app stores your preferences locally on your device and does not collect personal data.',
      [{ text: 'OK' }]
    );
  };

  const settingsItems: SettingItem[] = [
    {
      id: 'theme',
      title: 'Dark Mode',
      subtitle: 'Use dark theme',
      icon: 'moon',
      type: 'toggle',
      value: isDarkMode,
      onPress: toggleTheme,
    },
    {
      id: 'notifications',
      title: 'Notifications',
      subtitle: 'Get workout reminders',
      icon: 'notifications',
      type: 'toggle',
      value: notifications,
      onPress: () => setNotifications(!notifications),
    },
    {
      id: 'about',
      title: 'About',
      subtitle: 'App information',
      icon: 'information-circle',
      type: 'action',
      onPress: handleAbout,
    },
    {
      id: 'contact',
      title: 'Contact',
      subtitle: 'Get in touch',
      icon: 'mail',
      type: 'action',
      onPress: handleContact,
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      subtitle: 'How we handle your data',
      icon: 'shield-checkmark',
      type: 'action',
      onPress: handlePrivacy,
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.settingItem, { backgroundColor: colors.cardBackground }]}
      onPress={item.onPress}
      activeOpacity={item.type === 'toggle' ? 1 : 0.7}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: `${colors.accent}20` }]}>
          <Ionicons name={item.icon as any} size={24} color={colors.accent} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
          {item.subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      
      <View style={styles.settingRight}>
        {item.type === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={item.onPress}
            trackColor={{
              false: colors.border,
              true: colors.accent + '40',
            }}
            thumbColor={item.value ? colors.accent : colors.textSecondary}
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Settings"
        showBackButton={false}
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* App Info Section */}
        <View style={[styles.appInfoSection, { borderBottomColor: colors.border }]}>
          <Text style={[styles.appName, { color: colors.text }]}>NextRep</Text>
          <Text style={[styles.appVersion, { color: colors.textSecondary }]}>Version 1.0.0</Text>
        </View>

        {/* Settings List */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Preferences</Text>
          {settingsItems.slice(0, 2).map(renderSettingItem)}
        </View>

        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Support</Text>
          {settingsItems.slice(2).map(renderSettingItem)}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Made with ❤️ for fitness enthusiasts
          </Text>
          <Text style={[styles.footerCopyright, { color: colors.textSecondary }]}>
            © 2025 NextRep. All rights reserved.
          </Text>
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
  appInfoSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    marginHorizontal: Layout.screenPadding,
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  appIcon: {
    fontSize: 40,
  },
  appName: {
    fontSize: Typography.fontSizes.xlarge,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  appVersion: {
    fontSize: Typography.fontSizes.medium,
  },
  settingsSection: {
    marginTop: Spacing.xl,
    paddingHorizontal: Layout.screenPadding,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '600',
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    borderRadius: BorderRadius.medium,
    marginBottom: Spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  settingTitle: {
    fontSize: Typography.fontSizes.medium,
    fontWeight: '600',
  },
  settingSubtitle: {
    fontSize: Typography.fontSizes.small,
    marginTop: 2,
  },
  settingRight: {
    marginLeft: Spacing.md,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Layout.screenPadding,
  },
  footerText: {
    fontSize: Typography.fontSizes.small,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  footerCopyright: {
    fontSize: Typography.fontSizes.small,
    textAlign: 'center',
  },
});

export default SettingsScreen; 
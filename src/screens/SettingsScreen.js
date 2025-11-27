import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { Typography, Spacing, BorderRadius, Layout } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import BankingButton from '../components/BankingButton';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { user, isGuest, phoneNumber, logout } = useUser();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { isDarkMode, toggleTheme } = useTheme();
  const [biometricEnabled, setBiometricEnabled] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      return () => fadeAnim.setValue(0);
    }, [fadeAnim])
  );

  const SettingItem = ({ label, value, onPress, rightComponent, showArrow = true }) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.settingLabel, { color: theme.colors.text }]}>
        {label}
      </Text>
      <View style={styles.settingRight}>
        {rightComponent || (value && (
          <Text style={[styles.settingValue, { color: theme.colors.textSecondary }]}>
            {value}
          </Text>
        ))}
        {showArrow && onPress && (
          <Text style={[styles.arrow, { color: theme.colors.textTertiary }]}>›</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: theme.colors.backgroundSecondary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding: Layout.screenPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <BankingCard variant="elevated" style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Profile
            </Text>
            {isGuest && (
              <View style={[styles.guestBadge, { backgroundColor: theme.warningLight || '#fef3c7' }]}>
                <Text style={[styles.guestBadgeText, { color: theme.warning || '#f59e0b' }]}>
                  Guest Mode
                </Text>
              </View>
            )}
          </View>
          <SettingItem
            label="Name"
            value={user?.name || 'Not set'}
            onPress={() => navigation.navigate('ProfileEdit')}
          />
          <SettingItem
            label="Email"
            value={user?.email || 'Not set'}
            onPress={() => navigation.navigate('ProfileEdit')}
          />
          <SettingItem
            label="Phone"
            value={phoneNumber || user?.phone || 'Not set'}
            onPress={() => navigation.navigate('ProfileEdit')}
          />
          {isGuest && (
            <View style={styles.guestPrompt}>
              <Text style={[styles.guestPromptText, { color: theme.colors.textSecondary }]}>
                Complete your profile to access all features
              </Text>
              <BankingButton
                title="Complete Profile"
                onPress={() => navigation.navigate('ProfileEdit')}
                fullWidth
                size="md"
                style={styles.completeButton}
              />
            </View>
          )}
        </BankingCard>

        {/* Account Section */}
        {!isGuest && (
          <BankingCard variant="elevated" style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Account
            </Text>
            <SettingItem
              label="Edit Profile"
              onPress={() => navigation.navigate('ProfileEdit')}
            />
            <SettingItem
              label="Verify Phone"
              onPress={() => navigation.navigate('PhoneVerification')}
            />
            <SettingItem
              label="Logout"
              onPress={() => {
                Alert.alert(
                  'Logout',
                  'Are you sure you want to logout?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Logout',
                      style: 'destructive',
                      onPress: () => {
                        logout();
                        Alert.alert('Logged Out', 'You have been logged out successfully');
                      },
                    },
                  ]
                );
              }}
            />
          </BankingCard>
        )}

        {/* Security Section */}
        <BankingCard variant="elevated" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Security
          </Text>
          <SettingItem
            label="Biometric Login"
            rightComponent={
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{ false: theme.colors.border, true: theme.primary }}
                thumbColor="#fff"
              />
            }
            showArrow={false}
          />
          <SettingItem
            label="Change PIN"
            onPress={() => {}}
          />
          <SettingItem
            label="Two-Factor Authentication"
            value="Disabled"
            onPress={() => {}}
          />
        </BankingCard>

        {/* Preferences Section */}
        <BankingCard variant="elevated" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Preferences
          </Text>
          <SettingItem
            label="Dark Mode"
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.colors.border, true: theme.primary }}
                thumbColor="#fff"
              />
            }
            showArrow={false}
          />
          <SettingItem
            label="Notifications"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: theme.colors.border, true: theme.primary }}
                thumbColor="#fff"
              />
            }
            showArrow={false}
          />
          <SettingItem
            label="Language"
            value="English"
            onPress={() => {}}
          />
        </BankingCard>

        {/* Support Section */}
        <BankingCard variant="elevated" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Support
          </Text>
          <SettingItem
            label="Help Center"
            onPress={() => {}}
          />
          <SettingItem
            label="Contact Support"
            onPress={() => navigation.navigate('Complaint')}
          />
          <SettingItem
            label="Terms & Conditions"
            onPress={() => {}}
          />
          <SettingItem
            label="Privacy Policy"
            onPress={() => {}}
          />
        </BankingCard>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, { color: theme.colors.textTertiary }]}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  guestBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  guestBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  guestPrompt: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  guestPromptText: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  completeButton: {
    marginTop: Spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  settingLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  settingValue: {
    fontSize: Typography.fontSize.sm,
  },
  arrow: {
    fontSize: 24,
    marginLeft: Spacing.xs,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  appVersion: {
    fontSize: Typography.fontSize.sm,
  },
});

export default SettingsScreen;


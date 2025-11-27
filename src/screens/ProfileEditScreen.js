import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { Typography, Spacing, BorderRadius, Layout } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import BankingButton from '../components/BankingButton';
import BankingInput from '../components/BankingInput';
import ErrorDisplay from '../components/ErrorDisplay';

const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { user, phoneNumber, updateProfile, isGuest } = useUser();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: phoneNumber || user?.phone || '',
    id_number: user?.id_number || '',
    address: user?.address || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.phone || !formData.phone.match(/^\+?254[0-9]{9}$/)) {
      setError('Please enter a valid Kenyan phone number (+254...)');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const result = await updateProfile(formData);

    if (result.success) {
      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            padding: Layout.screenPadding,
          },
        ]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <BankingCard variant="elevated" style={styles.card}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {isGuest ? 'Complete Your Profile' : 'Edit Profile'}
            </Text>
            <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
              {isGuest 
                ? 'Add your details to complete your account setup'
                : 'Update your profile information'}
            </Text>

            <View style={styles.form}>
              <BankingInput
                label="Full Name *"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder="Enter your full name"
                autoCapitalize="words"
              />

              <BankingInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <BankingInput
                label="Phone Number *"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="+254712345678"
                keyboardType="phone-pad"
                editable={!phoneNumber && !user?.phone}
                helperText={phoneNumber || user?.phone ? "Phone number is verified" : "Verify your phone number"}
              />

              <BankingInput
                label="ID Number"
                value={formData.id_number}
                onChangeText={(value) => handleInputChange('id_number', value)}
                placeholder="Enter your ID number"
                keyboardType="numeric"
              />

              <BankingInput
                label="Address"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.buttonContainer}>
              <BankingButton
                title="Save Profile"
                onPress={handleSave}
                loading={loading}
                disabled={loading}
                fullWidth
                size="md"
              />
            </View>

            {isGuest && (
              <View style={styles.verifyContainer}>
                <Text style={[styles.verifyText, { color: theme.colors.textSecondary }]}>
                  Need to verify your phone number?
                </Text>
                <BankingButton
                  title="Verify Phone Number"
                  variant="outline"
                  onPress={() => navigation.navigate('PhoneVerification', {
                    onSuccess: () => {
                      // Reload user data after verification
                      navigation.goBack();
                    },
                  })}
                  fullWidth
                  size="md"
                  style={styles.verifyButton}
                />
              </View>
            )}
          </BankingCard>
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  card: {
    padding: Spacing.xl,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  form: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  buttonContainer: {
    marginTop: Spacing.md,
  },
  verifyContainer: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  verifyText: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  verifyButton: {
    marginTop: Spacing.sm,
  },
});

export default ProfileEditScreen;


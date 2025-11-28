import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Typography, Spacing, Layout, BorderRadius } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import BankingButton from '../components/BankingButton';
import BankingInput from '../components/BankingInput';
import ErrorDisplay from '../components/ErrorDisplay';
import { apiRequest, API_ENDPOINTS } from '../config/api';

const { width } = Dimensions.get('window');

const ComplaintScreen = () => {
  const theme = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    transaction_reference: '',
    name: '',
    comment: '',
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Fade in animation when screen is focused
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      return () => {
        fadeAnim.setValue(0);
      };
    }, [fadeAnim])
  );

  const loadUserData = async () => {
    try {
      const userName = await AsyncStorage.getItem('user_name');
      if (userName) {
        setFormData(prev => ({ ...prev, name: userName }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.transaction_reference || formData.transaction_reference.trim() === '') {
      errors.transaction_reference = 'Transaction reference required';
    }
    if (!formData.name || formData.name.trim() === '') {
      errors.name = 'Your name is required';
    }
    if (!formData.comment || formData.comment.trim() === '') {
      errors.comment = 'Please describe your complaint';
    }
    
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Please fill in all required fields');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      // Save user name to session for future use
      await AsyncStorage.setItem('user_name', formData.name);

      // Submit complaint
      const response = await apiRequest(
        API_ENDPOINTS.SUBMIT_COMPLAINT,
        'POST',
        {
          transaction_reference: formData.transaction_reference.trim(),
          name: formData.name.trim(),
          comment: formData.comment.trim(),
        }
      );

      if (response.success) {
        Alert.alert(
          'Success',
          'Your complaint has been submitted successfully. We will review it and get back to you soon.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Reset form
                setFormData({
                  transaction_reference: '',
                  name: formData.name, // Keep name for convenience
                  comment: '',
                });
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to submit complaint. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert('Error', 'Failed to submit complaint. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: theme.colors.background }]}>
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, { padding: Layout.screenPadding }]}
          showsVerticalScrollIndicator={false}
        >
          <BankingCard variant="elevated" style={styles.headerCard}>
            <View style={styles.headerIconContainer}>
              <Text style={styles.headerIcon}>📝</Text>
            </View>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Submit a Complaint
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              We're here to help. Please provide the details below.
            </Text>
          </BankingCard>

          <BankingCard variant="elevated" style={styles.formCard}>
            {/* Transaction Reference */}
            <BankingInput
              label="Transaction Reference"
              value={formData.transaction_reference}
              onChangeText={(value) => {
                handleInputChange('transaction_reference', value);
                if (fieldErrors.transaction_reference) {
                  setFieldErrors({ ...fieldErrors, transaction_reference: null });
                }
              }}
              placeholder="Enter transaction reference number"
              autoCapitalize="none"
              editable={!submitting}
              error={fieldErrors.transaction_reference}
              helperText="You can find this in your transaction details"
            />

            {/* Name */}
            <BankingInput
              label="Your Name"
              value={formData.name}
              onChangeText={(value) => {
                handleInputChange('name', value);
                if (fieldErrors.name) {
                  setFieldErrors({ ...fieldErrors, name: null });
                }
              }}
              placeholder="Enter your full name"
              autoCapitalize="words"
              editable={!submitting}
              error={fieldErrors.name}
            />

            {/* Comment */}
            <BankingInput
              label="Complaint Details"
              value={formData.comment}
              onChangeText={(value) => {
                handleInputChange('comment', value);
                if (fieldErrors.comment) {
                  setFieldErrors({ ...fieldErrors, comment: null });
                }
              }}
              placeholder="Please describe your complaint in detail..."
              multiline
              editable={!submitting}
              error={fieldErrors.comment}
              helperText="Please provide as much detail as possible"
            />

            {/* Submit Button */}
            <BankingButton
              title={submitting ? 'Submitting...' : 'Submit Complaint'}
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              fullWidth
              size="lg"
              style={styles.submitButton}
            />

            {/* Info Section */}
            <BankingCard style={styles.infoBox}>
              <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                💡 Need Help?
              </Text>
              <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                Our support team typically responds within 24-48 hours. For urgent matters, please contact us directly.
              </Text>
            </BankingCard>
          </BankingCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing['3xl'],
  },
  headerCard: {
    marginBottom: Spacing.lg,
    alignItems: 'center',
    padding: Spacing.lg,
  },
  headerIconContainer: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: '#fef3c7',
    borderRadius: BorderRadius.lg,
  },
  headerIcon: {
    fontSize: Typography.fontSize['3xl'],
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  infoBox: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  infoTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
});

export default ComplaintScreen;


import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Typography, Spacing, BorderRadius, Layout } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import BankingButton from '../components/BankingButton';
import BankingInput from '../components/BankingInput';
import Dropdown from '../components/Dropdown';
import { useApp } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import ErrorDisplay from '../components/ErrorDisplay';

const EscrowWizardScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { transactionTypes, setCurrentTransaction, loadingTypes } = useApp();
  const { phoneNumber, isGuest, setGuestPhone } = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient: '', // Can be phone number or paybill/till
    recipient_type: 'phone', // 'phone' or 'paybill'
    amount: '',
    conditions: '',
    transaction_type: '',
    account_number: '', // For paybill
    sender_phone: phoneNumber || '', // Sender's phone for guest users
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;
  
  // Step configuration with icons
  const stepConfig = [
    { number: 1, title: 'Recipient', icon: '👤' },
    { number: 2, title: 'Amount', icon: '💰' },
    { number: 3, title: 'Type', icon: '📋' },
    { number: 4, title: 'Review', icon: '✓' },
  ];

  const validateStep = (step) => {
    const newErrors = {};
    
    // On step 4 (Review & Confirm), validate all required fields
    if (step === 4) {
      // Validate step 1 fields
      if (formData.recipient_type === 'phone') {
        if (!formData.recipient || !formData.recipient.match(/^\+?254[0-9]{9}$/)) {
          newErrors.recipient = 'Valid mobile number required (+254...)';
        }
      } else if (formData.recipient_type === 'paybill') {
        if (!formData.recipient || formData.recipient.trim() === '') {
          newErrors.recipient = 'Paybill/Till number required';
        }
        if (!formData.account_number || formData.account_number.trim() === '') {
          newErrors.account_number = 'Account number required';
        }
      }
      
      // Validate step 2 fields
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Valid amount required';
      }
      
      // Validate step 3 fields
      if (!formData.transaction_type) {
        newErrors.transaction_type = 'Transaction type required';
      }
      
      // Validate sender mobile (required for API)
      const senderMobile = formData.sender_phone || phoneNumber;
      if (!senderMobile || !senderMobile.match(/^\+?254[0-9]{9}$/)) {
        newErrors.sender_phone = 'Your phone number is required (format: +254712345678)';
      }
    } else if (step === 1) {
      if (formData.recipient_type === 'phone') {
        if (!formData.recipient || !formData.recipient.match(/^\+?254[0-9]{9}$/)) {
          newErrors.recipient = 'Valid mobile number required (+254...)';
        }
      } else if (formData.recipient_type === 'paybill') {
        if (!formData.recipient || formData.recipient.trim() === '') {
          newErrors.recipient = 'Paybill/Till number required';
        }
        if (!formData.account_number || formData.account_number.trim() === '') {
          newErrors.account_number = 'Account number required';
        }
      }
    } else if (step === 2) {
      if (!formData.amount || parseFloat(formData.amount) <= 0) {
        newErrors.amount = 'Valid amount required';
      }
    } else if (step === 3) {
      if (!formData.transaction_type) {
        newErrors.transaction_type = 'Transaction type required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        // Animate step transition
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: -20,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setCurrentStep(currentStep + 1);
          // Reset and animate in
          fadeAnim.setValue(0);
          slideAnim.setValue(20);
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        });
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // Animate step transition
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(currentStep - 1);
        // Reset and animate in
        fadeAnim.setValue(0);
        slideAnim.setValue(-20);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = async () => {
    // Validate all fields including sender mobile
    const validationErrors = {};
    const senderMobile = formData.sender_phone || phoneNumber;
    
    if (!senderMobile || !senderMobile.match(/^\+?254[0-9]{9}$/)) {
      validationErrors.sender_phone = 'Your phone number is required (format: +254712345678)';
      setErrors(validationErrors);
      setSubmitError('Please enter your phone number before submitting.');
      return;
    }
    
    // Validate other fields
    if (!validateStep(4)) {
      setSubmitError('Please fix all errors before submitting.');
      return;
    }
    
    // Calculate transaction fee (1% of amount)
    const amount = parseFloat(formData.amount || 0);
    const transactionFee = Math.ceil(amount * 0.01); // 1% fee, rounded up
    
    try {
      setSubmitting(true);
      setSubmitError(null);
      
      // Prepare transaction data for API
      const apiData = {
        recipient_mobile: formData.recipient_type === 'phone' ? formData.recipient : null,
        paybill_number: formData.recipient_type === 'paybill' ? formData.recipient : null,
        account_number: formData.recipient_type === 'paybill' ? formData.account_number : null,
        payment_method: formData.recipient_type === 'phone' ? 'phone' : 'paybill',
        transaction_amount: amount,
        transaction_fee: transactionFee,
        transaction_type: formData.transaction_type,
        conditions: formData.conditions || null,
        sender_mobile: senderMobile, // API expects sender_mobile, not sender_phone
      };
      
      console.log('Submitting transaction with data:', JSON.stringify(apiData, null, 2)); // Debug log
      
      // Create transaction via API
      const response = await apiRequest(
        API_ENDPOINTS.CREATE_TRANSACTION,
        'POST',
        apiData
      );
      
      if (response.success && response.data) {
        // Prepare transaction data with API response
        const transactionData = {
          ...formData,
          ...response.data, // Include transaction_id and other fields from API
          recipient_mobile: formData.recipient_type === 'phone' ? formData.recipient : null,
          paybill_number: formData.recipient_type === 'paybill' ? formData.recipient : null,
          payment_method: formData.recipient_type === 'phone' ? 'phone' : 'paybill',
          transaction_amount: amount,
          amount: amount, // Keep both for compatibility
          transaction_fee: transactionFee,
          fee: transactionFee, // Keep both for compatibility
        };
        
        // Navigate to review/payment screen
        setCurrentTransaction(transactionData);
        navigation.navigate('Payment', { transactionData });
      } else {
        setSubmitError(response.message || 'Failed to create transaction. Please try again.');
      }
    } catch (error) {
      setSubmitError(error.message || 'Failed to create transaction. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Who is the recipient?
            </Text>
            <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
              Enter phone number or paybill/till number
            </Text>
            
            {/* Sender Phone Number for Guest Users */}
            {isGuest && (
              <View style={styles.guestPhoneSection}>
                <BankingInput
                  label="Your Phone Number *"
                  value={formData.sender_phone}
                  onChangeText={(value) => {
                    setFormData({ ...formData, sender_phone: value });
                    if (value && value.match(/^\+?254[0-9]{9}$/)) {
                      setGuestPhone(value);
                    }
                    // Clear error if valid
                    if (errors.sender_phone) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.sender_phone;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder="+254712345678"
                  keyboardType="phone-pad"
                  error={errors.sender_phone}
                  helperText="We'll use this to send you transaction updates"
                />
                {formData.sender_phone && formData.sender_phone.match(/^\+?254[0-9]{9}$/) && (
                  <TouchableOpacity
                    style={[styles.verifyLink, { borderColor: theme.primary }]}
                    onPress={() => navigation.navigate('PhoneVerification', {
                      onSuccess: () => {
                        // Phone verified, reload
                      },
                    })}
                  >
                    <Text style={[styles.verifyLinkText, { color: theme.primary }]}>
                      Verify Phone Number
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
            
            {/* Recipient Type Selection */}
            <View style={styles.paymentMethodContainer}>
              <TouchableOpacity
                style={[
                  styles.paymentMethodOption,
                  {
                    backgroundColor: formData.recipient_type === 'phone' 
                      ? theme.primarySubtle 
                      : theme.colors.backgroundSecondary,
                    borderColor: formData.recipient_type === 'phone' 
                      ? theme.primary 
                      : theme.colors.border,
                  },
                ]}
                onPress={() => {
                  setFormData({ ...formData, recipient_type: 'phone', recipient: '', account_number: '' });
                  setErrors({ ...errors, recipient: null, account_number: null });
                }}
              >
                <Text style={styles.paymentMethodIcon}>📱</Text>
                <View style={styles.paymentMethodInfo}>
                  <Text style={[styles.paymentMethodTitle, { color: theme.colors.text }]}>
                    Phone Number
                  </Text>
                </View>
                {formData.recipient_type === 'phone' && (
                  <Text style={[styles.checkmark, { color: theme.primary }]}>✓</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.paymentMethodOption,
                  {
                    backgroundColor: formData.recipient_type === 'paybill' 
                      ? theme.primarySubtle 
                      : theme.colors.backgroundSecondary,
                    borderColor: formData.recipient_type === 'paybill' 
                      ? theme.primary 
                      : theme.colors.border,
                  },
                ]}
                onPress={() => {
                  setFormData({ ...formData, recipient_type: 'paybill', recipient: '' });
                  setErrors({ ...errors, recipient: null });
                }}
              >
                <Text style={styles.paymentMethodIcon}>🏦</Text>
                <View style={styles.paymentMethodInfo}>
                  <Text style={[styles.paymentMethodTitle, { color: theme.colors.text }]}>
                    Paybill/Till
                  </Text>
                </View>
                {formData.recipient_type === 'paybill' && (
                  <Text style={[styles.checkmark, { color: theme.primary }]}>✓</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Phone Number Input */}
            {formData.recipient_type === 'phone' && (
              <BankingInput
                label="Recipient Mobile Number"
                value={formData.recipient}
                onChangeText={(value) => {
                  setFormData({ ...formData, recipient: value });
                  if (errors.recipient) {
                    setErrors({ ...errors, recipient: null });
                  }
                }}
                placeholder="+254712345678"
                keyboardType="phone-pad"
                error={errors.recipient}
                style={styles.paymentInput}
              />
            )}

            {/* Paybill/Till Inputs */}
            {formData.recipient_type === 'paybill' && (
              <>
                <BankingInput
                  label="Paybill/Till Number"
                  value={formData.recipient}
                  onChangeText={(value) => {
                    setFormData({ ...formData, recipient: value });
                    if (errors.recipient) {
                      setErrors({ ...errors, recipient: null });
                    }
                  }}
                  placeholder="123456"
                  keyboardType="numeric"
                  error={errors.recipient}
                  style={styles.paymentInput}
                />
                <BankingInput
                  label="Account Number"
                  value={formData.account_number}
                  onChangeText={(value) => {
                    setFormData({ ...formData, account_number: value });
                    if (errors.account_number) {
                      setErrors({ ...errors, account_number: null });
                    }
                  }}
                  placeholder="Account number"
                  keyboardType="default"
                  error={errors.account_number}
                  style={styles.paymentInput}
                />
              </>
            )}
          </View>
        );
      
      case 2:
        return (
          <View>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              How much?
            </Text>
            <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
              Enter the escrow amount in Kenyan Shillings
            </Text>
            <BankingInput
              label="Amount (KES)"
              value={formData.amount}
              onChangeText={(value) => {
                setFormData({ ...formData, amount: value });
                if (errors.amount) {
                  setErrors({ ...errors, amount: null });
                }
              }}
              placeholder="0.00"
              keyboardType="numeric"
              error={errors.amount}
            />
          </View>
        );
      
      case 3:
        return (
          <View>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Transaction Type
            </Text>
            <Text style={[styles.stepDescription, { color: theme.colors.textSecondary }]}>
              Select the type of transaction
            </Text>
            <View style={styles.dropdownContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Type
              </Text>
              {loadingTypes ? (
                <View style={[styles.dropdownLoading, { borderColor: theme.colors.border }]}>
                  <Text style={[styles.loadingText, { color: theme.colors.textTertiary }]}>
                    Loading transaction types...
                  </Text>
                </View>
              ) : (
                <>
                  <Dropdown
                    options={transactionTypes}
                    value={formData.transaction_type}
                    onValueChange={(value) => {
                      setFormData({ ...formData, transaction_type: value });
                      if (errors.transaction_type) {
                        setErrors({ ...errors, transaction_type: null });
                      }
                    }}
                    placeholder="Select transaction type"
                    style={errors.transaction_type && styles.inputError}
                  />
                  {errors.transaction_type && (
                    <Text style={[styles.fieldError, { color: theme.error }]}>
                      {errors.transaction_type}
                    </Text>
                  )}
                </>
              )}
            </View>
            <BankingInput
              label="Conditions (Optional)"
              value={formData.conditions}
              onChangeText={(value) => setFormData({ ...formData, conditions: value })}
              placeholder="Describe release conditions..."
              multiline
              helperText="When should funds be released?"
            />
          </View>
        );
      
      case 4:
        return (
          <View>
            <Text style={[styles.stepTitle, { color: theme.colors.text }]}>
              Review & Confirm
            </Text>
            {/* Show validation errors if any */}
            {Object.keys(errors).length > 0 && (
              <BankingCard style={[styles.reviewCard, { backgroundColor: theme.errorLight || '#fee2e2', borderColor: theme.error || '#ef4444', borderWidth: 1 }]}>
                <Text style={[styles.errorTitle, { color: theme.error || '#ef4444' }]}>
                  Please fix the following errors:
                </Text>
                {errors.recipient && (
                  <Text style={[styles.fieldError, { color: theme.error || '#ef4444', marginTop: Spacing.xs }]}>
                    • {errors.recipient}
                  </Text>
                )}
                {errors.account_number && (
                  <Text style={[styles.fieldError, { color: theme.error || '#ef4444', marginTop: Spacing.xs }]}>
                    • {errors.account_number}
                  </Text>
                )}
                {errors.amount && (
                  <Text style={[styles.fieldError, { color: theme.error || '#ef4444', marginTop: Spacing.xs }]}>
                    • {errors.amount}
                  </Text>
                )}
                {errors.transaction_type && (
                  <Text style={[styles.fieldError, { color: theme.error || '#ef4444', marginTop: Spacing.xs }]}>
                    • {errors.transaction_type}
                  </Text>
                )}
              </BankingCard>
            )}
            <View style={styles.reviewGrid}>
              <BankingCard style={[styles.reviewCard, styles.reviewCardHighlight, { borderLeftColor: theme.primary }]}>
                <View style={styles.reviewSection}>
                  <Text style={[styles.reviewSectionTitle, { color: theme.colors.textSecondary }]}>
                    Recipient Details
                  </Text>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>
                      Type
                    </Text>
                    <Text style={[styles.reviewValue, { color: theme.primary }]}>
                      {formData.recipient_type === 'phone' ? 'Phone Number' : 'Paybill/Till'}
                    </Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>
                      {formData.recipient_type === 'phone' ? 'Mobile Number' : 'Paybill/Till Number'}
                    </Text>
                    <Text style={[styles.reviewValue, { color: theme.colors.text }]}>
                      {formData.recipient}
                    </Text>
                  </View>
                  {formData.recipient_type === 'paybill' && (
                    <View style={styles.reviewRow}>
                      <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>
                        Account Number
                      </Text>
                      <Text style={[styles.reviewValue, { color: theme.colors.text }]}>
                        {formData.account_number}
                      </Text>
                    </View>
                  )}
                </View>
              </BankingCard>

              <BankingCard style={[styles.reviewCard, styles.reviewCardHighlight, { borderLeftColor: theme.primary }]}>
                <View style={styles.reviewSection}>
                  <Text style={[styles.reviewSectionTitle, { color: theme.colors.textSecondary }]}>
                    Transaction Details
                  </Text>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>
                      Amount
                    </Text>
                    <Text style={[styles.reviewValue, { color: theme.primary, fontSize: Typography.fontSize.lg }]}>
                      KES {parseFloat(formData.amount || 0).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.reviewRow}>
                    <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>
                      Type
                    </Text>
                    <Text style={[styles.reviewValue, { color: theme.colors.text }]}>
                      {transactionTypes.find(t => t.value === formData.transaction_type)?.label || 'N/A'}
                    </Text>
                  </View>
                  {formData.conditions && (
                    <View style={styles.reviewRow}>
                      <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>
                        Conditions
                      </Text>
                      <Text style={[styles.reviewValue, { color: theme.colors.text }]}>
                        {formData.conditions}
                      </Text>
                    </View>
                  )}
                </View>
              </BankingCard>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Modern Progress Indicator */}
      <View style={[styles.progressContainer, { backgroundColor: theme.colors.background, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight }]}>
        <View style={styles.stepDotsContainer}>
          {stepConfig.map((step, index) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const stepProgress = ((index + 1) / totalSteps) * 100;
            const isProgressed = progress >= stepProgress;
            
            return (
              <React.Fragment key={step.number}>
                <View style={styles.stepDotWrapper}>
                  <View
                    style={[
                      styles.stepDot,
                      {
                        backgroundColor: isCompleted || isActive
                          ? theme.primary
                          : theme.colors.border,
                        borderColor: isActive ? theme.primary : 'transparent',
                        transform: [{ scale: isActive ? 1.1 : 1 }],
                      },
                    ]}
                  >
                    {isCompleted ? (
                      <Text style={styles.stepCheckmark}>✓</Text>
                    ) : (
                      <Text style={styles.stepIcon}>{step.icon}</Text>
                    )}
                  </View>
                  {isActive && (
                    <Text style={[styles.stepLabel, { color: theme.primary }]}>
                      {step.title}
                    </Text>
                  )}
                </View>
                {index < totalSteps - 1 && (
                  <View
                    style={[
                      styles.stepConnector,
                      {
                        backgroundColor: isProgressed
                          ? theme.primary
                          : theme.colors.border,
                      },
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          </View>
          <Text style={[styles.stepIndicator, { color: theme.colors.textSecondary }]}>
            {Math.round(progress)}% Complete
          </Text>
        </View>
      </View>

      <ErrorDisplay error={submitError} onDismiss={() => setSubmitError(null)} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <BankingCard variant="elevated" style={styles.contentCard}>
            {renderStepContent()}
          </BankingCard>
        </Animated.View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        {currentStep > 1 && (
          <View style={styles.footerButton}>
            <BankingButton
              title="Back"
              variant="outline"
              onPress={handleBack}
              size="md"
              fullWidth
            />
          </View>
        )}
        <View style={[styles.footerButton, currentStep === 1 && styles.footerButtonFull]}>
          <BankingButton
            title={currentStep === totalSteps ? 'Confirm' : 'Next'}
            onPress={handleNext}
            size="md"
            fullWidth
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    padding: Spacing.sm,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  stepDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    paddingHorizontal: Spacing.xs,
  },
  stepDotWrapper: {
    alignItems: 'center',
    position: 'relative',
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  stepIcon: {
    fontSize: 14,
  },
  stepCheckmark: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: Typography.fontSize.xs * 0.85,
    fontWeight: Typography.fontWeight.semibold,
    marginTop: Math.round(2 * Layout.mobileScale),
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    marginHorizontal: Spacing.xs / 2,
    borderRadius: 1,
    backgroundColor: '#e2e8f0',
  },
  progressBarContainer: {
    marginTop: Spacing.xs,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f3f4f6',
    borderRadius: 2,
    marginBottom: Spacing.xs,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  stepIndicator: {
    fontSize: Typography.fontSize.xs * 0.85,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginTop: Math.round(2 * Layout.mobileScale),
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Layout.screenPadding,
    paddingBottom: Spacing['3xl'],
  },
  stepTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },
  stepDescription: {
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    opacity: 0.8,
  },
  contentCard: {
    marginTop: Spacing.md,
  },
  dropdownContainer: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
  },
  inputError: {
    borderColor: '#ef4444',
  },
  fieldError: {
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.xs,
  },
  errorTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  reviewGrid: {
    gap: Spacing.md,
  },
  reviewCard: {
    marginTop: 0,
  },
  reviewCardHighlight: {
    borderLeftWidth: 4,
  },
  reviewSection: {
    gap: Spacing.sm,
  },
  reviewSectionTitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    opacity: 0.6,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  reviewLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    opacity: 0.7,
    flex: 1,
  },
  reviewValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'right',
    flex: 1,
    marginLeft: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: Spacing.sm,
    alignItems: 'stretch', // Ensure buttons stretch to same height
  },
  footerButton: {
    flex: 1,
    minWidth: 0, // Allow flex to work properly
    minHeight: Math.round(44 * Layout.mobileScale), // Ensure consistent height
  },
  footerButtonFull: {
    flex: 1,
    width: '100%',
  },
  paymentMethodContainer: {
    marginBottom: Spacing.lg,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    marginBottom: Spacing.md,
    transition: 'all 0.2s ease',
  },
  paymentMethodIcon: {
    fontSize: Typography.fontSize['3xl'],
    marginRight: Spacing.md,
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  paymentMethodDesc: {
    fontSize: Typography.fontSize.sm,
  },
  checkmark: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  paymentInput: {
    marginTop: Spacing.md,
  },
  guestPhoneSection: {
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  verifyLink: {
    marginTop: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  verifyLinkText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  dropdownLoading: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: Math.round(48 * Layout.mobileScale),
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
  },
});

export default EscrowWizardScreen;


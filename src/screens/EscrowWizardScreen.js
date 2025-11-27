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

const EscrowWizardScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { transactionTypes, setCurrentTransaction, loadingTypes } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient_mobile: '',
    amount: '',
    conditions: '',
    transaction_type: '',
    payment_method: 'mpesa',
  });
  const [errors, setErrors] = useState({});

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.recipient_mobile || !formData.recipient_mobile.match(/^\+?254[0-9]{9}$/)) {
        newErrors.recipient_mobile = 'Valid mobile number required (+254...)';
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
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleSubmit = () => {
    // Calculate transaction fee (1% of amount)
    const amount = parseFloat(formData.amount || 0);
    const transactionFee = Math.ceil(amount * 0.01); // 1% fee, rounded up
    
    // Prepare transaction data with correct field names
    const transactionData = {
      ...formData,
      transaction_amount: amount,
      amount: amount, // Keep both for compatibility
      transaction_fee: transactionFee,
      fee: transactionFee, // Keep both for compatibility
    };
    
    // Navigate to review/payment screen
    setCurrentTransaction(transactionData);
    navigation.navigate('Payment', { transactionData });
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
              Enter the mobile number of the person receiving the escrow payment
            </Text>
            <BankingInput
              label="Recipient Mobile Number"
              value={formData.recipient_mobile}
              onChangeText={(value) => {
                setFormData({ ...formData, recipient_mobile: value });
                if (errors.recipient_mobile) {
                  setErrors({ ...errors, recipient_mobile: null });
                }
              }}
              placeholder="+254712345678"
              keyboardType="phone-pad"
              error={errors.recipient_mobile}
            />
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
            <BankingCard style={styles.reviewCard}>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>
                  Recipient
                </Text>
                <Text style={[styles.reviewValue, { color: theme.colors.text }]}>
                  {formData.recipient_mobile}
                </Text>
              </View>
              <View style={styles.reviewRow}>
                <Text style={[styles.reviewLabel, { color: theme.colors.textSecondary }]}>
                  Amount
                </Text>
                <Text style={[styles.reviewValue, { color: theme.colors.text }]}>
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
            </BankingCard>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Progress Bar */}
      <View style={[styles.progressContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.progressBar}>
          <View
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
          Step {currentStep} of {totalSteps}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <BankingCard variant="elevated">
          {renderStepContent()}
        </BankingCard>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
        {currentStep > 1 && (
          <BankingButton
            title="Back"
            variant="outline"
            onPress={handleBack}
            style={styles.footerButton}
          />
        )}
        <BankingButton
          title={currentStep === totalSteps ? 'Confirm' : 'Next'}
          onPress={handleNext}
          style={[styles.footerButton, currentStep === 1 && styles.footerButtonFull]}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressContainer: {
    padding: Spacing.md,
    paddingTop: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e2e8f0',
    borderRadius: 2,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  stepIndicator: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Layout.screenPadding,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
  },
  stepDescription: {
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
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
  reviewCard: {
    marginTop: Spacing.md,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  reviewLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  reviewValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
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
  },
  footerButton: {
    flex: 1,
    minWidth: 0, // Allow flex to work properly
  },
  footerButtonFull: {
    flex: 1,
    width: '100%',
  },
  dropdownLoading: {
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    minHeight: 48,
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
  },
});

export default EscrowWizardScreen;


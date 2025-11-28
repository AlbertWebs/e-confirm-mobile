import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { Typography, Spacing, BorderRadius, Layout, Shadows } from '../theme/designSystem';
import BankingInput from './BankingInput';
import BankingButton from './BankingButton';
import ErrorDisplay from './ErrorDisplay';

const LoginModal = ({ visible, onClose, onSuccess }) => {
  const theme = useTheme();
  const { sendOTP, verifyOTP } = useUser();
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for OTP resend
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSendOTP = async () => {
    if (!phone || !phone.match(/^\+?254[0-9]{9}$/)) {
      setError('Please enter a valid Kenyan phone number (+254...)');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await sendOTP(phone);
    
    if (result.success) {
      setStep('otp');
      setCountdown(60);
      setCanResend(false);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await verifyOTP(phone, otpCode);
    
    if (result.success) {
      if (onSuccess) {
        onSuccess(result.user);
      }
      handleClose();
    } else {
      setError(result.message);
      setOtp(['', '', '', '', '', '']);
    }
    
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setCanResend(false);
    setCountdown(60);
    await handleSendOTP();
  };

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      // Focus next input (handled by refs if needed)
    }
  };

  const handleClose = () => {
    setStep('phone');
    setPhone('');
    setOtp(['', '', '', '', '', '']);
    setError(null);
    setCountdown(0);
    setCanResend(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {step === 'phone' ? 'Login' : 'Verify OTP'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={[styles.closeButtonText, { color: theme.colors.textTertiary }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <ErrorDisplay error={error} onDismiss={() => setError(null)} />

            {step === 'phone' ? (
              <View>
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                  Enter your phone number to receive an OTP code
                </Text>
                <BankingInput
                  label="Phone Number"
                  value={phone}
                  onChangeText={(value) => {
                    setPhone(value);
                    setError(null);
                  }}
                  placeholder="+254712345678"
                  keyboardType="phone-pad"
                  error={error && error.includes('phone') ? error : null}
                />
                <BankingButton
                  title="Send OTP"
                  onPress={handleSendOTP}
                  loading={loading}
                  fullWidth
                  size="lg"
                  style={styles.submitButton}
                />
              </View>
            ) : (
              <View>
                <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                  Enter the 6-digit code sent to {phone}
                </Text>
                <View style={styles.otpContainer}>
                  {otp.map((digit, index) => (
                    <View key={index} style={styles.otpInputWrapper}>
                      <TextInput
                        style={[
                          styles.otpInput,
                          {
                            backgroundColor: theme.colors.background,
                            borderColor: error ? theme.error : theme.colors.border,
                            color: theme.colors.text,
                          },
                          otp[index] && styles.otpInputFilled,
                        ]}
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                      />
                    </View>
                  ))}
                </View>
                <View style={styles.resendContainer}>
                  {countdown > 0 ? (
                    <Text style={[styles.resendText, { color: theme.colors.textTertiary }]}>
                      Resend code in {countdown}s
                    </Text>
                  ) : (
                    <TouchableOpacity onPress={handleResendOTP} disabled={!canResend}>
                      <Text style={[styles.resendLink, { color: theme.primary }]}>
                        Resend OTP
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <BankingButton
                  title="Verify OTP"
                  onPress={handleVerifyOTP}
                  loading={loading}
                  fullWidth
                  size="lg"
                  style={styles.submitButton}
                />
                <TouchableOpacity onPress={() => setStep('phone')} style={styles.backLink}>
                  <Text style={[styles.backLinkText, { color: theme.colors.textSecondary }]}>
                    ← Change phone number
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    maxHeight: '90%',
    ...Shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  description: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  submitButton: {
    marginTop: Spacing.md,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  otpInputWrapper: {
    flex: 1,
  },
  otpInput: {
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderRadius: BorderRadius.md,
    textAlign: 'center',
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  otpInputFilled: {
    borderColor: '#18743c',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  resendText: {
    fontSize: Typography.fontSize.sm,
  },
  resendLink: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  backLink: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  backLinkText: {
    fontSize: Typography.fontSize.sm,
  },
});

export default LoginModal;


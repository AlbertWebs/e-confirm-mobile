import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { Typography, Spacing, BorderRadius, Layout } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import BankingButton from '../components/BankingButton';
import BankingInput from '../components/BankingInput';
import ErrorDisplay from '../components/ErrorDisplay';

const PhoneVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { sendOTP, verifyOTP, setGuestPhone } = useUser();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);
  
  const otpInputs = useRef([]);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
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
      Alert.alert('Success', 'OTP sent to your phone number');
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
      // Set phone for guest transactions
      await setGuestPhone(phone);
      Alert.alert('Success', 'Phone verified successfully!', [
        {
          text: 'OK',
          onPress: () => {
            if (route.params?.onSuccess) {
              route.params.onSuccess();
            }
            navigation.goBack();
          },
        },
      ]);
    } else {
      setError(result.message);
      // Clear OTP on error
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
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      // Focus last input
      if (otpInputs.current[5]) {
        otpInputs.current[5].focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && otpInputs.current[index + 1]) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1].focus();
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
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
        <BankingCard variant="elevated" style={styles.card}>
          {step === 'phone' ? (
            <>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Verify Your Phone Number
              </Text>
              <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                We'll send you a verification code via SMS to confirm your phone number
              </Text>

              <View style={styles.inputContainer}>
                <BankingInput
                  label="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+254712345678"
                  keyboardType="phone-pad"
                  autoFocus
                />
              </View>

              <BankingButton
                title="Send OTP"
                onPress={handleSendOTP}
                loading={loading}
                disabled={loading || !phone}
                fullWidth
                size="md"
                style={styles.button}
              />
            </>
          ) : (
            <>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Enter Verification Code
              </Text>
              <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
                We sent a 6-digit code to {phone}
              </Text>

              <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (otpInputs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      {
                        borderColor: digit
                          ? theme.primary
                          : theme.colors.border,
                        backgroundColor: theme.colors.background,
                        color: theme.colors.text,
                      },
                    ]}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(value, index)}
                    onKeyPress={(e) => handleOtpKeyPress(e, index)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>

              <View style={styles.resendContainer}>
                {countdown > 0 ? (
                  <Text style={[styles.resendText, { color: theme.colors.textSecondary }]}>
                    Resend code in {countdown}s
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResendOTP} disabled={!canResend}>
                    <Text style={[styles.resendLink, { color: theme.primary }]}>
                      Resend Code
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <BankingButton
                title="Verify"
                onPress={handleVerifyOTP}
                loading={loading}
                disabled={loading || otp.join('').length !== 6}
                fullWidth
                size="md"
                style={styles.button}
              />

              <TouchableOpacity
                onPress={() => {
                  setStep('phone');
                  setOtp(['', '', '', '', '', '']);
                  setError(null);
                }}
                style={styles.backButton}
              >
                <Text style={[styles.backText, { color: theme.colors.textSecondary }]}>
                  Change Phone Number
                </Text>
              </TouchableOpacity>
            </>
          )}
        </BankingCard>
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
    justifyContent: 'center',
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
  inputContainer: {
    marginBottom: Spacing.lg,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  otpInput: {
    flex: 1,
    height: Math.round(56 * Layout.mobileScale),
    borderWidth: 2,
    borderRadius: BorderRadius.md,
    textAlign: 'center',
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
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
  button: {
    marginTop: Spacing.md,
  },
  backButton: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  backText: {
    fontSize: Typography.fontSize.sm,
  },
});

export default PhoneVerificationScreen;


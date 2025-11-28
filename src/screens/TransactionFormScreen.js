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
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import { useApp } from '../context/AppContext';
import Dropdown from '../components/Dropdown';
import { ShieldIcon, DocumentIcon } from '../components/SvgIcons';
import ErrorDisplay from '../components/ErrorDisplay';
import { Typography, Spacing, BorderRadius, Layout } from '../theme/designSystem';

const { width } = Dimensions.get('window');

const TransactionFormScreen = () => {
  const navigation = useNavigation();
  const { setCurrentTransaction, transactionTypes, setTransactionTypes } = useApp();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const [loading, setLoading] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({
    transaction_type: '',
    transaction_amount: '',
    sender_mobile: '',
    receiver_mobile: '',
    transaction_details: '',
    payment_method: 'mpesa',
    paybill_till_number: '',
  });

  useEffect(() => {
    loadTransactionTypes();
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

  const loadTransactionTypes = async () => {
    try {
      setLoadingTypes(true);
      const response = await apiRequest(API_ENDPOINTS.TRANSACTION_TYPES);
      if (response && response.success && response.data) {
        setTransactionTypes(response.data);
      } else {
        console.warn('Failed to load transaction types:', response?.message || 'Unknown error');
        // Don't show alert on web, just log it
        if (Platform.OS === 'web') {
          console.error('Transaction types not loaded:', response);
        } else {
          Alert.alert('Error', response?.message || 'Failed to load transaction types');
        }
      }
    } catch (error) {
      console.error('Error loading transaction types:', error);
      if (Platform.OS !== 'web') {
        Alert.alert('Error', 'Failed to load transaction types');
      }
    } finally {
      setLoadingTypes(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors = {};
    let hasError = false;

    // Clear previous errors
    setFieldErrors({});
    setError(null);

    if (!formData.transaction_type) {
      errors.transaction_type = 'Please select a transaction type';
      hasError = true;
    }
    if (!formData.transaction_amount || parseFloat(formData.transaction_amount) <= 0) {
      errors.transaction_amount = 'Please enter a valid transaction amount';
      hasError = true;
    }
    if (!formData.sender_mobile || !formData.sender_mobile.match(/^\+?254[0-9]{9}$/)) {
      errors.sender_mobile = 'Please enter a valid sender mobile number (format: +254712345678)';
      hasError = true;
    }
    if (!formData.receiver_mobile || !formData.receiver_mobile.match(/^\+?254[0-9]{9}$/)) {
      errors.receiver_mobile = 'Please enter a valid receiver mobile number (format: +254712345678)';
      hasError = true;
    }
    if (formData.payment_method === 'paybill' && !formData.paybill_till_number) {
      errors.paybill_till_number = 'Please enter Paybill/Till number';
      hasError = true;
    }

    if (hasError) {
      setFieldErrors(errors);
      setError('Please fix the errors in the form');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest(
        API_ENDPOINTS.CREATE_TRANSACTION,
        'POST',
        {
          ...formData,
          transaction_amount: parseFloat(formData.transaction_amount),
        }
      );

      if (response.success) {
        setCurrentTransaction(response.data);
        navigation.navigate('Payment', { transactionData: response.data });
      } else {
        setError(response.message || 'Failed to create transaction. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'Failed to create transaction. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionTypeLabel = (value) => {
    const type = transactionTypes.find(t => t.value === value);
    return type ? type.label : value;
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ErrorDisplay error={error} onDismiss={() => setError(null)} />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <ShieldIcon size={32} color="#18743c" />
          </View>
          <Text style={styles.title}>Create Escrow Transaction</Text>
          <Text style={styles.subtitle}>Secure your payment with eConfirm</Text>
        </View>

        <View style={styles.form}>
          {/* Transaction Type */}
          <View style={styles.section}>
            <Text style={styles.label}>Transaction Type *</Text>
            <Dropdown
              options={transactionTypes}
              value={formData.transaction_type}
              onValueChange={(value) => {
                handleInputChange('transaction_type', value);
                if (fieldErrors.transaction_type) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.transaction_type;
                    return newErrors;
                  });
                }
              }}
              placeholder="Select transaction type"
              loading={loadingTypes}
              style={[styles.dropdown, fieldErrors.transaction_type && styles.inputError]}
            />
            {fieldErrors.transaction_type && (
              <Text style={styles.fieldError}>{fieldErrors.transaction_type}</Text>
            )}
          </View>

          {/* Amount */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Transaction Amount (KES) *</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currency}>KES</Text>
              <TextInput
                style={[styles.amountInput, fieldErrors.transaction_amount && styles.inputError]}
                placeholder="0.00"
                keyboardType="numeric"
                value={formData.transaction_amount}
                onChangeText={(value) => {
                  handleInputChange('transaction_amount', value);
                  if (fieldErrors.transaction_amount) {
                    setFieldErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.transaction_amount;
                      return newErrors;
                    });
                  }
                }}
              />
            </View>
            {fieldErrors.transaction_amount && (
              <Text style={styles.fieldError}>{fieldErrors.transaction_amount}</Text>
            )}
          </View>

          {/* Payment Method */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Payment Method *</Text>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioOption,
                  formData.payment_method === 'mpesa' && styles.radioOptionActive,
                ]}
                onPress={() => handleInputChange('payment_method', 'mpesa')}
              >
                <View style={[
                  styles.radioCircle,
                  formData.payment_method === 'mpesa' && styles.radioCircleActive,
                ]} />
                <Text style={styles.radioLabel}>M-Pesa Number</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioOption,
                  formData.payment_method === 'paybill' && styles.radioOptionActive,
                ]}
                onPress={() => handleInputChange('payment_method', 'paybill')}
              >
                <View style={[
                  styles.radioCircle,
                  formData.payment_method === 'paybill' && styles.radioCircleActive,
                ]} />
                <Text style={styles.radioLabel}>Paybill/Buy Goods</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Paybill Number (conditional) */}
          {formData.payment_method === 'paybill' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Paybill/Till Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Paybill or Till number"
                value={formData.paybill_till_number}
                onChangeText={(value) => {
                  handleInputChange('paybill_till_number', value);
                  if (fieldErrors.paybill_till_number) {
                    setFieldErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.paybill_till_number;
                      return newErrors;
                    });
                  }
                }}
                keyboardType="numeric"
                style={fieldErrors.paybill_till_number && styles.inputError}
              />
              {fieldErrors.paybill_till_number && (
                <Text style={styles.fieldError}>{fieldErrors.paybill_till_number}</Text>
              )}
            </View>
          )}

          {/* Sender Mobile */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Mobile Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="+254712345678"
              value={formData.sender_mobile}
              onChangeText={(value) => {
                handleInputChange('sender_mobile', value);
                if (fieldErrors.sender_mobile) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.sender_mobile;
                    return newErrors;
                  });
                }
              }}
              keyboardType="phone-pad"
              style={fieldErrors.sender_mobile && styles.inputError}
            />
            {fieldErrors.sender_mobile && (
              <Text style={styles.fieldError}>{fieldErrors.sender_mobile}</Text>
            )}
          </View>

          {/* Receiver Mobile */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Mobile Number *</Text>
            <TextInput
              style={styles.input}
              placeholder="+254712345678"
              value={formData.receiver_mobile}
              onChangeText={(value) => {
                handleInputChange('receiver_mobile', value);
                if (fieldErrors.receiver_mobile) {
                  setFieldErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.receiver_mobile;
                    return newErrors;
                  });
                }
              }}
              keyboardType="phone-pad"
              style={fieldErrors.receiver_mobile && styles.inputError}
            />
            {fieldErrors.receiver_mobile && (
              <Text style={styles.fieldError}>{fieldErrors.receiver_mobile}</Text>
            )}
          </View>

          {/* Transaction Details */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Transaction Details (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your transaction..."
              value={formData.transaction_details}
              onChangeText={(value) => handleInputChange('transaction_details', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={['#18743c', '#10b981']}
              style={styles.submitGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Continue to Payment</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: width > 768 ? 30 : 20,
    paddingTop: width > 768 ? 20 : 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  headerIconContainer: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    backgroundColor: '#f0fdf4',
    borderRadius: BorderRadius.lg,
  },
  title: {
    fontSize: width > 768 ? Typography.fontSize['3xl'] : Typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: width > 768 ? Typography.fontSize.base : Typography.fontSize.sm,
    color: '#64748b',
  },
  form: {
    padding: width > 768 ? 30 : 20,
    maxWidth: width > 768 ? 800 : '100%',
    alignSelf: width > 768 ? 'center' : 'stretch',
    width: '100%',
  },
  section: {
    marginBottom: Spacing.lg,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: '#374151',
    marginBottom: Spacing.sm,
  },
  dropdown: {
    marginTop: Spacing.sm,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: Spacing.md,
    height: Math.round(56 * (width > 768 ? 1 : Layout.mobileScale)),
  },
  currency: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: '#18743c',
    marginRight: Spacing.sm,
  },
  amountInput: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: '#0f172a',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: width > 768 ? Spacing.lg : Spacing.md,
    paddingVertical: width > 768 ? Spacing.md : Math.round(14 * Layout.mobileScale),
    fontSize: width > 768 ? Typography.fontSize.lg : Typography.fontSize.base,
    color: '#0f172a',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
    backgroundColor: '#fef2f2',
  },
  fieldError: {
    color: '#ef4444',
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.xs,
    marginLeft: Spacing.xs,
    fontWeight: '500',
  },
  textArea: {
    height: Math.round(100 * Layout.mobileScale),
    paddingTop: Math.round(14 * Layout.mobileScale),
  },
  radioGroup: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  radioOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: width > 768 ? 16 : 14,
    minWidth: 0, // Prevents overflow on small screens
  },
  radioOptionActive: {
    borderColor: '#18743c',
    backgroundColor: '#f0fdf4',
  },
  radioCircle: {
    width: Math.round(20 * Layout.mobileScale),
    height: Math.round(20 * Layout.mobileScale),
    borderRadius: Math.round(10 * Layout.mobileScale),
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: Spacing.md,
  },
  radioCircleActive: {
    borderColor: '#18743c',
    backgroundColor: '#18743c',
  },
  submitButton: {
    marginTop: width > 768 ? Spacing.lg : Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#18743c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitGradient: {
    paddingVertical: width > 768 ? Spacing.md : Math.round(16 * Layout.mobileScale),
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: width > 768 ? Typography.fontSize.lg : Typography.fontSize.base,
    fontWeight: '700',
  },
});

export default TransactionFormScreen;



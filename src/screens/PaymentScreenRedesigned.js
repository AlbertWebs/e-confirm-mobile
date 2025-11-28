import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Typography, Spacing, BorderRadius, Layout } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import BankingButton from '../components/BankingButton';
import ErrorDisplay from '../components/ErrorDisplay';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import { useApp } from '../context/AppContext';

const PaymentScreenRedesigned = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { currentTransaction, setCurrentTransaction } = useApp();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const transactionData = route.params?.transactionData || currentTransaction;

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

  useEffect(() => {
    if (!transactionData) {
      setError('Transaction data not found. Please create a new transaction.');
    }
  }, []);

  const handleInitiatePayment = async () => {
    if (!transactionData) return;

    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest(
        API_ENDPOINTS.INITIATE_PAYMENT,
        'POST',
        { transaction_id: transactionData.transaction_id }
      );

      if (response.success) {
        setCurrentTransaction({
          ...transactionData,
          checkout_request_id: response.data.checkout_request_id,
          status: response.data.status,
        });
        
        navigation.navigate('PaymentStatus', {
          checkoutRequestId: response.data.checkout_request_id,
          transactionId: transactionData.transaction_id,
        });
      } else {
        setError(response.message || 'Failed to initiate payment. Please try again.');
      }
    } catch (error) {
      setError(error.message || 'Failed to initiate payment. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!transactionData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading...</Text>
      </View>
    );
  }

  // Calculate amounts - handle both field name variations
  const transactionAmount = transactionData.transaction_amount || transactionData.amount || 0;
  const transactionFee = transactionData.transaction_fee || transactionData.fee || 0;
  const totalAmount = parseFloat(transactionAmount) + parseFloat(transactionFee);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: theme.colors.background }]}>
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding: Layout.screenPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <BankingCard variant="elevated" style={styles.summaryCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Payment Summary
          </Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Transaction Amount
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              KES {parseFloat(transactionAmount).toLocaleString()}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
              Transaction Fee (1%)
            </Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
              KES {parseFloat(transactionFee).toLocaleString()}
            </Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
              Total Amount
            </Text>
            <Text style={[styles.totalValue, { color: theme.primary }]}>
              KES {totalAmount.toLocaleString()}
            </Text>
          </View>
        </BankingCard>

        {/* Payment Method */}
        <BankingCard variant="elevated" style={styles.methodCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            Payment Method
          </Text>
          <View style={[styles.methodBox, { backgroundColor: theme.primarySubtle }]}>
            <Text style={styles.methodIcon}>📱</Text>
            <Text style={[styles.methodName, { color: theme.colors.text }]}>
              M-Pesa
            </Text>
          </View>
        </BankingCard>

        {/* Instructions */}
        <BankingCard style={styles.instructionsCard}>
          <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
            What happens next?
          </Text>
          <InstructionStep number={1} text="Tap 'Pay with M-Pesa' to initiate payment" theme={theme} />
          <InstructionStep number={2} text="Enter your M-Pesa PIN when prompted" theme={theme} />
          <InstructionStep number={3} text="Wait for payment confirmation" theme={theme} />
        </BankingCard>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <View style={styles.actionButtonWrapper}>
            <BankingButton
              title="Back"
              variant="outline"
              onPress={() => navigation.goBack()}
              disabled={loading}
              size="md"
              fullWidth
            />
          </View>
          <View style={styles.actionButtonWrapper}>
            <BankingButton
              title={loading ? 'Processing...' : 'Pay with M-Pesa'}
              onPress={handleInitiatePayment}
              loading={loading}
              disabled={loading}
              size="md"
              fullWidth
            />
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const InstructionStep = ({ number, text, theme }) => (
  <View style={styles.instructionStep}>
    <View style={[styles.stepNumber, { backgroundColor: theme.primary }]}>
      <Text style={styles.stepNumberText}>{number}</Text>
    </View>
    <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing['3xl'],
  },
  summaryCard: {
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    fontSize: Typography.fontSize.base,
  },
  summaryValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.md,
  },
  totalLabel: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  totalValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  methodCard: {
    marginBottom: Spacing.lg,
  },
  methodBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.sm,
  },
  methodIcon: {
    fontSize: Typography.fontSize['2xl'],
    marginRight: Spacing.sm,
  },
  methodName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  instructionsCard: {
    marginBottom: Spacing.lg,
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  stepNumber: {
    width: Math.round(24 * Layout.mobileScale),
    height: Math.round(24 * Layout.mobileScale),
    borderRadius: Math.round(12 * Layout.mobileScale),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
  },
  instructionText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  actionButtonWrapper: {
    flex: 1,
    minWidth: 0,
    minHeight: Math.round(44 * Layout.mobileScale),
  },
  loadingText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

export default PaymentScreenRedesigned;


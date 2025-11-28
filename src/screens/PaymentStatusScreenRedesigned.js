import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Typography, Spacing, BorderRadius, Layout } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import BankingButton from '../components/BankingButton';
import StatusBadge from '../components/StatusBadge';
import { apiRequest, API_ENDPOINTS } from '../config/api';

const PaymentStatusScreenRedesigned = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { checkoutRequestId, transactionId } = route.params;

  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Waiting for payment confirmation...');
  const [loading, setLoading] = useState(true);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;

  useFocusEffect(
    React.useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();

      if (checkoutRequestId) {
        checkPaymentStatus();
        const interval = setInterval(() => {
          checkPaymentStatus();
        }, 3000);

        setTimeout(() => {
          clearInterval(interval);
          if (status === 'pending') {
            setMessage('Payment confirmation timed out. Please check your transaction status.');
          }
        }, 120000);

        return () => clearInterval(interval);
      }
    }, [checkoutRequestId])
  );

  const checkPaymentStatus = async () => {
    try {
      const response = await apiRequest(
        API_ENDPOINTS.CHECK_PAYMENT_STATUS,
        'POST',
        { checkout_request_id: checkoutRequestId }
      );

      if (response.success && response.status === 'completed') {
        setStatus('completed');
        setMessage(response.message || 'Payment successful! Funds are now in escrow.');
        setLoading(false);
      } else if (response.status === 'failed') {
        setStatus('failed');
        setMessage(response.message || 'Payment failed or was cancelled.');
        setLoading(false);
      } else {
        setStatus('pending');
        setMessage(response.message || 'Waiting for payment confirmation...');
      }
    } catch (error) {
      console.error('Payment status check error:', error);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'completed':
        return {
          icon: '✓',
          colors: [theme.success, '#059669'],
          title: 'Payment Successful',
        };
      case 'failed':
        return {
          icon: '✕',
          colors: [theme.error, '#dc2626'],
          title: 'Payment Failed',
        };
      default:
        return {
          icon: null,
          colors: [theme.primary, theme.primaryDark],
          title: 'Processing Payment',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding: Layout.screenPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.statusContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Status Icon */}
          <View
            style={[
              styles.statusIconContainer,
              {
                backgroundColor: config.colors[0] + '15',
              },
            ]}
          >
            {status === 'pending' ? (
              <ActivityIndicator size="large" color={config.colors[0]} />
            ) : (
              <Text style={[styles.statusIcon, { color: config.colors[0] }]}>
                {config.icon}
              </Text>
            )}
          </View>

          {/* Status Title */}
          <Text style={[styles.statusTitle, { color: theme.colors.text }]}>
            {config.title}
          </Text>

          {/* Status Message */}
          <Text style={[styles.statusMessage, { color: theme.colors.textSecondary }]}>
            {message}
          </Text>

          {/* Status Badge */}
          <View style={styles.badgeContainer}>
            <StatusBadge status={status} size="md" />
          </View>
        </Animated.View>

        {/* Action Buttons */}
        {status === 'completed' && (
          <View style={styles.actions}>
            <View style={styles.actionButtonWrapper}>
              <BankingButton
                title="View Transaction"
                onPress={() => {
                  if (transactionId) {
                    navigation.navigate('TransactionDetails', { transactionId });
                  }
                }}
                fullWidth
                size="md"
              />
            </View>
            <View style={styles.actionButtonWrapper}>
              <BankingButton
                title="Download Receipt"
                variant="outline"
                onPress={() => {
                  // PDF receipt generation would go here
                  console.log('Generate PDF receipt');
                }}
                fullWidth
                size="md"
              />
            </View>
          </View>
        )}

        {status === 'failed' && (
          <View style={styles.actions}>
            <View style={styles.actionButtonWrapper}>
              <BankingButton
                title="Try Again"
                onPress={() => navigation.goBack()}
                fullWidth
                size="md"
              />
            </View>
            <View style={styles.actionButtonWrapper}>
              <BankingButton
                title="Contact Support"
                variant="outline"
                onPress={() => navigation.navigate('Complaint')}
                fullWidth
                size="md"
              />
            </View>
          </View>
        )}

        {status === 'pending' && (
          <BankingCard style={styles.infoCard}>
            <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
              What's happening?
            </Text>
            <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
              We're waiting for M-Pesa to confirm your payment. This usually takes a few seconds.
              Please keep this screen open.
            </Text>
          </BankingCard>
        )}
      </ScrollView>
    </View>
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
    paddingBottom: Spacing['3xl'],
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  statusIconContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.xl * 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statusIcon: {
    fontSize: 64,
    fontWeight: 'bold',
  },
  statusTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  statusMessage: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  badgeContainer: {
    marginTop: Spacing.sm,
  },
  actions: {
    width: '100%',
    marginTop: Spacing.xl,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButtonWrapper: {
    flex: 1,
    minWidth: 0,
    minHeight: Math.round(44 * Layout.mobileScale),
  },
  infoCard: {
    marginTop: Spacing.xl,
    width: '100%',
  },
  infoTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
});

export default PaymentStatusScreenRedesigned;


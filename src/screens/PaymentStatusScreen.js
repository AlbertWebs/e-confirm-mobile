import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import ErrorDisplay from '../components/ErrorDisplay';

const PaymentStatusScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { checkoutRequestId, transactionId } = route.params;

  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('Waiting for payment confirmation...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
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
      // Poll every 3 seconds
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 3000);

      // Stop polling after 2 minutes
      setTimeout(() => {
        clearInterval(interval);
        if (status === 'pending') {
          setMessage('Payment confirmation timed out. Please check your transaction status.');
        }
      }, 120000);

      return () => clearInterval(interval);
    }
  }, []);

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
      setError('Failed to check payment status. Please try again.');
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'failed':
        return '✕';
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return ['#10b981', '#059669'];
      case 'failed':
        return ['#ef4444', '#dc2626'];
      default:
        return ['#18743c', '#145a2f'];
    }
  };

  const handleViewTransaction = () => {
    if (transactionId) {
      navigation.navigate('TransactionDetails', { transactionId });
    }
  };

  const handleRetry = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Status Icon */}
        <View style={styles.iconContainer}>
          {status === 'pending' ? (
            <ActivityIndicator size="large" color="#18743c" />
          ) : (
            <LinearGradient
              colors={getStatusColor()}
              style={styles.iconCircle}
            >
              <Text style={styles.iconText}>{getStatusIcon()}</Text>
            </LinearGradient>
          )}
        </View>

        {/* Status Message */}
        <Text style={styles.statusTitle}>
          {status === 'completed' ? 'Payment Successful!' : 
           status === 'failed' ? 'Payment Failed' : 
           'Processing Payment...'}
        </Text>

        <Text style={styles.statusMessage}>{message}</Text>

        {/* Transaction ID */}
        {transactionId && (
          <View style={styles.transactionIdContainer}>
            <Text style={styles.transactionIdLabel}>Transaction ID:</Text>
            <Text style={styles.transactionId}>{transactionId}</Text>
          </View>
        )}

        {/* Action Buttons */}
        {status === 'completed' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleViewTransaction}
          >
            <LinearGradient
              colors={getStatusColor()}
              style={styles.actionButtonGradient}
            >
              <Text style={styles.actionButtonText}>View Transaction</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {status === 'failed' && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRetry}
          >
            <LinearGradient
              colors={getStatusColor()}
              style={styles.actionButtonGradient}
            >
              <Text style={styles.actionButtonText}>Try Again</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {status === 'pending' && (
          <View style={styles.pendingInfo}>
            <Text style={styles.pendingText}>
              Please complete the M-Pesa prompt on your phone
            </Text>
            <Text style={styles.pendingSubtext}>
              This page will update automatically
            </Text>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  iconText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },
  statusMessage: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  transactionIdContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  transactionIdLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  transactionId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  actionButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  pendingInfo: {
    marginTop: 24,
    alignItems: 'center',
  },
  pendingText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },
  pendingSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});

export default PaymentStatusScreen;



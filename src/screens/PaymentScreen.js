import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import { useApp } from '../context/AppContext';
import ErrorDisplay from '../components/ErrorDisplay';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { currentTransaction, setCurrentTransaction } = useApp();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const transactionData = route.params?.transactionData || currentTransaction;

  useEffect(() => {
    if (!transactionData) {
      setError('Transaction data not found. Please create a new transaction.');
    }
  }, []);

  const handleInitiatePayment = async () => {
    if (!transactionData) return;

    try {
      setLoading(true);
      const response = await apiRequest(
        API_ENDPOINTS.INITIATE_PAYMENT,
        'POST',
        { transaction_id: transactionData.transaction_id }
      );

      if (response.success) {
        setError(null);
        setCurrentTransaction({
          ...transactionData,
          checkout_request_id: response.data.checkout_request_id,
          status: response.data.status,
        });
        
        // Navigate to payment status screen
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
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const totalAmount = transactionData.transaction_amount + transactionData.transaction_fee;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Review & Pay</Text>
          <Text style={styles.headerSubtitle}>Confirm your transaction details</Text>
        </View>

        {/* Transaction Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transaction ID</Text>
            <Text style={styles.summaryValue}>{transactionData.transaction_id}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transaction Amount</Text>
            <Text style={styles.summaryValueAmount}>KES {transactionData.transaction_amount.toLocaleString()}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transaction Fee (1%)</Text>
            <Text style={styles.summaryValue}>KES {transactionData.transaction_fee.toLocaleString()}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabelTotal}>Total Amount</Text>
            <Text style={styles.summaryValueTotal}>KES {totalAmount.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Payment Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Method:</Text>
            <Text style={styles.infoValue}>
              {transactionData.payment_method === 'mpesa' ? 'M-Pesa' : 'Paybill/Buy Goods'}
            </Text>
          </View>
          {transactionData.paybill_till_number && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Paybill/Till:</Text>
              <Text style={styles.infoValue}>{transactionData.paybill_till_number}</Text>
            </View>
          )}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>What happens next?</Text>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>1</Text>
            </View>
            <Text style={styles.instructionText}>
              Tap "Pay with M-Pesa" to initiate payment
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>2</Text>
            </View>
            <Text style={styles.instructionText}>
              Enter your M-Pesa PIN when prompted
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <View style={styles.instructionNumber}>
              <Text style={styles.instructionNumberText}>3</Text>
            </View>
            <Text style={styles.instructionText}>
              Wait for payment confirmation
            </Text>
          </View>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={styles.payButton}
          onPress={handleInitiatePayment}
          disabled={loading}
        >
          <LinearGradient
            colors={['#18743c', '#10b981']}
            style={styles.payButtonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.payButtonText}>Pay with M-Pesa</Text>
                <Text style={styles.payButtonSubtext}>KES {totalAmount.toLocaleString()}</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  summaryValueAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18743c',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  summaryLabelTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  summaryValueTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#18743c',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  instructionsCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18743c',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#18743c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#18743c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  payButtonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  payButtonSubtext: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  cancelButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentScreen;



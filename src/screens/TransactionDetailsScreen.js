import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest, API_ENDPOINTS } from '../config/api';

const TransactionDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { transactionId } = route.params;

  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    loadTransaction();
  }, []);

  const loadTransaction = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(
        `${API_ENDPOINTS.GET_TRANSACTION}/${transactionId}`,
        'GET'
      );

      if (response.success) {
        setTransaction(response.data);
      } else {
        Alert.alert('Error', response.message || 'Failed to load transaction');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load transaction');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status.includes('Funded') || status === 'Completed') {
      return '#10b981';
    } else if (status.includes('Failed') || status.includes('Cancelled')) {
      return '#ef4444';
    } else if (status.includes('Pending')) {
      return '#f59e0b';
    }
    return '#64748b';
  };

  const getStatusBadgeStyle = (status) => {
    return {
      backgroundColor: getStatusColor(status) + '20',
      borderColor: getStatusColor(status),
    };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#18743c" />
        <Text style={styles.loadingText}>Loading transaction...</Text>
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text>Transaction not found</Text>
      </View>
    );
  }

  const totalAmount = transaction.transaction_amount + transaction.transaction_fee;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={[styles.statusBadge, getStatusBadgeStyle(transaction.status)]}>
            <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
              {transaction.status}
            </Text>
          </View>
        </View>

        {/* Transaction ID */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Transaction ID</Text>
          <Text style={styles.cardValue}>{transaction.transaction_id}</Text>
        </View>

        {/* Amount Details */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Amount Details</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Transaction Amount:</Text>
            <Text style={styles.amountValue}>
              KES {transaction.transaction_amount.toLocaleString()}
            </Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Transaction Fee:</Text>
            <Text style={styles.amountValue}>
              KES {transaction.transaction_fee.toLocaleString()}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.amountRow}>
            <Text style={styles.amountLabelTotal}>Total Amount:</Text>
            <Text style={styles.amountValueTotal}>
              KES {totalAmount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Transaction Type */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Transaction Type</Text>
          <Text style={styles.cardValue}>{transaction.transaction_type}</Text>
        </View>

        {/* Payment Method */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Payment Method</Text>
          <Text style={styles.cardValue}>
            {transaction.payment_method === 'mpesa' ? 'M-Pesa' : 'Paybill/Buy Goods'}
          </Text>
          {transaction.paybill_till_number && (
            <Text style={styles.cardSubValue}>
              Paybill/Till: {transaction.paybill_till_number}
            </Text>
          )}
        </View>

        {/* Parties */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Parties</Text>
          <View style={styles.partyRow}>
            <Text style={styles.partyLabel}>Sender:</Text>
            <Text style={styles.partyValue}>{transaction.sender_mobile}</Text>
          </View>
          <View style={styles.partyRow}>
            <Text style={styles.partyLabel}>Receiver:</Text>
            <Text style={styles.partyValue}>{transaction.receiver_mobile}</Text>
          </View>
        </View>

        {/* Transaction Details */}
        {transaction.transaction_details && (
          <View style={styles.card}>
            <Text style={styles.cardLabel}>Transaction Details</Text>
            <Text style={styles.cardValue}>{transaction.transaction_details}</Text>
          </View>
        )}

        {/* Date */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Created At</Text>
          <Text style={styles.cardValue}>
            {new Date(transaction.created_at).toLocaleString()}
          </Text>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.newTransactionButton}
          onPress={() => navigation.navigate('TransactionForm')}
        >
          <Text style={styles.newTransactionButtonText}>Create New Transaction</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
  },
  content: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
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
  cardLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '600',
  },
  cardSubValue: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  amountLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  amountValueTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#18743c',
  },
  partyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  partyLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  partyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  newTransactionButton: {
    backgroundColor: '#18743c',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#18743c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  newTransactionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default TransactionDetailsScreen;


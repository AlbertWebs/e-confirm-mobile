import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Typography, Spacing, BorderRadius, Layout, Shadows } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import BankingButton from '../components/BankingButton';
import StatusBadge from '../components/StatusBadge';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import { useUser } from '../context/UserContext';

const EscrowDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { transactionId } = route.params;
  const { phoneNumber, user } = useUser();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);
  const [releasing, setReleasing] = useState(false);
  const [requestingRelease, setRequestingRelease] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      loadTransaction();
      return () => fadeAnim.setValue(0);
    }, [fadeAnim])
  );

  const loadTransaction = async () => {
    try {
      setLoading(true);
      const response = await apiRequest(
        `${API_ENDPOINTS.GET_TRANSACTION}/${transactionId}`,
        'GET'
      );

      if (response.success) {
        setTransaction(response.data);
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine if current user is buyer or seller
  const getUserRole = () => {
    if (!transaction || !phoneNumber) return null;
    
    const userPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+/, '');
    const senderPhone = (transaction.sender_mobile || '').replace(/\s+/g, '').replace(/^\+/, '');
    const receiverPhone = (transaction.receiver_mobile || transaction.recipient_mobile || '').replace(/\s+/g, '').replace(/^\+/, '');
    
    if (userPhone === senderPhone) {
      return 'buyer'; // User sent the payment
    } else if (userPhone === receiverPhone) {
      return 'seller'; // User is receiving the payment
    }
    
    return null;
  };

  const handleReleasePayment = async () => {
    if (!transaction) return;
    
    try {
      setReleasing(true);
      const response = await apiRequest(
        `${API_ENDPOINTS.RELEASE_PAYMENT}/${transactionId}`,
        'POST',
        { transaction_id: transactionId }
      );

      if (response.success) {
        // Reload transaction to get updated status
        await loadTransaction();
        Alert.alert('Success', 'Payment released successfully!');
      } else {
        Alert.alert('Error', response.message || 'Failed to release payment');
      }
    } catch (error) {
      console.error('Error releasing payment:', error);
      Alert.alert('Error', 'Failed to release payment. Please try again.');
    } finally {
      setReleasing(false);
    }
  };

  const handleRequestRelease = async () => {
    if (!transaction) return;
    
    try {
      setRequestingRelease(true);
      const response = await apiRequest(
        `${API_ENDPOINTS.REQUEST_RELEASE}/${transactionId}`,
        'POST',
        { transaction_id: transactionId }
      );

      if (response.success) {
        Alert.alert('Success', 'Release request sent to buyer!');
      } else {
        Alert.alert('Error', response.message || 'Failed to send release request');
      }
    } catch (error) {
      console.error('Error requesting release:', error);
      Alert.alert('Error', 'Failed to send release request. Please try again.');
    } finally {
      setRequestingRelease(false);
    }
  };

  const getTimelineSteps = () => {
    if (!transaction) return [];
    
    const status = transaction.status?.toLowerCase() || '';
    const steps = [
      {
        id: 1,
        title: 'Transaction Created',
        description: 'Escrow transaction initiated',
        completed: true,
        date: transaction.created_at,
      },
      {
        id: 2,
        title: 'Payment Initiated',
        description: 'Waiting for payment confirmation',
        completed: status.includes('funded') || status.includes('completed'),
        date: transaction.payment_initiated_at,
      },
      {
        id: 3,
        title: 'Funds in Escrow',
        description: 'Payment confirmed, funds secured',
        completed: status.includes('funded') || status.includes('completed'),
        date: transaction.funded_at,
      },
      {
        id: 4,
        title: 'Transaction Completed',
        description: 'Funds released to recipient',
        completed: status.includes('completed'),
        date: transaction.completed_at,
      },
    ];
    
    return steps;
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Transaction not found
        </Text>
      </View>
    );
  }

  const timelineSteps = getTimelineSteps();
  const currentStep = timelineSteps.findIndex(step => !step.completed);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding: Layout.screenPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <BankingCard variant="elevated" style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.headerInfo}>
              <Text style={[styles.transactionRef, { color: theme.colors.textTertiary }]}>
                {transaction.transaction_reference}
              </Text>
              <Text style={[styles.transactionType, { color: theme.colors.text }]}>
                {transaction.transaction_type}
              </Text>
            </View>
            <StatusBadge status={transaction.status} />
          </View>
          
          <View style={styles.amountSection}>
            <Text style={[styles.amountLabel, { color: theme.colors.textSecondary }]}>
              Escrow Amount
            </Text>
            <Text style={[styles.amountValue, { color: theme.colors.text }]}>
              KES {parseFloat(transaction.transaction_amount || 0).toLocaleString()}
            </Text>
          </View>
        </BankingCard>

        {/* Progress Timeline */}
        <BankingCard variant="elevated" style={styles.timelineCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Progress Timeline
          </Text>
          
          {timelineSteps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = step.completed;
            const isLast = index === timelineSteps.length - 1;

            return (
              <View key={step.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineDot,
                      {
                        backgroundColor: isCompleted
                          ? theme.success
                          : isActive
                          ? theme.primary
                          : theme.colors.border,
                        borderColor: isActive ? theme.primary : 'transparent',
                      },
                    ]}
                  >
                    {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  {!isLast && (
                    <View
                      style={[
                        styles.timelineLine,
                        {
                          backgroundColor: isCompleted
                            ? theme.success
                            : theme.colors.border,
                        },
                      ]}
                    />
                  )}
                </View>
                
                <View style={styles.timelineContent}>
                  <Text
                    style={[
                      styles.timelineTitle,
                      {
                        color: isActive || isCompleted
                          ? theme.colors.text
                          : theme.colors.textTertiary,
                        fontWeight: isActive
                          ? Typography.fontWeight.bold
                          : Typography.fontWeight.medium,
                      },
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text
                    style={[
                      styles.timelineDescription,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {step.description}
                  </Text>
                  {step.date && (
                    <Text
                      style={[
                        styles.timelineDate,
                        { color: theme.colors.textTertiary },
                      ]}
                    >
                      {new Date(step.date).toLocaleString()}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </BankingCard>

        {/* Transaction Details */}
        <BankingCard variant="elevated" style={styles.detailsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Transaction Details
          </Text>
          
          <DetailRow
            label="Sender"
            value={transaction.sender_mobile}
            theme={theme}
          />
          <DetailRow
            label="Recipient"
            value={transaction.receiver_mobile}
            theme={theme}
          />
          <DetailRow
            label="Payment Method"
            value={transaction.payment_method === 'mpesa' ? 'M-Pesa' : 'Paybill'}
            theme={theme}
          />
          <DetailRow
            label="Transaction Fee"
            value={`KES ${parseFloat(transaction.transaction_fee || 0).toLocaleString()}`}
            theme={theme}
          />
          {transaction.transaction_details && (
            <DetailRow
              label="Details"
              value={transaction.transaction_details}
              theme={theme}
            />
          )}
        </BankingCard>

        {/* Actions */}
        {(() => {
          const userRole = getUserRole();
          const status = transaction.status?.toLowerCase() || '';
          const isFunded = status.includes('funded') || status.includes('paid');
          const isPending = status.includes('pending') || status.includes('waiting');
          const isCompleted = status.includes('completed') || status.includes('released');

          // Show payment button if transaction is pending and user is buyer
          if (isPending && userRole === 'buyer' && !transaction.checkout_request_id) {
            return (
              <BankingButton
                title="Continue Payment"
                onPress={() => navigation.navigate('Payment', { transactionData: transaction })}
                fullWidth
                size="lg"
                style={styles.actionButton}
              />
            );
          }

          // Show release payment button if funds are in escrow and user is buyer
          if (isFunded && !isCompleted && userRole === 'buyer') {
            return (
              <BankingButton
                title="Release Payment"
                onPress={handleReleasePayment}
                loading={releasing}
                fullWidth
                size="lg"
                style={styles.actionButton}
              />
            );
          }

          // Show request release button if funds are in escrow and user is seller
          if (isFunded && !isCompleted && userRole === 'seller') {
            return (
              <BankingButton
                title="Request Release"
                onPress={handleRequestRelease}
                loading={requestingRelease}
                variant="outline"
                fullWidth
                size="lg"
                style={styles.actionButton}
              />
            );
          }

          return null;
        })()}
      </ScrollView>
    </Animated.View>
  );
};

const DetailRow = ({ label, value, theme }) => (
  <View style={styles.detailRow}>
    <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
      {label}
    </Text>
    <Text style={[styles.detailValue, { color: theme.colors.text }]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: Spacing['3xl'],
  },
  headerCard: {
    marginBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  headerInfo: {
    flex: 1,
  },
  transactionRef: {
    fontSize: Typography.fontSize.xs,
    fontFamily: 'monospace',
    marginBottom: Spacing.xs,
  },
  transactionType: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  amountSection: {
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  amountLabel: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
  },
  amountValue: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: -1,
  },
  timelineCard: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  timelineLeft: {
    marginRight: Spacing.md,
    alignItems: 'center',
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: Typography.fontWeight.bold,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: Spacing.xs,
    minHeight: 40,
  },
  timelineContent: {
    flex: 1,
    paddingTop: Spacing.xs,
  },
  timelineTitle: {
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.xs,
  },
  timelineDescription: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
  },
  timelineDate: {
    fontSize: Typography.fontSize.xs,
  },
  detailsCard: {
    marginBottom: Spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  detailLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    flex: 1,
  },
  detailValue: {
    fontSize: Typography.fontSize.sm,
    flex: 1,
    textAlign: 'right',
  },
  actionButton: {
    marginTop: Spacing.md,
  },
  errorText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
});

export default EscrowDetailScreen;


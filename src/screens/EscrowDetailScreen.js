import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Typography, Spacing, BorderRadius, Layout, Shadows } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import BankingButton from '../components/BankingButton';
import StatusBadge from '../components/StatusBadge';
import { apiRequest, API_ENDPOINTS } from '../config/api';

const EscrowDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { transactionId } = route.params;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState(null);

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
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!transaction) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.backgroundSecondary }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Transaction not found
        </Text>
      </View>
    );
  }

  const timelineSteps = getTimelineSteps();
  const currentStep = timelineSteps.findIndex(step => !step.completed);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: theme.colors.backgroundSecondary }]}>
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
        {transaction.status?.toLowerCase().includes('pending') && (
          <BankingButton
            title="Continue Payment"
            onPress={() => navigation.navigate('Payment', { transactionData: transaction })}
            fullWidth
            size="lg"
            style={styles.actionButton}
          />
        )}
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
    paddingBottom: 100,
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
    paddingTop: 4,
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


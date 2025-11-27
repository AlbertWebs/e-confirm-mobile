import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Typography, Spacing, BorderRadius, Layout, Shadows } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import StatusBadge from '../components/StatusBadge';
import BankingButton from '../components/BankingButton';
import { apiRequest, API_ENDPOINTS } from '../config/api';

const HistoryScreenRedesigned = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, completed, failed
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const response = await apiRequest(
        API_ENDPOINTS.SEARCH_TRANSACTION,
        'POST',
        { reference: searchQuery.trim() }
      );
      
      if (response.success && response.data) {
        const results = Array.isArray(response.data) ? response.data : [response.data];
        setTransactions(results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    const status = tx.status?.toLowerCase() || '';
    if (filter === 'pending') return status.includes('pending') || status.includes('waiting');
    if (filter === 'completed') return status.includes('completed') || status.includes('funded');
    if (filter === 'failed') return status.includes('failed') || status.includes('cancelled');
    return true;
  });

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'failed', label: 'Failed' },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: theme.colors.backgroundSecondary }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.searchBox, { backgroundColor: theme.colors.backgroundSecondary, borderColor: theme.colors.border }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search by reference..."
            placeholderTextColor={theme.colors.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filtersContainer, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterChip,
              {
                backgroundColor: filter === f.key ? theme.primary : theme.colors.backgroundSecondary,
                borderColor: filter === f.key ? theme.primary : theme.colors.border,
              },
            ]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === f.key ? '#fff' : theme.colors.text,
                  fontWeight: filter === f.key ? Typography.fontWeight.semibold : Typography.fontWeight.regular,
                },
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Transactions List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { padding: Layout.screenPadding }]}
        showsVerticalScrollIndicator={false}
      >
        {filteredTransactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              No Transactions
            </Text>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {searchQuery ? 'No results found' : 'Your transaction history will appear here'}
            </Text>
            {!searchQuery && (
              <BankingButton
                title="Create Escrow"
                onPress={() => navigation.navigate('Create')}
                style={styles.emptyButton}
              />
            )}
          </View>
        ) : (
          filteredTransactions.map((transaction) => (
            <BankingCard
              key={transaction.id || transaction.transaction_reference}
              onPress={() => {
                if (transaction.id) {
                  navigation.navigate('TransactionDetails', { transactionId: transaction.id });
                }
              }}
              variant="elevated"
            >
              <View style={styles.transactionHeader}>
                <View style={styles.transactionInfo}>
                  <Text style={[styles.transactionRef, { color: theme.colors.textTertiary }]}>
                    {transaction.transaction_reference || transaction.reference}
                  </Text>
                  <Text style={[styles.transactionType, { color: theme.colors.text }]}>
                    {transaction.transaction_type || 'Transaction'}
                  </Text>
                </View>
                <StatusBadge status={transaction.status} size="sm" />
              </View>
              
              <View style={styles.transactionFooter}>
                <Text style={[styles.transactionAmount, { color: theme.colors.text }]}>
                  KES {parseFloat(transaction.transaction_amount || 0).toLocaleString()}
                </Text>
                <Text style={[styles.transactionDate, { color: theme.colors.textTertiary }]}>
                  {transaction.created_at
                    ? new Date(transaction.created_at).toLocaleDateString()
                    : 'N/A'}
                </Text>
              </View>
            </BankingCard>
          ))
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: Layout.screenPadding,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
  },
  clearIcon: {
    fontSize: 18,
    color: '#94a3b8',
    padding: Spacing.xs,
  },
  filtersContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filtersContent: {
    paddingHorizontal: Layout.screenPadding,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    marginRight: Spacing.sm,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionRef: {
    fontSize: Typography.fontSize.xs,
    fontFamily: 'monospace',
    marginBottom: Spacing.xs,
  },
  transactionType: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  transactionAmount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  transactionDate: {
    fontSize: Typography.fontSize.sm,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    marginTop: Spacing.md,
  },
});

export default HistoryScreenRedesigned;


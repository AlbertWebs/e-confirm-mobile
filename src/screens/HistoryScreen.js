import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { apiRequest, API_ENDPOINTS } from '../config/api';
import { Platform } from 'react-native';
import ErrorDisplay from '../components/ErrorDisplay';

const { width } = Dimensions.get('window');

const HistoryScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Validation Error', 'Please enter a transaction reference to search');
      return;
    }

    try {
      setSearching(true);
      setSearchResults([]);

      const response = await apiRequest(
        API_ENDPOINTS.SEARCH_TRANSACTION,
        'POST',
        { reference: searchQuery.trim() }
      );

      if (response.success && response.data) {
        // Handle both single transaction and array of transactions
        const results = Array.isArray(response.data) ? response.data : [response.data];
        setSearchResults(results);
        setError(null);
        if (results.length === 0) {
          setError('No transaction found with that reference number.');
        }
      } else {
        setError(response.message || 'Failed to search transaction. Please try again.');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching. Please check your connection and try again.');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleViewTransaction = async (reference) => {
    try {
      setLoading(true);
      const response = await apiRequest(
        `${API_ENDPOINTS.SEARCH_TRANSACTION}`,
        'POST',
        { reference }
      );

      if (response.success && response.data) {
        const transaction = Array.isArray(response.data) ? response.data[0] : response.data;
        if (transaction.id) {
          navigation.navigate('TransactionDetails', { transactionId: transaction.id });
        } else {
          Alert.alert('Info', 'Transaction details are not available. Please contact support.');
        }
      } else {
        Alert.alert('Error', 'Failed to load transaction details.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while loading transaction.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status?.includes('Funded') || status === 'Completed') {
      return '#10b981';
    } else if (status?.includes('Failed') || status?.includes('Cancelled')) {
      return '#ef4444';
    } else if (status?.includes('Pending')) {
      return '#f59e0b';
    }
    return '#64748b';
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
        <Text style={styles.subtitle}>Search or view your transactions</Text>
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Enter transaction reference..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="none"
            editable={!searching}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.searchButton, searching && styles.searchButtonDisabled]}
          onPress={handleSearch}
          disabled={searching || !searchQuery.trim()}
        >
          {searching ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.searchButtonText}>Search</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Show search results if searching or has results */}
        {searchQuery.trim() || searchResults.length > 0 ? (
          searching ? (
            <View style={styles.centerContent}>
              <ActivityIndicator size="large" color="#18743c" />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <View style={styles.resultsSection}>
              <Text style={styles.resultsTitle}>
                Search Results ({searchResults.length})
              </Text>
              <View style={styles.transactionsList}>
                {searchResults.map((transaction) => (
                  <TouchableOpacity
                    key={transaction.id || transaction.transaction_reference}
                    style={styles.transactionCard}
                    onPress={() => {
                      if (transaction.id) {
                        navigation.navigate('TransactionDetails', { transactionId: transaction.id });
                      } else if (transaction.transaction_reference) {
                        // If no ID, try to get transaction by reference
                        handleViewTransaction(transaction.transaction_reference);
                      }
                    }}
                  >
                    <View style={styles.transactionHeader}>
                      <Text style={styles.transactionType}>
                        {transaction.transaction_type || 'Transaction'}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                          {transaction.status || 'Unknown'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.transactionReference}>
                      Ref: {transaction.transaction_reference || transaction.reference}
                    </Text>
                    {transaction.transaction_amount && (
                      <Text style={styles.transactionAmount}>
                        KES {parseFloat(transaction.transaction_amount).toLocaleString()}
                      </Text>
                    )}
                    {transaction.created_at && (
                      <Text style={styles.transactionDate}>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No Results Found</Text>
              <Text style={styles.emptyText}>
                No transaction found with reference "{searchQuery}". Please check the reference number and try again.
              </Text>
              <TouchableOpacity
                style={styles.clearButtonLarge}
                onPress={clearSearch}
              >
                <Text style={styles.clearButtonTextLarge}>Clear Search</Text>
              </TouchableOpacity>
            </View>
          )
        ) : loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#18743c" />
            <Text style={styles.loadingText}>Loading transactions...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Transactions Yet</Text>
            <Text style={styles.emptyText}>
              Your transaction history will appear here once you create your first transaction.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('TransactionForm')}
            >
              <Text style={styles.createButtonText}>Create Transaction</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.transactionsList}>
            {transactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                style={styles.transactionCard}
                onPress={() => navigation.navigate('TransactionDetails', { transactionId: transaction.id })}
              >
                <View style={styles.transactionHeader}>
                  <Text style={styles.transactionType}>{transaction.transaction_type}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                      {transaction.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.transactionAmount}>
                  KES {parseFloat(transaction.transaction_amount).toLocaleString()}
                </Text>
                <Text style={styles.transactionDate}>
                  {new Date(transaction.created_at).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: width > 768 ? 30 : 20,
    paddingTop: width > 768 ? 30 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchSection: {
    padding: width > 768 ? 20 : 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: width > 768 ? 16 : 14,
    color: '#0f172a',
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    fontSize: 18,
    color: '#64748b',
  },
  searchButton: {
    backgroundColor: '#18743c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    marginTop: 8,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  title: {
    fontSize: width > 768 ? 32 : 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: width > 768 ? 16 : 14,
    color: '#64748b',
  },
  content: {
    padding: width > 768 ? 30 : 20,
    maxWidth: width > 768 ? 800 : '100%',
    alignSelf: width > 768 ? 'center' : 'stretch',
    width: '100%',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  createButton: {
    backgroundColor: '#18743c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButtonLarge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  clearButtonTextLarge: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionsList: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 12,
  },
  transactionReference: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  transactionAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#18743c',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
    color: '#64748b',
  },
});

export default HistoryScreen;


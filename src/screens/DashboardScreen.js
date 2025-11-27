import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows, Layout } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import BankingButton from '../components/BankingButton';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(1)).current; // Start visible
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock data - replace with actual API calls
  const [balance] = useState(125000);
  const [activeEscrows] = useState(3);
  const [pendingAmount] = useState(45000);

  React.useEffect(() => {
    console.log('DashboardScreen mounted');
    console.log('Theme colors:', theme.colors);
  }, [theme]);

  useFocusEffect(
    React.useCallback(() => {
      // Set initial opacity to 1 for web compatibility
      fadeAnim.setValue(1);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false, // Use false for web compatibility
      }).start();

      return () => {
        fadeAnim.setValue(0);
      };
    }, [fadeAnim])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Fetch data here
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  console.log('DashboardScreen render - theme:', theme.colors.backgroundSecondary);
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.backgroundSecondary, minHeight: '100vh' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Layout.screenPadding, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Balance Card */}
        <BankingCard variant="elevated" style={styles.balanceCard}>
          <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>
            Total Balance
          </Text>
          <Text style={[styles.balanceAmount, { color: theme.colors.text }]}>
            KES {balance.toLocaleString()}
          </Text>
          <View style={styles.balanceFooter}>
            <View>
              <Text style={[styles.balanceSubLabel, { color: theme.colors.textTertiary }]}>
                In Escrow
              </Text>
              <Text style={[styles.balanceSubAmount, { color: theme.colors.text }]}>
                KES {pendingAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.balanceDivider} />
            <View>
              <Text style={[styles.balanceSubLabel, { color: theme.colors.textTertiary }]}>
                Available
              </Text>
              <Text style={[styles.balanceSubAmount, { color: theme.colors.text }]}>
                KES {(balance - pendingAmount).toLocaleString()}
              </Text>
            </View>
          </View>
        </BankingCard>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
              onPress={() => navigation.navigate('Create')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.primarySubtle }]}>
                <Text style={styles.actionIconText}>➕</Text>
              </View>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                New Escrow
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
              onPress={() => navigation.navigate('History')}
              activeOpacity={0.7}
            >
              <View style={[styles.actionIcon, { backgroundColor: theme.primarySubtle }]}>
                <Text style={styles.actionIconText}>📋</Text>
              </View>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                History
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Escrows Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Active Escrows
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <BankingCard>
            <View style={styles.summaryRow}>
              <View>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  {activeEscrows}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Active Transactions
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View>
                <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
                  KES {pendingAmount.toLocaleString()}
                </Text>
                <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>
                  Pending Release
                </Text>
              </View>
            </View>
          </BankingCard>
        </View>

        {/* Primary CTA */}
        <BankingButton
          title="Create New Escrow"
          onPress={() => navigation.navigate('Create')}
          fullWidth
          size="lg"
          style={styles.ctaButton}
        />
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
    padding: Layout.screenPadding,
    paddingBottom: 100,
  },
  balanceCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
  },
  balanceLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginBottom: Spacing.xs,
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.lg,
    letterSpacing: -1,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  balanceDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  balanceSubLabel: {
    fontSize: Typography.fontSize.xs,
    marginBottom: Spacing.xs,
  },
  balanceSubAmount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e2e8f0',
  },
  summaryValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  summaryLabel: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  ctaButton: {
    marginTop: Spacing.md,
  },
});

export default DashboardScreen;


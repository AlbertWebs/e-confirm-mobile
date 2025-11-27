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
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { Typography, Spacing, BorderRadius, Shadows, Layout } from '../theme/designSystem';
import BankingCard from '../components/BankingCard';
import BankingButton from '../components/BankingButton';

const DashboardScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(20)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.95)).current;
  const [refreshing, setRefreshing] = useState(false);
  
  // Mock data - replace with actual API calls
  const [balance] = useState(125000);
  const [activeEscrows] = useState(3);
  const [pendingAmount] = useState(45000);
  const [completedThisMonth] = useState(12);
  
  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  React.useEffect(() => {
    console.log('DashboardScreen mounted');
    console.log('Theme colors:', theme.colors);
  }, [theme]);

  useFocusEffect(
    React.useCallback(() => {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        fadeAnim.setValue(0);
        slideAnim.setValue(20);
        scaleAnim.setValue(0.95);
      };
    }, [fadeAnim, slideAnim, scaleAnim])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Fetch data here
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.backgroundSecondary, minHeight: '100vh' }}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={[styles.headerContent, { paddingHorizontal: Layout.screenPadding, paddingTop: Spacing.xl, paddingBottom: Spacing.lg }]}>
          <Text style={[styles.greeting, { color: theme.colors.text }]}>
            {getGreeting()} 👋
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.colors.textSecondary }]}>
            Here's your escrow overview
          </Text>
        </View>
      </Animated.View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: Layout.screenPadding, paddingTop: 0, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Enhanced Balance Card with Gradient */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          <View style={styles.balanceCardContainer}>
            <LinearGradient
              colors={[theme.primary, theme.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.balanceCardGradient}
            >
              <View style={styles.balanceCardContent}>
                <View style={styles.balanceHeader}>
                  <Text style={styles.balanceLabel}>
                    Total Balance
                  </Text>
                  <View style={styles.balanceBadge}>
                    <Text style={styles.balanceBadgeText}>Active</Text>
                  </View>
                </View>
                <Text style={styles.balanceAmount}>
                  KES {balance.toLocaleString()}
                </Text>
                <View style={styles.balanceFooter}>
                  <View style={styles.balanceStat}>
                    <Text style={styles.balanceStatLabel}>In Escrow</Text>
                    <Text style={styles.balanceStatValue}>
                      KES {pendingAmount.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.balanceDivider} />
                  <View style={styles.balanceStat}>
                    <Text style={styles.balanceStatLabel}>Available</Text>
                    <Text style={styles.balanceStatValue}>
                      KES {(balance - pendingAmount).toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        {/* Enhanced Quick Actions */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
              onPress={() => navigation.navigate('Create')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.primarySubtle, theme.primarySubtle + '80']}
                style={styles.actionIconGradient}
              >
                <Text style={styles.actionIconText}>➕</Text>
              </LinearGradient>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                New Escrow
              </Text>
              <Text style={[styles.actionSubLabel, { color: theme.colors.textSecondary }]}>
                Create transaction
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
              onPress={() => navigation.navigate('History')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.primarySubtle, theme.primarySubtle + '80']}
                style={styles.actionIconGradient}
              >
                <Text style={styles.actionIconText}>📋</Text>
              </LinearGradient>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                History
              </Text>
              <Text style={[styles.actionSubLabel, { color: theme.colors.textSecondary }]}>
                View all
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, { backgroundColor: theme.colors.background }]}
              onPress={() => navigation.navigate('Complaint')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[theme.primarySubtle, theme.primarySubtle + '80']}
                style={styles.actionIconGradient}
              >
                <Text style={styles.actionIconText}>💬</Text>
              </LinearGradient>
              <Text style={[styles.actionLabel, { color: theme.colors.text }]}>
                Support
              </Text>
              <Text style={[styles.actionSubLabel, { color: theme.colors.textSecondary }]}>
                Get help
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Enhanced Stats Cards */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Overview
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsGrid}>
            <BankingCard style={[styles.statCard, { borderLeftWidth: 4, borderLeftColor: theme.primary }]}>
              <View style={styles.statContent}>
                <View style={[styles.statIconContainer, { backgroundColor: theme.primarySubtle }]}>
                  <Text style={styles.statIcon}>📊</Text>
                </View>
                <View style={styles.statInfo}>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>
                    {activeEscrows}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Active Escrows
                  </Text>
                </View>
              </View>
            </BankingCard>

            <BankingCard style={[styles.statCard, { borderLeftWidth: 4, borderLeftColor: theme.success || '#10b981' }]}>
              <View style={styles.statContent}>
                <View style={[styles.statIconContainer, { backgroundColor: theme.successLight || '#d1fae5' }]}>
                  <Text style={styles.statIcon}>✓</Text>
                </View>
                <View style={styles.statInfo}>
                  <Text style={[styles.statValue, { color: theme.colors.text }]}>
                    {completedThisMonth}
                  </Text>
                  <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>
                    Completed
                  </Text>
                </View>
              </View>
            </BankingCard>
          </View>

          <BankingCard style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
                Pending Release
              </Text>
              <View style={[styles.summaryBadge, { backgroundColor: theme.primarySubtle }]}>
                <Text style={[styles.summaryBadgeText, { color: theme.primary }]}>
                  {activeEscrows} transactions
                </Text>
              </View>
            </View>
            <Text style={[styles.summaryAmount, { color: theme.primary }]}>
              KES {pendingAmount.toLocaleString()}
            </Text>
            <Text style={[styles.summaryNote, { color: theme.colors.textSecondary }]}>
              Funds held in escrow awaiting release
            </Text>
          </BankingCard>
        </Animated.View>

        {/* Enhanced Primary CTA */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <BankingButton
            title="Create New Escrow"
            onPress={() => navigation.navigate('Create')}
            fullWidth
            size="md"
            style={styles.ctaButton}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
  },
  headerContent: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  greeting: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    opacity: 0.7,
  },
  balanceCardContainer: {
    marginBottom: Spacing.xl,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  balanceCardGradient: {
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
  },
  balanceCardContent: {
    // Content styles
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  balanceLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: '#ffffff',
    opacity: 0.9,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  balanceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  balanceBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: '#ffffff',
  },
  balanceAmount: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#ffffff',
    marginBottom: Spacing.xl,
    letterSpacing: -1,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  balanceStat: {
    alignItems: 'center',
    flex: 1,
  },
  balanceDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: Spacing.md,
  },
  balanceStatLabel: {
    fontSize: Typography.fontSize.xs,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: Spacing.xs,
  },
  balanceStatValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#ffffff',
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
    flexWrap: 'wrap',
  },
  actionCard: {
    flex: 1,
    minWidth: '30%',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    ...Shadows.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actionIconGradient: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  actionIconText: {
    fontSize: 28,
  },
  actionLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  actionSubLabel: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  statIcon: {
    fontSize: 24,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    opacity: 0.7,
  },
  summaryCard: {
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  summaryBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  summaryBadgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  summaryAmount: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },
  summaryNote: {
    fontSize: Typography.fontSize.sm,
    opacity: 0.7,
  },
  ctaButton: {
    marginTop: Spacing.lg,
  },
});

export default DashboardScreen;



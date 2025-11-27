import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AnimatedLockIcon, AnimatedZapIcon, AnimatedCheckIcon, AnimatedHeroIllustration } from '../components/AnimatedSVG';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim1 = React.useRef(new Animated.Value(50)).current;
  const slideAnim2 = React.useRef(new Animated.Value(50)).current;
  const slideAnim3 = React.useRef(new Animated.Value(50)).current;

  useFocusEffect(
    React.useCallback(() => {
      // Fade in animation when screen is focused
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.stagger(100, [
          Animated.timing(slideAnim1, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim2, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim3, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      return () => {
        fadeAnim.setValue(0);
        slideAnim1.setValue(50);
        slideAnim2.setValue(50);
        slideAnim3.setValue(50);
      };
    }, [fadeAnim, slideAnim1, slideAnim2, slideAnim3])
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Hero Section - Compact */}
      <LinearGradient
        colors={['#18743c', '#10b981']}
        style={styles.hero}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroIconContainer}>
            <AnimatedHeroIllustration width={width > 768 ? 80 : 60} height={width > 768 ? 80 : 60} />
          </View>
          <Text style={styles.heroTitle}>eConfirm Escrow</Text>
          <Text style={styles.heroSubtitle}>
            Secure your transactions with trusted escrow services
          </Text>
        </View>
      </LinearGradient>

      {/* Features Section */}
      <View style={styles.features}>
        <Animated.View
          style={[
            styles.featureCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim1 }],
            },
          ]}
        >
          <View style={styles.featureIconContainer}>
            <AnimatedLockIcon size={48} color="#18743c" />
          </View>
          <Text style={styles.featureTitle}>Secure Payments</Text>
          <Text style={styles.featureText}>
            Your funds are held securely until transaction completion
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.featureCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim2 }],
            },
          ]}
        >
          <View style={styles.featureIconContainer}>
            <AnimatedZapIcon size={48} color="#18743c" />
          </View>
          <Text style={styles.featureTitle}>Fast Processing</Text>
          <Text style={styles.featureText}>
            Quick and efficient transaction processing
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.featureCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim3 }],
            },
          ]}
        >
          <View style={styles.featureIconContainer}>
            <AnimatedCheckIcon size={48} color="#18743c" />
          </View>
          <Text style={styles.featureTitle}>Verified Transactions</Text>
          <Text style={styles.featureText}>
            All transactions are verified and tracked
          </Text>
        </Animated.View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('TransactionForm')}
        >
          <LinearGradient
            colors={['#18743c', '#10b981']}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaButtonText}>Create New Transaction</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How It Works</Text>
        <View style={styles.steps}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Create Transaction</Text>
              <Text style={styles.stepText}>
                Fill in the transaction details and select payment method
              </Text>
            </View>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Fund Escrow</Text>
              <Text style={styles.stepText}>
                Make payment via M-Pesa to secure your transaction
              </Text>
            </View>
          </View>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Complete</Text>
              <Text style={styles.stepText}>
                Funds are released once transaction is confirmed
              </Text>
            </View>
          </View>
        </View>
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
  scrollView: {
    flex: 1,
  },
  hero: {
    padding: width > 768 ? 30 : 24,
    paddingTop: width > 768 ? 40 : 30,
    paddingBottom: width > 768 ? 30 : 24,
    alignItems: 'center',
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: width > 768 ? 800 : '100%',
  },
  heroIconContainer: {
    marginBottom: 12,
    opacity: 0.95,
  },
  heroTitle: {
    fontSize: width > 768 ? 36 : 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: width > 768 ? 16 : 14,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  features: {
    flexDirection: width > 768 ? 'row' : 'column',
    padding: width > 768 ? 24 : 16,
    gap: 16,
    justifyContent: 'center',
  },
  featureCard: {
    flex: width > 768 ? 1 : 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#18743c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: width > 768 ? 0 : 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  featureIconContainer: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    width: 72,
    height: 72,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
    textAlign: 'center',
  },
  featureText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
  ctaSection: {
    padding: width > 768 ? 24 : 16,
    paddingTop: 8,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#18743c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  infoSection: {
    padding: width > 768 ? 32 : 24,
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 24,
    marginHorizontal: width > 768 ? 24 : 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: width > 768 ? 26 : 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 20,
    textAlign: 'center',
  },
  steps: {
    gap: 20,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#18743c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#18743c',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },
  stepText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
});

export default HomeScreen;


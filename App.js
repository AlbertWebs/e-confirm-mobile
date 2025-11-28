import React from 'react';
import { StatusBar, Platform, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeIcon, PlusIcon, ListIcon, ComplaintIcon } from './src/components/SvgIcons';
import LoadingOverlay from './src/components/LoadingOverlay';
import { useTheme } from './src/context/ThemeContext';
import { Layout } from './src/theme/designSystem';

import DashboardScreen from './src/screens/DashboardScreen';
import EscrowWizardScreen from './src/screens/EscrowWizardScreen';
import TransactionFormScreen from './src/screens/TransactionFormScreen';
import HistoryScreenRedesigned from './src/screens/HistoryScreenRedesigned';
import ComplaintScreen from './src/screens/ComplaintScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PaymentScreenRedesigned from './src/screens/PaymentScreenRedesigned';
import PaymentStatusScreenRedesigned from './src/screens/PaymentStatusScreenRedesigned';
import EscrowDetailScreen from './src/screens/EscrowDetailScreen';
import PhoneVerificationScreen from './src/screens/PhoneVerificationScreen';
import ProfileEditScreen from './src/screens/ProfileEditScreen';
import { AppProvider } from './src/context/AppContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { UserProvider } from './src/context/UserContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// App container with theme - must be inside ThemeProvider
const ThemedAppContainer = ({ children }) => {
  const theme = useTheme();
  
  return (
    <View style={{
      flex: 1,
      width: '100%',
      height: '100vh',
      minHeight: '100vh',
      backgroundColor: theme.colors.backgroundSecondary,
      position: 'relative',
    }}>
      {children}
    </View>
  );
};

// Navigation theme wrapper - must be inside ThemeProvider
const NavigationThemeWrapper = ({ children }) => {
  const theme = useTheme();
  
  const navigationTheme = theme.isDarkMode ? {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: theme.primary,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  } : {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.primary,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.text,
      border: theme.colors.border,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      {children}
    </NavigationContainer>
  );
};

// Main Tab Navigator with loading state
const MainTabs = () => {
  const [loading, setLoading] = React.useState(false);
  const theme = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: Math.round(18 * Layout.mobileScale),
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.colors.textTertiary,
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: theme.colors.background,
            paddingBottom: Platform.OS === 'ios' ? Math.round(20 * Layout.mobileScale) : Math.round(8 * Layout.mobileScale),
            paddingTop: Math.round(8 * Layout.mobileScale),
            height: Platform.OS === 'ios' ? Math.round(88 * Layout.mobileScale) : Math.round(64 * Layout.mobileScale),
            elevation: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.04,
            shadowRadius: 12,
            borderTopColor: theme.colors.borderLight,
          },
          tabBarLabelStyle: {
            fontSize: Math.round(11 * Layout.mobileScale),
            fontWeight: '600',
            letterSpacing: 0.3,
          },
          tabBarItemStyle: {
            paddingVertical: Math.round(4 * Layout.mobileScale),
          },
        }}
        screenListeners={{
          tabPress: () => {
            // Show loading animation when tab is pressed
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
            }, 400);
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={DashboardScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <HomeIcon size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Create"
          component={EscrowWizardScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Create',
            tabBarIcon: ({ color, size }) => (
              <PlusIcon size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryScreenRedesigned}
          options={{
            headerShown: false,
            tabBarLabel: 'History',
            tabBarIcon: ({ color, size }) => (
              <ListIcon size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Complaint"
          component={ComplaintScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Support',
            tabBarIcon: ({ color, size }) => (
              <ComplaintIcon size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Text style={{ fontSize: Math.round(size * Layout.mobileScale), color }}>⚙️</Text>
            ),
          }}
        />
      </Tab.Navigator>
      <LoadingOverlay visible={loading} message="Loading..." />
    </View>
  );
};

export default function App() {
  try {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedAppContainer>
            <UserProvider>
              <AppProvider>
                <NavigationThemeWrapper>
                {Platform.OS !== 'web' && (
                  <StatusBar 
                    barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
                    backgroundColor="#18743c"
                  />
                )}
                <Stack.Navigator
                  screenOptions={{
                    headerStyle: {
                      backgroundColor: '#18743c',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                    cardStyle: {
                      backgroundColor: 'transparent',
                    },
                  }}
                >
                  <Stack.Screen 
                    name="MainTabs" 
                    component={MainTabs}
                    options={{ headerShown: false }}
                  />
                <Stack.Screen 
                  name="TransactionForm" 
                  component={TransactionFormScreen}
                  options={{ title: 'Create Escrow Transaction' }}
                />
                <Stack.Screen 
                  name="Payment" 
                  component={PaymentScreenRedesigned}
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="PaymentStatus" 
                  component={PaymentStatusScreenRedesigned}
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="TransactionDetails" 
                  component={EscrowDetailScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen 
                  name="PhoneVerification" 
                  component={PhoneVerificationScreen}
                  options={{ 
                    title: 'Verify Phone',
                    headerShown: true,
                  }}
                />
                <Stack.Screen 
                  name="ProfileEdit" 
                  component={ProfileEditScreen}
                  options={{ 
                    title: 'Edit Profile',
                    headerShown: true,
                  }}
                />
              </Stack.Navigator>
              </NavigationThemeWrapper>
            </AppProvider>
          </UserProvider>
          </ThemedAppContainer>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading app: {error.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    width: '100%',
    height: '100vh',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
  },
});



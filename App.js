import React from 'react';
import { StatusBar, Platform, View, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeIcon, PlusIcon, ListIcon, ComplaintIcon } from './src/components/SvgIcons';
import LoadingOverlay from './src/components/LoadingOverlay';
import { useTheme } from './src/context/ThemeContext';

import HomeScreen from './src/screens/HomeScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import EscrowWizardScreen from './src/screens/EscrowWizardScreen';
import TransactionFormScreen from './src/screens/TransactionFormScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import HistoryScreenRedesigned from './src/screens/HistoryScreenRedesigned';
import ComplaintScreen from './src/screens/ComplaintScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import PaymentScreenRedesigned from './src/screens/PaymentScreenRedesigned';
import PaymentStatusScreen from './src/screens/PaymentStatusScreen';
import PaymentStatusScreenRedesigned from './src/screens/PaymentStatusScreenRedesigned';
import TransactionDetailsScreen from './src/screens/TransactionDetailsScreen';
import EscrowDetailScreen from './src/screens/EscrowDetailScreen';
import { AppProvider } from './src/context/AppContext';
import { ThemeProvider } from './src/context/ThemeContext';

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

  console.log('MainTabs rendering, theme:', theme.colors.background);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.backgroundSecondary }}>
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
            fontSize: 18,
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.colors.textTertiary,
          tabBarStyle: {
            borderTopWidth: 0,
            backgroundColor: theme.colors.background,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            paddingTop: 8,
            height: Platform.OS === 'ios' ? 88 : 64,
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 0.3,
          },
          tabBarItemStyle: {
            paddingVertical: 4,
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
              <Text style={{ fontSize: size, color }}>⚙️</Text>
            ),
          }}
        />
      </Tab.Navigator>
      <LoadingOverlay visible={loading} message="Loading..." />
    </View>
  );
};

export default function App() {
  console.log('App component rendering...');
  
  try {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedAppContainer>
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
                  name="TransactionDetailsOld" 
                  component={TransactionDetailsScreen}
                  options={{ title: 'Transaction Details' }}
                />
              </Stack.Navigator>
              </NavigationThemeWrapper>
            </AppProvider>
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



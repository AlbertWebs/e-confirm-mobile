import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiRequest, API_ENDPOINTS } from '../config/api';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user_data');
      const storedPhone = await AsyncStorage.getItem('user_phone');
      
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsGuest(false);
      }
      
      if (storedPhone) {
        setPhoneNumber(storedPhone);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send OTP to phone number
  const sendOTP = async (phone) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.SEND_OTP, 'POST', {
        phone_number: phone,
      });

      if (response.success) {
        // Store phone number temporarily
        await AsyncStorage.setItem('user_phone', phone);
        setPhoneNumber(phone);
        return { success: true, message: response.message || 'OTP sent successfully' };
      }

      return { success: false, message: response.message || 'Failed to send OTP' };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return { success: false, message: error.message || 'Failed to send OTP' };
    }
  };

  // Verify OTP and create/update user
  const verifyOTP = async (phone, otp) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.VERIFY_OTP, 'POST', {
        phone_number: phone,
        otp: otp,
      });

      if (response.success && response.data) {
        const userData = {
          phone: phone,
          ...response.data,
        };
        
        // Store user data
        await AsyncStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);
        setIsGuest(false);
        
        return { success: true, message: response.message || 'Phone verified successfully', user: userData };
      }

      return { success: false, message: response.message || 'Invalid OTP' };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, message: error.message || 'Failed to verify OTP' };
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      const response = await apiRequest(API_ENDPOINTS.UPDATE_PROFILE, 'POST', {
        ...profileData,
        phone_number: phoneNumber || user?.phone,
      });

      if (response.success && response.data) {
        const updatedUser = {
          ...user,
          ...response.data,
        };
        
        await AsyncStorage.setItem('user_data', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true, message: response.message || 'Profile updated successfully', user: updatedUser };
      }

      return { success: false, message: response.message || 'Failed to update profile' };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, message: error.message || 'Failed to update profile' };
    }
  };

  // Set phone number for guest transactions
  const setGuestPhone = async (phone) => {
    try {
      await AsyncStorage.setItem('user_phone', phone);
      setPhoneNumber(phone);
    } catch (error) {
      console.error('Error setting guest phone:', error);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user_data');
      setUser(null);
      setIsGuest(true);
      // Keep phone number for convenience
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const value = {
    user,
    isGuest,
    phoneNumber,
    isLoading,
    sendOTP,
    verifyOTP,
    updateProfile,
    setGuestPhone,
    logout,
    loadUserData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


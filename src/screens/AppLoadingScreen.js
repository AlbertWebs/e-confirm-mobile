import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import BankingLoader from '../components/BankingLoader';
import { Colors } from '../theme/designSystem';

const AppLoadingScreen = () => {
  return (
    <View style={styles.container}>
      <BankingLoader size={100} color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});

export default AppLoadingScreen;


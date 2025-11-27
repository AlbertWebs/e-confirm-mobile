import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiRequest, API_ENDPOINTS } from '../config/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);

  useEffect(() => {
    const fetchTransactionTypes = async () => {
      try {
        setLoadingTypes(true);
        const response = await apiRequest(API_ENDPOINTS.TRANSACTION_TYPES, 'GET');
        
        if (response.success && response.data) {
          // Transform API response to dropdown format if needed
          const types = Array.isArray(response.data) 
            ? response.data.map(type => ({
                label: type.name || type.label || type,
                value: type.id || type.value || type,
              }))
            : [];
          setTransactionTypes(types);
        }
      } catch (error) {
        console.error('Error fetching transaction types:', error);
        // Set default types as fallback
        setTransactionTypes([
          { label: 'Goods & Services', value: 'goods_services' },
          { label: 'Property', value: 'property' },
          { label: 'Vehicle', value: 'vehicle' },
          { label: 'Other', value: 'other' },
        ]);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTransactionTypes();
  }, []);

  const value = {
    currentTransaction,
    setCurrentTransaction,
    transactionTypes,
    setTransactionTypes,
    loadingTypes,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};



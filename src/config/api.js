// API Configuration
// e-confirm API endpoint
export const API_BASE_URL = 'https://econfirm.co.ke/api';

export const API_ENDPOINTS = {
  TRANSACTION_TYPES: '/mobile/transaction-types',
  CREATE_TRANSACTION: '/mobile/transaction/create',
  INITIATE_PAYMENT: '/mobile/payment/initiate',
  CHECK_PAYMENT_STATUS: '/mobile/payment/status',
  GET_TRANSACTION: '/mobile/transaction',
  SEARCH_TRANSACTION: '/mobile/transaction/search',
  SUBMIT_COMPLAINT: '/mobile/complaint',
  // User authentication endpoints
  SEND_OTP: '/mobile/auth/send-otp',
  VERIFY_OTP: '/mobile/auth/verify-otp',
  UPDATE_PROFILE: '/mobile/user/update-profile',
};

export const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'omit', // Don't send cookies for CORS
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    console.log(`API Request: ${method} ${url}`);
    const response = await fetch(url, options);
    console.log(`API Response: ${response.status} ${response.statusText}`);
    
    // Handle non-JSON responses
    let result;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      result = await response.json();
    } else {
      const text = await response.text();
      result = { message: text || 'Request failed' };
    }

    if (!response.ok) {
      console.error('API Error Response:', result);
      // Return error response instead of throwing for better UX
      return { 
        success: false, 
        message: result.message || `Request failed with status ${response.status}`,
        data: null 
      };
    }

    return result;
  } catch (error) {
    console.error('API Request Error:', error);
    // Don't throw network errors that might crash the app
    // Return a safe error response instead
    if (error.name === 'TypeError' && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      console.warn('Network error - API server may not be running or CORS issue');
      return { 
        success: false, 
        message: 'Unable to connect to e-confirm API. Please check your internet connection.',
        data: null 
      };
    }
    // For other errors, return error response instead of throwing
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: null
    };
  }
};



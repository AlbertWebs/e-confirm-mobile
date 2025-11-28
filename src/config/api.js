// API Configuration
// e-confirm API endpoint
// Use localhost:8000 for local development (Laravel dev server)
export const API_BASE_URL = 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  TRANSACTION_TYPES: '/mobile/transaction-types',
  CREATE_TRANSACTION: '/mobile/transaction/create',
  INITIATE_PAYMENT: '/mobile/payment/initiate',
  CHECK_PAYMENT_STATUS: '/mobile/payment/status',
  GET_TRANSACTION: '/mobile/transaction',
  SEARCH_TRANSACTION: '/mobile/transaction/search',
  SUBMIT_COMPLAINT: '/mobile/complaint',
  // Payment release endpoints
  RELEASE_PAYMENT: '/mobile/transaction/release',
  REQUEST_RELEASE: '/mobile/transaction/request-release',
  // User authentication endpoints
  // Try alternative paths if the default doesn't work
  SEND_OTP: '/auth/send-otp', // Changed from '/mobile/auth/send-otp'
  VERIFY_OTP: '/auth/verify-otp', // Changed from '/mobile/auth/verify-otp'
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
      console.error(`Failed endpoint: ${method} ${url}`);
      console.error(`Response status: ${response.status}`);
      console.error(`Response body:`, result);
      
      // Check for 404 (route not found) and provide helpful error message
      if (response.status === 404) {
        return { 
          success: false, 
          message: `API endpoint not found: ${endpoint}. Please check the API configuration.`,
          data: null,
          errors: result.errors || null
        };
      }
      
      // Return error response with all details
      return { 
        success: false, 
        message: result.message || `Request failed with status ${response.status}`,
        data: null,
        errors: result.errors || null
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



// Utility to check if backend is running
import { BACKEND_BASE_URL } from '../config/api'

export const checkBackend = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      return { 
        success: true, 
        status: data.status,
        service: data.service 
      };
    } else {
      return { 
        success: false, 
        error: `Backend returned ${response.status}` 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: `Cannot connect to backend server at ${BACKEND_BASE_URL}`
    };
  }
};

// Check backend on app load
export const initializeBackendCheck = async () => {
  const result = await checkBackend();
  
  if (!result.success) {
    console.warn('Backend not available:', result.error);
    
    // You can show a notification to the user
    if (window.Notification && Notification.permission === 'granted') {
      new Notification('Backend Not Running', {
        body: 'Please start the backend server to process images.',
        icon: '/favicon.ico'
      });
    }
  }
  
  return result;
};

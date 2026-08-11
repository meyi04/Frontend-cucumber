// Utility to check if backend is running
export const checkBackend = async () => {
  try {
    const response = await fetch('http://143.198.90.26/health', {
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
      error: 'Cannot connect to backend server. Make sure it\'s running on http://localhost:5000' 
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
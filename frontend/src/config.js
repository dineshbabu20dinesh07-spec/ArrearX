let API_BASE_URL = 'http://localhost:8000';

if (typeof window !== 'undefined') {
  const origin = window.location.origin;
  const hostname = window.location.hostname;
  
  // If running inside Capacitor WebView (Android uses http://localhost or custom port)
  // or if origin points to the capacitor scheme
  const isCapacitor = origin.startsWith('capacitor://') || 
                      (hostname === 'localhost' && !window.location.port && window.navigator.userAgent.includes('Android'));
  
  if (isCapacitor) {
    // Android emulator loops back to host machine via 10.0.2.2
    API_BASE_URL = 'http://10.0.2.2:8000';
  } else if (import.meta.env.VITE_API_URL) {
    // Use the production backend URL if provided via environment variable
    API_BASE_URL = import.meta.env.VITE_API_URL;
  } else {
    // Normal web development / production web server origin
    API_BASE_URL = `http://${hostname}:8000`;
  }
}

export { API_BASE_URL };

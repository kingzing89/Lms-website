import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  // Set up axios interceptor to include token in all requests
  useEffect(() => {
    // Add request interceptor to include token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = token || localStorage.getItem('authToken');
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token expiration
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token]);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Check if token exists in localStorage
        const storedToken = localStorage.getItem('authToken');
        if (!storedToken) {
          setLoading(false);
          return;
        }

        setToken(storedToken);
        
        // Verify token with server
        const res = await axios.get('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });
        
        setUser(res.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Remove invalid token
        localStorage.removeItem('authToken');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const register = async (userData) => {
    try {
      const res = await axios.post('/api/register', userData);
      
      const { user: newUser, token: newToken } = res.data;
      
      // Store token and user data
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(newUser);
      
      router.push('/courses/watch/dashboard');
      return { success: true, message: res.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };


  const login = async (email, password) => {
  try {
    const res = await axios.post('/api/auth/login', { email, password });
    
    const { user: loggedInUser, token: newToken } = res.data;
    
   
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(loggedInUser);
    
    router.push('/courses/watch/dashboard');
    
  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = 'Login failed. Please check your credentials.';
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Throw the error so it can be caught in the component
    throw new Error(errorMessage);
  }
};



  // Logout user
  const logout = async () => {
    try {
      // Remove token from storage
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      
      router.push('/');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: 'Logout failed' 
      };
    }
  };

  // Return the context value
  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoggedIn: !!user,
      loading,
      register,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
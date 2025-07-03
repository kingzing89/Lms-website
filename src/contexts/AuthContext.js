import { createContext, useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const router = useRouter();

  const logout = async () => {
    try {
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

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = token || localStorage.getItem('authToken');
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout(); 
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [token, logout]);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        if (!storedToken) {
          setLoading(false);
          return;
        }

        setToken(storedToken);

        const res = await axios.get('/api/auth/user', {
          headers: {
            Authorization: `Bearer ${storedToken}`
          }
        });

        setUser(res.data);
      } catch (error) {
        console.error('Auth check failed:', error);
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

      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!user,
        loading,
        register,
        login,
        logout
      }}
    >
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

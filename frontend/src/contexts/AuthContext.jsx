import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, handleAPIError } from '../services/api';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
};

// Action types
const AuthActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  LOAD_USER_START: 'LOAD_USER_START',
  LOAD_USER_SUCCESS: 'LOAD_USER_SUCCESS',
  LOAD_USER_FAILURE: 'LOAD_USER_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  UPDATE_PROFILE_SUCCESS: 'UPDATE_PROFILE_SUCCESS',
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_START:
    case AuthActionTypes.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };
    
    case AuthActionTypes.LOAD_USER_START:
      return {
        ...state,
        loading: true,
      };
    
    case AuthActionTypes.LOGIN_SUCCESS:
    case AuthActionTypes.REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case AuthActionTypes.LOAD_USER_SUCCESS:
    case AuthActionTypes.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    
    case AuthActionTypes.LOGIN_FAILURE:
    case AuthActionTypes.REGISTER_FAILURE:
    case AuthActionTypes.LOAD_USER_FAILURE:
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    
    case AuthActionTypes.LOGOUT:
      // Clear all localStorage items related to authentication
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      // Clear any cached API data
      sessionStorage.clear();
      
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };
    
    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          dispatch({ type: AuthActionTypes.LOAD_USER_START });
          
          // Clear any cached data before loading new user
          sessionStorage.clear();
          
          const response = await authAPI.getProfile();
          dispatch({ 
            type: AuthActionTypes.LOAD_USER_SUCCESS, 
            payload: response.data?.user 
          });
        } catch (error) {
          dispatch({ 
            type: AuthActionTypes.LOAD_USER_FAILURE, 
            payload: handleAPIError(error) 
          });
          localStorage.removeItem('token');
          sessionStorage.clear();
        }
      } else {
        dispatch({ 
          type: AuthActionTypes.LOAD_USER_FAILURE, 
          payload: null 
        });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AuthActionTypes.LOGIN_START });
      
      // Clear any existing cached data before login
      sessionStorage.clear();
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      const response = await authAPI.login(email, password);
      
      // Handle backend response structure: { status, message, token, data: { user } }
      const token = response.token;
      const user = response.data?.user;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      dispatch({ 
        type: AuthActionTypes.LOGIN_SUCCESS, 
        payload: { token, user }
      });
      
      return response;
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ 
        type: AuthActionTypes.LOGIN_FAILURE, 
        payload: errorMessage 
      });
      throw new Error(errorMessage);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      dispatch({ type: AuthActionTypes.REGISTER_START });
      const response = await authAPI.register(userData);
      
      // Handle backend response structure: { status, message, token, data: { user } }
      const token = response.token;
      const user = response.data?.user;
      
      if (!token || !user) {
        throw new Error('Invalid response from server');
      }
      
      dispatch({ 
        type: AuthActionTypes.REGISTER_SUCCESS, 
        payload: { token, user }
      });
      return response;
    } catch (error) {
      const errorMessage = handleAPIError(error);
      dispatch({ 
        type: AuthActionTypes.REGISTER_FAILURE, 
        payload: errorMessage 
      });
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call backend logout to invalidate session
      await authAPI.logout();
    } catch (error) {
      // Even if backend logout fails, we still want to clear frontend state
      console.warn('Backend logout failed, but continuing with frontend logout');
    } finally {
      // Always clear frontend state completely
      dispatch({ type: AuthActionTypes.LOGOUT });
      
      // Clear browser storage completely
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any cached request data
      if (window.caches) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
      
      // Force page reload to completely reset application state
      window.location.href = '/login';
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      dispatch({ 
        type: AuthActionTypes.UPDATE_PROFILE_SUCCESS, 
        payload: response.user 
      });
      return response;
    } catch (error) {
      const errorMessage = handleAPIError(error);
      throw new Error(errorMessage);
    }
  };

  // Change password function
  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await authAPI.changePassword(oldPassword, newPassword);
      return response;
    } catch (error) {
      const errorMessage = handleAPIError(error);
      throw new Error(errorMessage);
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

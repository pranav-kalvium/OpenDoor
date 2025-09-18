// authConstants.js - Separate file for constants to fix react-refresh poly-export issue
export const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

export const INITIAL_AUTH_STATE = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};
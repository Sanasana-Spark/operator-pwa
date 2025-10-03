// context/AuthProvider.js
import React, { createContext, useContext } from 'react';
import { useAuthInfo } from './useAuth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const auth = useAuthInfo();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

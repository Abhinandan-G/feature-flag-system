import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const parseToken = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('token');
    return t ? parseToken(t) : null;
  });

  const login = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(parseToken(token));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
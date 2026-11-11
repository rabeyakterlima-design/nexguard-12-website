import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const ROLES = {
  OWNER: 'OWNER',
  SUPER_ADMIN: 'SUPER_ADMIN',
  SECURITY_ADMIN: 'SECURITY_ADMIN',
  MODULE_ADMIN: 'MODULE_ADMIN',
  AUDITOR: 'AUDITOR',
  USER: 'USER',
};

const DEFAULT_OWNER_USER = {
  id: 'nexguard-owner-001',
  email: 'owner@nexguard.cyber',
  fullName: 'NexGuard Platform Owner',
  role: 'OWNER',
  isOwner: true,
  securityScore: 100,
  mfaEnabled: true,
  status: 'ACTIVE',
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(DEFAULT_OWNER_USER);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('nexguard_token') || 'dev-owner-jwt-token');

  useEffect(() => {
    // Attempt to verify with backend if available
    api.setToken(token);
    api.getMe()
      .then((res) => {
        if (res.data) setCurrentUser(res.data);
      })
      .catch(() => {
        // Fallback to local default persona
      });
  }, [token]);

  const switchPersona = async (role) => {
    setLoading(true);
    try {
      const res = await api.switchPersona(role);
      if (res.data?.user) {
        setCurrentUser(res.data.user);
        if (res.data.accessToken) {
          setToken(res.data.accessToken);
          api.setToken(res.data.accessToken);
        }
      }
    } catch {
      // Offline fallback switch
      const fallbackUsers = {
        OWNER: DEFAULT_OWNER_USER,
        SUPER_ADMIN: { id: 'admin-super-001', email: 'superadmin@nexguard.cyber', fullName: 'Sarah Connor', role: 'SUPER_ADMIN', isOwner: false, securityScore: 96, mfaEnabled: true },
        SECURITY_ADMIN: { id: 'admin-sec-002', email: 'security@nexguard.cyber', fullName: 'Alex Vance', role: 'SECURITY_ADMIN', isOwner: false, securityScore: 94, mfaEnabled: true },
        MODULE_ADMIN: { id: 'admin-mod-003', email: 'moduleadmin@nexguard.cyber', fullName: 'David Lightman', role: 'MODULE_ADMIN', isOwner: false, securityScore: 92, mfaEnabled: true },
        AUDITOR: { id: 'admin-aud-004', email: 'auditor@nexguard.cyber', fullName: 'Elliot Alderson', role: 'AUDITOR', isOwner: false, securityScore: 99, mfaEnabled: true },
        USER: { id: 'user-demo-001', email: 'user@nexguard.cyber', fullName: 'John Doe', role: 'USER', isOwner: false, securityScore: 98, mfaEnabled: true },
      };
      setCurrentUser(fallbackUsers[role] || DEFAULT_OWNER_USER);
    } finally {
      setLoading(false);
    }
  };

  const isOwner = currentUser?.isOwner || currentUser?.role === ROLES.OWNER;
  const isSuperAdmin = isOwner || currentUser?.role === ROLES.SUPER_ADMIN;
  const isSecurityAdmin = isSuperAdmin || currentUser?.role === ROLES.SECURITY_ADMIN;
  const isAuditor = isSuperAdmin || currentUser?.role === ROLES.AUDITOR;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isOwner,
        isSuperAdmin,
        isSecurityAdmin,
        isAuditor,
        switchPersona,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, Restaurant, SignUpPayload, AddStaffPayload, PermissionAction, StaffRole } from '../types/auth';
import { AuthService } from '../services/auth/authService';
import { hasPermission as checkPermission } from '../utils/permissions';

interface AuthContextType {
  user: User | null;
  restaurant: Restaurant | null;
  restaurantId: string | null;
  role: StaffRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ user: User; restaurant: Restaurant }>;
  signUp: (payload: SignUpPayload) => Promise<{ user: User; restaurant: Restaurant }>;
  signOut: () => void;
  hasPermission: (action: PermissionAction) => boolean;
  getStaff: () => User[];
  addStaff: (payload: AddStaffPayload) => User;
  updateStaff: (staffUser: User) => User;
  deleteStaff: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load session on initial render
  useEffect(() => {
    try {
      const session = AuthService.getCurrentSession();
      if (session) {
        setUser(session.user);
        setRestaurant(session.restaurant);
      }
    } catch (e) {
      console.warn('Failed to restore auth session', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signIn = async (email: string, pass: string) => {
    const result = AuthService.signIn(email, pass);
    setUser(result.user);
    setRestaurant(result.restaurant);
    return result;
  };

  const signUp = async (payload: SignUpPayload) => {
    const result = AuthService.signUpRestaurant(payload);
    setUser(result.user);
    setRestaurant(result.restaurant);
    return result;
  };

  const signOut = () => {
    AuthService.signOut();
    setUser(null);
    setRestaurant(null);
  };

  const hasPermission = (action: PermissionAction): boolean => {
    if (!user) return false;
    return checkPermission(user.role, action);
  };

  const getStaff = (): User[] => {
    if (!restaurant) return [];
    return AuthService.getStaffByRestaurant(restaurant.id);
  };

  const addStaff = (payload: AddStaffPayload): User => {
    if (!restaurant) throw new Error('No active restaurant context');
    if (!hasPermission('manage_staff')) {
      throw new Error('You do not have permission to add staff members');
    }
    const newStaff = AuthService.addStaffMember(restaurant.id, payload);
    return newStaff;
  };

  const updateStaff = (staffUser: User): User => {
    if (!restaurant) throw new Error('No active restaurant context');
    if (!hasPermission('manage_staff')) {
      throw new Error('You do not have permission to modify staff members');
    }
    const updated = AuthService.updateStaffMember(staffUser);
    // If updating current user's details, refresh state
    if (user && user.id === updated.id) {
      setUser(updated);
    }
    return updated;
  };

  const deleteStaff = (userId: string): void => {
    if (!restaurant) throw new Error('No active restaurant context');
    if (!hasPermission('manage_staff')) {
      throw new Error('You do not have permission to delete staff members');
    }
    if (user && user.id === userId) {
      throw new Error('Cannot delete your own active owner account');
    }
    AuthService.deleteStaffMember(userId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        restaurant,
        restaurantId: restaurant?.id || null,
        role: user?.role || null,
        isAuthenticated: !!user && !!restaurant,
        isLoading,
        signIn,
        signUp,
        signOut,
        hasPermission,
        getStaff,
        addStaff,
        updateStaff,
        deleteStaff
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type StaffRole = 'owner' | 'manager' | 'chef' | 'inventory_staff';

export type StaffStatus = 'active' | 'inactive';

export interface Restaurant {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  type: string; // e.g., 'Restaurant', 'Cafe', 'Bakery', 'Hotel', 'Cloud Kitchen', 'Catering', or custom
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  restaurantId: string;
  name: string;
  phone: string;
  email: string;
  role: StaffRole;
  status: StaffStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpPayload {
  restaurantName: string;
  ownerName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  restaurantType: string;
  customType?: string;
}

export interface AddStaffPayload {
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  password?: string;
}

export type PermissionAction =
  | 'manage_restaurant'
  | 'manage_staff'
  | 'view_inventory'
  | 'manage_inventory'
  | 'view_recipes'
  | 'manage_recipes'
  | 'start_cooking'
  | 'complete_cooking'
  | 'use_ai'
  | 'view_grocery'
  | 'manage_grocery';

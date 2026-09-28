import type { StaffRole, PermissionAction } from '../types/auth';

/**
 * Centralized Permission Evaluator
 * Checks whether a given staff role can perform a specific system action.
 */
export function hasPermission(role: StaffRole | undefined | null, action: PermissionAction): boolean {
  if (!role) return false;

  const normalizedRole = role.toLowerCase() as StaffRole;

  switch (normalizedRole) {
    case 'owner':
      // Owner has full access to all capabilities
      return true;

    case 'manager':
      // Manager can manage staff, inventory, recipes, cooking, AI, grocery.
      // Only restriction is core restaurant configuration/deletion if restricted.
      return action !== 'manage_restaurant';

    case 'chef':
      // Chef: View inventory, AI Kitchen, view recipes, start/complete cooking, update stock through cooking.
      // Cannot manage staff, manage restaurant, or arbitrarily add/remove raw inventory outside cooking.
      switch (action) {
        case 'view_inventory':
        case 'view_recipes':
        case 'start_cooking':
        case 'complete_cooking':
        case 'use_ai':
        case 'view_grocery':
          return true;
        case 'manage_inventory':
        case 'manage_recipes':
        case 'manage_grocery':
        case 'manage_staff':
        case 'manage_restaurant':
          return false;
        default:
          return false;
      }

    case 'inventory_staff':
      // Inventory Staff: View & modify inventory, view & modify grocery, use AI commands for inventory.
      // Cannot manage staff, manage restaurant, or start/complete cooking sessions.
      switch (action) {
        case 'view_inventory':
        case 'manage_inventory':
        case 'view_grocery':
        case 'manage_grocery':
        case 'use_ai':
          return true;
        case 'view_recipes':
        case 'start_cooking':
        case 'complete_cooking':
        case 'manage_recipes':
        case 'manage_staff':
        case 'manage_restaurant':
          return false;
        default:
          return false;
      }

    default:
      return false;
  }
}

/**
 * Helper to display human readable role labels.
 */
export function getRoleBadgeConfig(role: StaffRole): { label: string; color: string; bg: string; border: string } {
  switch (role) {
    case 'owner':
      return {
        label: 'Owner',
        color: '#f43f5e',
        bg: 'rgba(244, 63, 94, 0.15)',
        border: 'rgba(244, 63, 94, 0.4)'
      };
    case 'manager':
      return {
        label: 'Manager',
        color: '#8b5cf6',
        bg: 'rgba(139, 92, 246, 0.15)',
        border: 'rgba(139, 92, 246, 0.4)'
      };
    case 'chef':
      return {
        label: 'Chef',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.4)'
      };
    case 'inventory_staff':
      return {
        label: 'Inventory Staff',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.4)'
      };
    default:
      return {
        label: role,
        color: '#94a3b8',
        bg: 'rgba(148, 163, 184, 0.15)',
        border: 'rgba(148, 163, 184, 0.4)'
      };
  }
}

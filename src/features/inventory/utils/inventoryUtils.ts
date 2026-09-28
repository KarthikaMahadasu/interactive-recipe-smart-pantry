import type { Ingredient, IngredientCategory } from '../../../types/ingredient';

export type InventoryStatus = 'in_stock' | 'low_stock' | 'expiring_soon' | 'expired' | 'out_of_stock';

export interface StatusBadgeConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
}

/**
 * Calculates real-time inventory status based on actual ingredient data.
 */
export function getInventoryStatus(
  item: Ingredient,
  lowStockThresholds?: Record<string, number>
): InventoryStatus {
  if (item.quantity <= 0) {
    return 'out_of_stock';
  }

  if (item.expiresAt) {
    const expTime = new Date(item.expiresAt).getTime();
    const now = new Date().getTime();
    const daysLeft = (expTime - now) / (1000 * 60 * 60 * 24);

    if (daysLeft < 0) {
      return 'expired';
    }
    if (daysLeft <= 3) {
      return 'expiring_soon';
    }
  } else if (item.freshness === 'critical' || item.freshness === 'expiring_soon') {
    return 'expiring_soon';
  }

  // Category-based or custom low stock threshold
  const categoryThresholds: Record<IngredientCategory, number> = {
    produce: 2,
    dairy: 2,
    grain: 5,
    meat: 2,
    seafood: 2,
    spice: 100, // 100g
    liquid: 1,  // 1L
    canned: 2,
    bakery: 2,
    other: 2
  };

  const defaultThreshold = categoryThresholds[item.category] || 2;
  const threshold = lowStockThresholds?.[item.category] ?? defaultThreshold;

  if (item.quantity <= threshold) {
    return 'low_stock';
  }

  return 'in_stock';
}

/**
 * Provides visual badge styling for inventory status indicators.
 */
export function getStatusBadgeConfig(status: InventoryStatus): StatusBadgeConfig {
  switch (status) {
    case 'in_stock':
      return {
        label: 'In Stock',
        color: '#34d399',
        bg: 'rgba(16, 185, 129, 0.15)',
        border: 'rgba(16, 185, 129, 0.4)'
      };
    case 'low_stock':
      return {
        label: 'Low Stock',
        color: '#fcd34d',
        bg: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.4)'
      };
    case 'expiring_soon':
      return {
        label: 'Expiring Soon',
        color: '#fb923c',
        bg: 'rgba(249, 115, 22, 0.15)',
        border: 'rgba(249, 115, 22, 0.4)'
      };
    case 'expired':
      return {
        label: 'Expired',
        color: '#f87171',
        bg: 'rgba(239, 68, 68, 0.2)',
        border: 'rgba(239, 68, 68, 0.5)'
      };
    case 'out_of_stock':
      return {
        label: 'Out of Stock',
        color: '#94a3b8',
        bg: 'rgba(148, 163, 184, 0.15)',
        border: 'rgba(148, 163, 184, 0.4)'
      };
  }
}

export type InventorySortOption = 'name_asc' | 'name_desc' | 'qty_desc' | 'qty_asc' | 'expiry_asc' | 'updated_desc';

/**
 * Sorts inventory items according to user preference.
 */
export function sortInventory(items: Ingredient[], sortOption: InventorySortOption): Ingredient[] {
  const sorted = [...items];

  switch (sortOption) {
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'qty_desc':
      return sorted.sort((a, b) => b.quantity - a.quantity);
    case 'qty_asc':
      return sorted.sort((a, b) => a.quantity - b.quantity);
    case 'expiry_asc':
      return sorted.sort((a, b) => {
        if (!a.expiresAt) return 1;
        if (!b.expiresAt) return -1;
        return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
      });
    case 'updated_desc':
      return sorted.sort((a, b) => {
        const timeA = new Date(a.updatedAt || a.createdAt).getTime();
        const timeB = new Date(b.updatedAt || b.createdAt).getTime();
        return timeB - timeA;
      });
    default:
      return sorted;
  }
}

import { useMemo, useCallback } from 'react';
import { useKitchenState } from '../state/KitchenContext';
import { getInventoryStatus, sortInventory, type InventoryStatus, type InventorySortOption } from '../features/inventory/utils/inventoryUtils';
import type { Ingredient, IngredientCategory } from '../types/ingredient';

export function usePantry() {
  const { state, addIngredient, updateIngredient, removeIngredient, clearPantry, updateQuantity, updateFreshness } = useKitchenState();

  const getPantry = useCallback(() => {
    return state.pantry;
  }, [state.pantry]);

  /**
   * Multi-criteria search, category filtering, status filtering, and sorting
   */
  const searchPantry = useCallback(
    (
      query: string,
      categoryFilter: IngredientCategory | 'all' = 'all',
      statusFilter: InventoryStatus | 'all' = 'all',
      sortOption: InventorySortOption = 'updated_desc'
    ) => {
      let items = state.pantry;

      if (query.trim()) {
        const q = query.toLowerCase().trim();
        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
        );
      }

      if (categoryFilter !== 'all') {
        items = items.filter((item) => item.category === categoryFilter);
      }

      if (statusFilter !== 'all') {
        items = items.filter((item) => getInventoryStatus(item) === statusFilter);
      }

      return sortInventory(items, sortOption);
    },
    [state.pantry]
  );

  /**
   * Dynamic Real-time Inventory Summary Metrics
   */
  const metrics = useMemo(() => {
    let inStock = 0;
    let lowStock = 0;
    let expiringSoon = 0;
    let outOfStock = 0;

    state.pantry.forEach((item) => {
      const status = getInventoryStatus(item);
      switch (status) {
        case 'in_stock':
          inStock++;
          break;
        case 'low_stock':
          lowStock++;
          break;
        case 'expiring_soon':
          expiringSoon++;
          break;
        case 'expired':
          expiringSoon++; // count expired under warning stats
          break;
        case 'out_of_stock':
          outOfStock++;
          break;
      }
    });

    return {
      totalCount: state.pantry.length,
      inStockCount: inStock,
      lowStockCount: lowStock,
      expiringSoonCount: expiringSoon,
      outOfStockCount: outOfStock
    };
  }, [state.pantry]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    state.pantry.forEach((item) => cats.add(item.category));
    return Array.from(cats);
  }, [state.pantry]);

  return {
    pantry: state.pantry,
    getPantry,
    addIngredient,
    updateIngredient,
    deleteIngredient: removeIngredient,
    clearPantry,
    updateQuantity,
    updateFreshness,
    searchPantry,
    totalCount: metrics.totalCount,
    inStockCount: metrics.inStockCount,
    lowStockCount: metrics.lowStockCount,
    expiringSoonCount: metrics.expiringSoonCount,
    outOfStockCount: metrics.outOfStockCount,
    categories
  };
}

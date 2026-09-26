import { useMemo, useCallback } from 'react';
import { useKitchenState } from '../state/KitchenContext';

export function usePantry() {
  const { state, addIngredient, updateIngredient, removeIngredient, clearPantry, updateQuantity, updateFreshness } = useKitchenState();

  const getPantry = useCallback(() => {
    return state.pantry;
  }, [state.pantry]);

  const searchPantry = useCallback(
    (query: string, categoryFilter: string = 'all', freshnessFilter: string = 'all') => {
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

      if (freshnessFilter !== 'all') {
        items = items.filter((item) => item.freshness === freshnessFilter);
      }

      return items;
    },
    [state.pantry]
  );

  const expiringSoonCount = useMemo(() => {
    return state.pantry.filter((item) => item.freshness === 'expiring_soon' || item.freshness === 'critical').length;
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
    expiringSoonCount,
    categories,
    totalCount: state.pantry.length
  };
}

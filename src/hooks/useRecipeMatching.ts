import { useMemo, useState } from 'react';
import { useKitchenState } from '../state/KitchenContext';
import { RecipeMatchingService, type RecipeMatchResult } from '../services/recipes/recipeMatchingService';

export function useRecipeMatching() {
  const { state, setAIState, setSelectedRecipe } = useKitchenState();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [minMatchFilter, setMinMatchFilter] = useState<number>(0);

  // CRITICAL REQUIREMENT 24: Automatically recalculate when state.pantry or state.recipes changes!
  const matchedRecipes: RecipeMatchResult[] = useMemo(() => {
    return RecipeMatchingService.matchAllRecipes(state.recipes, state.pantry);
  }, [state.recipes, state.pantry]);

  // Filter matched recipes based on search and filters
  const filteredResults = useMemo(() => {
    return matchedRecipes.filter((result) => {
      const recipe = result.recipe;
      const q = searchQuery.toLowerCase().trim();

      // Search match (title, description, ingredients, tags)
      const matchesSearch =
        !q ||
        recipe.title.toLowerCase().includes(q) ||
        recipe.description.toLowerCase().includes(q) ||
        recipe.ingredients.some((i) => i.name.toLowerCase().includes(q)) ||
        (recipe.dietaryTags && recipe.dietaryTags.some((t) => t.toLowerCase().includes(q)));

      // Category filter
      const matchesCategory = categoryFilter === 'all' || recipe.category === categoryFilter;

      // Difficulty filter
      const matchesDifficulty = difficultyFilter === 'all' || recipe.difficulty === difficultyFilter;

      // Minimum match percentage filter
      const matchesMinMatch = result.matchPercentage >= minMatchFilter;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesMinMatch;
    });
  }, [matchedRecipes, searchQuery, categoryFilter, difficultyFilter, minMatchFilter]);

  const selectedMatchResult = useMemo(() => {
    if (!state.selectedRecipeId) return null;
    return matchedRecipes.find((m) => m.recipe.id === state.selectedRecipeId) || null;
  }, [matchedRecipes, state.selectedRecipeId]);

  const inspectRecipe = (recipeId: string) => {
    setSelectedRecipe(recipeId);
    setAIState('thinking');
    setTimeout(() => {
      setAIState('idle');
    }, 1200);
  };

  return {
    matchedRecipes,
    filteredResults,
    selectedMatchResult,
    inspectRecipe,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    difficultyFilter,
    setDifficultyFilter,
    minMatchFilter,
    setMinMatchFilter,
    pantryCount: state.pantry.length,
    totalRecipesCount: state.recipes.length
  };
}

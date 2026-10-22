import { useState, useMemo, useCallback } from 'react';
import { useKitchenState } from '../../../state/KitchenContext';
import { CookingService, type CookingValidationSummary } from '../services/cookingService';
import { RecipeResolverService } from '../../../services/recipes/recipeResolverService';
import type { Recipe } from '../../../types/recipe';

export type CookingStatus = 'not_started' | 'in_progress' | 'paused' | 'completed';

export function useCookingStudio() {
  const { state, finishCookingDeduction, setAIState, setSelectedRecipe } = useKitchenState();

  const [cookingStatus, setCookingStatus] = useState<CookingStatus>('not_started');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [hasDeducted, setHasDeducted] = useState<boolean>(false);
  const [customServings, setCustomServings] = useState<number | null>(null);

  // Base unscaled recipe from state
  const baseRecipe: Recipe | null = useMemo(() => {
    if (state.activeCookingRecipe) return state.activeCookingRecipe;
    if (state.selectedRecipeId) {
      return state.recipes.find((r) => r.id === state.selectedRecipeId) || null;
    }
    return state.recipes[0] || null;
  }, [state.activeCookingRecipe, state.selectedRecipeId, state.recipes]);

  // Current active servings
  const currentServings = customServings ?? (baseRecipe?.servings || 4);

  // Scaled recipe based on active servings
  const activeRecipe: Recipe | null = useMemo(() => {
    if (!baseRecipe) return null;
    return RecipeResolverService.scaleRecipe(baseRecipe, currentServings);
  }, [baseRecipe, currentServings]);

  // Real ingredient validation against active pantry
  const validationSummary: CookingValidationSummary | null = useMemo(() => {
    if (!activeRecipe) return null;
    return CookingService.validateIngredients(activeRecipe, state.pantry);
  }, [activeRecipe, state.pantry]);

  const currentStep = useMemo(() => {
    if (!activeRecipe || !activeRecipe.instructions[currentStepIndex]) return null;
    return activeRecipe.instructions[currentStepIndex];
  }, [activeRecipe, currentStepIndex]);

  const startCooking = useCallback(() => {
    setCookingStatus('in_progress');
    setCurrentStepIndex(0);
    setAIState('working');
  }, [setAIState]);

  const pauseCooking = useCallback(() => {
    setCookingStatus('paused');
    setAIState('idle');
  }, [setAIState]);

  const resumeCooking = useCallback(() => {
    setCookingStatus('in_progress');
    setAIState('working');
  }, [setAIState]);

  const nextStep = useCallback(() => {
    if (!activeRecipe) return;
    if (currentStepIndex < activeRecipe.instructions.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setAIState('working');
    } else {
      setShowCompletionModal(true);
      setAIState('thinking');
    }
  }, [activeRecipe, currentStepIndex, setAIState]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  const selectRecipe = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe.id);
    setCookingStatus('not_started');
    setCurrentStepIndex(0);
    setHasDeducted(false);
    setCustomServings(recipe.servings || 4);
  }, [setSelectedRecipe]);

  const adjustServings = useCallback((newServings: number) => {
    const clamped = Math.max(1, Math.min(50, newServings));
    setCustomServings(clamped);
  }, []);

  const confirmCompletion = useCallback(() => {
    if (!activeRecipe || hasDeducted) return;
    finishCookingDeduction(activeRecipe);
    setHasDeducted(true);
    setCookingStatus('completed');
    setShowCompletionModal(false);
    setAIState('success');
    setTimeout(() => {
      setAIState('idle');
    }, 3000);
  }, [activeRecipe, hasDeducted, finishCookingDeduction, setAIState]);

  return {
    activeRecipe,
    baseRecipe,
    cookingStatus,
    currentStepIndex,
    currentStep,
    currentServings,
    validationSummary,
    showCompletionModal,
    hasDeducted,
    setShowCompletionModal,
    startCooking,
    pauseCooking,
    resumeCooking,
    nextStep,
    prevStep,
    selectRecipe,
    adjustServings,
    confirmCompletion,
    totalSteps: activeRecipe?.instructions.length || 0,
    progressPercentage: activeRecipe ? Math.round(((currentStepIndex + 1) / activeRecipe.instructions.length) * 100) : 0
  };
}

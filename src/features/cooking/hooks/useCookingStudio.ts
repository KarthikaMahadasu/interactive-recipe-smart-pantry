import { useState, useMemo, useCallback } from 'react';
import { useKitchenState } from '../../../state/KitchenContext';
import { CookingService, type CookingValidationSummary } from '../services/cookingService';
import type { Recipe } from '../../../types/recipe';

export type CookingStatus = 'not_started' | 'in_progress' | 'paused' | 'completed';

export function useCookingStudio() {
  const { state, finishCookingDeduction, setAIState, setSelectedRecipe } = useKitchenState();

  const [cookingStatus, setCookingStatus] = useState<CookingStatus>('not_started');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);

  // Active recipe from state
  const activeRecipe: Recipe | null = useMemo(() => {
    if (state.activeCookingRecipe) return state.activeCookingRecipe;
    if (state.selectedRecipeId) {
      return state.recipes.find((r) => r.id === state.selectedRecipeId) || null;
    }
    return state.recipes[0] || null;
  }, [state.activeCookingRecipe, state.selectedRecipeId, state.recipes]);

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
  }, [setSelectedRecipe]);

  const confirmCompletion = useCallback(() => {
    if (!activeRecipe) return;
    finishCookingDeduction(activeRecipe);
    setCookingStatus('completed');
    setShowCompletionModal(false);
    setAIState('success');
    setTimeout(() => {
      setAIState('idle');
    }, 3000);
  }, [activeRecipe, finishCookingDeduction, setAIState]);

  return {
    activeRecipe,
    cookingStatus,
    currentStepIndex,
    currentStep,
    validationSummary,
    showCompletionModal,
    setShowCompletionModal,
    startCooking,
    pauseCooking,
    resumeCooking,
    nextStep,
    prevStep,
    selectRecipe,
    confirmCompletion,
    totalSteps: activeRecipe?.instructions.length || 0,
    progressPercentage: activeRecipe ? Math.round(((currentStepIndex + 1) / activeRecipe.instructions.length) * 100) : 0
  };
}

import { useState, useCallback } from 'react';
import { useKitchenState } from '../../../state/KitchenContext';
import { AIAgentService, type AgentExecutionContext } from '../services/aiAgentService';
import type { AgentResponse, AgentAction } from '../types/agentTypes';
import { useNavigate } from 'react-router-dom';

export function useAIAgent() {
  const navigate = useNavigate();
  const {
    state,
    addIngredient,
    updateIngredient,
    removeIngredient,
    clearPantry,
    setSelectedRecipe,
    startCooking,
    setAIState,
    addAIResponse
  } = useKitchenState();

  const [pendingAction, setPendingAction] = useState<AgentAction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResponse, setLastResponse] = useState<AgentResponse | null>(null);

  const processCommand = useCallback(
    async (commandText: string): Promise<AgentResponse> => {
      if (!commandText.trim()) {
        const resp: AgentResponse = {
          message: 'Please enter a valid kitchen command.',
          intent: 'UNKNOWN',
          status: 'warning',
          timestamp: new Date().toLocaleTimeString()
        };
        setLastResponse(resp);
        return resp;
      }

      setIsProcessing(true);

      // 1. Visual AI Brain State: listening
      setAIState('listening');
      await new Promise((res) => setTimeout(res, 400));

      // 2. Visual AI Brain State: thinking (NLP parsing)
      setAIState('thinking');
      await new Promise((res) => setTimeout(res, 500));

      const executionContext: AgentExecutionContext = {
        pantry: state.pantry,
        recipes: state.recipes,
        activeCookingRecipe: state.activeCookingRecipe,
        addIngredient,
        updateIngredient,
        removeIngredient,
        clearPantry,
        setSelectedRecipe,
        startCooking,
        setAIState
      };

      // 3. Visual AI Brain State: working (State execution)
      setAIState('working');

      const response = await AIAgentService.executeUserCommand(commandText, executionContext);

      setIsProcessing(false);
      setLastResponse(response);

      if (response.status === 'confirmation_required' && response.pendingAction) {
        setPendingAction(response.pendingAction);
        setAIState('idle');
        return response;
      }

      if (response.status === 'error') {
        setAIState('error');
        setTimeout(() => setAIState('idle'), 2500);
      } else {
        setAIState('success');
        setTimeout(() => setAIState('idle'), 2000);
      }

      addAIResponse({
        message: response.message,
        actionRequired: response.actionRequired,
        timestamp: response.timestamp,
        isMock: false
      });

      // Handle navigation routing based on actionRequired
      if (response.actionRequired === 'explore_pantry') {
        setTimeout(() => navigate('/pantry'), 800);
      } else if (response.actionRequired === 'view_recipes') {
        setTimeout(() => navigate('/recipes'), 800);
      } else if (response.actionRequired === 'start_cooking') {
        setTimeout(() => navigate('/cooking'), 800);
      }

      return response;
    },
    [state.pantry, state.recipes, state.activeCookingRecipe, addIngredient, updateIngredient, removeIngredient, clearPantry, setSelectedRecipe, startCooking, setAIState, addAIResponse, navigate]
  );

  const confirmPendingAction = useCallback(async () => {
    if (!pendingAction) return;

    setIsProcessing(true);
    setAIState('working');

    const executionContext: AgentExecutionContext = {
      pantry: state.pantry,
      recipes: state.recipes,
      activeCookingRecipe: state.activeCookingRecipe,
      addIngredient,
      updateIngredient,
      removeIngredient,
      clearPantry,
      setSelectedRecipe,
      startCooking,
      setAIState
    };

    const response = AIAgentService.executeAction(pendingAction, executionContext);

    setPendingAction(null);
    setIsProcessing(false);
    setLastResponse(response);
    setAIState('success');
    setTimeout(() => setAIState('idle'), 2000);

    addAIResponse({
      message: response.message,
      actionRequired: response.actionRequired,
      timestamp: response.timestamp,
      isMock: false
    });

    if (response.actionRequired === 'explore_pantry') {
      setTimeout(() => navigate('/pantry'), 800);
    }
  }, [pendingAction, state.pantry, state.recipes, state.activeCookingRecipe, addIngredient, updateIngredient, removeIngredient, clearPantry, setSelectedRecipe, startCooking, setAIState, addAIResponse, navigate]);

  const cancelPendingAction = useCallback(() => {
    setPendingAction(null);
    setAIState('idle');
  }, [setAIState]);

  return {
    processCommand,
    pendingAction,
    confirmPendingAction,
    cancelPendingAction,
    isProcessing,
    lastResponse,
    recentResponse: state.aiHistory[0] || null
  };
}

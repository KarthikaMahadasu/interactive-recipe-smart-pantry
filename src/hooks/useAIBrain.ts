import { useCallback } from 'react';
import { useKitchenState } from '../state/KitchenContext';
import type { AIBrainState } from '../types/ai';
import { AIService } from '../services/ai/aiService';

export function useAIBrain() {
  const { state, setAIState, addAIResponse } = useKitchenState();

  const changeState = useCallback(
    (newState: AIBrainState) => {
      setAIState(newState);
    },
    [setAIState]
  );

  const queryAI = useCallback(
    async (promptText: string) => {
      if (!promptText.trim()) return;

      // 1. Listening phase
      setAIState('listening');
      await new Promise((res) => setTimeout(res, 400));

      // 2. Thinking phase
      setAIState('thinking');
      await new Promise((res) => setTimeout(res, 600));

      // 3. Working phase
      setAIState('working');

      try {
        const response = await AIService.processKitchenRequest(promptText, {
          pantryCount: state.pantry.length,
          activeZone: state.activeZone || 'Overview'
        });

        // 4. Success phase
        setAIState('success');
        addAIResponse(response);

        // Auto return to idle after 2.5 seconds
        setTimeout(() => {
          setAIState('idle');
        }, 2500);

        return response;
      } catch (error) {
        setAIState('error');
        setTimeout(() => {
          setAIState('idle');
        }, 3000);
      }
    },
    [state.pantry.length, state.activeZone, setAIState, addAIResponse]
  );

  return {
    aiState: state.aiState,
    changeState,
    queryAI,
    recentResponse: state.aiHistory[0] || null
  };
}

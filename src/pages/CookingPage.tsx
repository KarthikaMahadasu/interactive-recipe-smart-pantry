import React, { useState } from 'react';
import { ChefHat, ArrowRight, Bot, Volume2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCookingStudio } from '../features/cooking/hooks/useCookingStudio';
import { CookingHeader } from '../features/cooking/components/CookingHeader';
import { CookingIngredientsCheck } from '../features/cooking/components/CookingIngredientsCheck';
import { CookingStepView } from '../features/cooking/components/CookingStepView';
import { CookingTimer } from '../features/cooking/components/CookingTimer';
import { CookingCompletionModal } from '../features/cooking/components/CookingCompletionModal';
import { AIBrainOrb } from '../features/ai-brain/AIBrainOrb';
import { AICommandBar } from '../features/ai-brain/AICommandBar';
import { useKitchenState } from '../state/KitchenContext';

export const CookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useKitchenState();

  const {
    activeRecipe,
    cookingStatus,
    currentStepIndex,
    currentStep,
    validationSummary,
    showCompletionModal,
    setShowCompletionModal,
    startCooking,
    nextStep,
    prevStep,
    selectRecipe,
    confirmCompletion,
    totalSteps,
    progressPercentage
  } = useCookingStudio();

  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Text-to-Speech handler
  const handleSpeakStep = () => {
    if (!currentStep || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`Step ${currentStep.step}: ${currentStep.text}`);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Requirement 28: Empty state handling if no recipe selected
  if (!activeRecipe) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div
          className="glass-panel"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.15)',
              color: 'var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChefHat size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
            No Recipe Selected
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', maxWidth: '440px' }}>
            Please select a recipe from AI Recipe Discovery to start a guided interactive cooking session.
          </p>
          <button
            onClick={() => navigate('/recipes')}
            style={{
              padding: '12px 24px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--primary-cyan) 0%, #0284c7 100%)',
              color: '#000000',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            Explore AI Recipes <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  const isCookingStarted = cookingStatus !== 'not_started';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Cooking Studio Header */}
      <CookingHeader recipe={activeRecipe} onRecipeChange={selectRecipe} />

      {/* Main Cooking Workspace Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }} className="cooking-layout-grid">
        {/* Left Primary Workspace: Validation & Active Step View */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 1. Ingredient Availability & Pre-cooking Validation */}
          <CookingIngredientsCheck
            summary={validationSummary}
            onStartCooking={startCooking}
            isCookingStarted={isCookingStarted}
          />

          {/* 2. Step-by-step Cooking Instruction View */}
          {isCookingStarted && currentStep && (
            <CookingStepView
              currentStep={currentStep}
              currentStepIndex={currentStepIndex}
              totalSteps={totalSteps}
              progressPercentage={progressPercentage}
              onPrev={prevStep}
              onNext={nextStep}
              onFinish={() => setShowCompletionModal(true)}
              voiceEnabled={voiceEnabled}
              onToggleVoice={() => setVoiceEnabled(!voiceEnabled)}
              onSpeak={handleSpeakStep}
            />
          )}

          {/* 3. AI Command Bar Integration (Requirement 12) */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              borderRadius: '20px',
              background: 'rgba(15, 23, 42, 0.85)'
            }}
          >
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Bot size={16} /> AI Cooking Voice & Command Assistant
            </div>
            <AICommandBar />
          </div>
        </div>

        {/* Right Sidebar: AI Brain Visual Assistant & Timed Step Timer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* AI Cooking Assistant Orb Visual Container (Requirement 11 & 25) */}
          <div
            className="glass-panel"
            style={{
              padding: '24px 20px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              background: 'radial-gradient(circle at center, rgba(139, 92, 246, 0.15) 0%, rgba(15, 23, 42, 0.95) 80%)',
              border: '1px solid rgba(139, 92, 246, 0.3)'
            }}
          >
            <div style={{ transform: 'scale(0.85)' }}>
              <AIBrainOrb state={state.aiState} size={150} showStatusLabel={true} />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)' }}>
                {isCookingStarted ? `Cooking Step ${currentStepIndex + 1} Active` : 'AI Cooking Guide Standby'}
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                {isCookingStarted ? 'Monitoring heat levels & step progression.' : 'Review ingredient readiness to begin.'}
              </p>
            </div>
          </div>

          {/* Timed Step Timer (Requirement 18) */}
          {isCookingStarted && currentStep && (
            <CookingTimer
              durationMinutes={currentStep.durationMinutes || 2}
              stepNumber={currentStepIndex + 1}
            />
          )}

          {/* Quick Voice Prompt Buttons */}
          {isCookingStarted && (
            <div
              className="glass-panel"
              style={{
                padding: '16px',
                borderRadius: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Quick Cooking Queries:
              </div>
              <button
                onClick={handleSpeakStep}
                style={{
                  padding: '6px 10px',
                  borderRadius: '10px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-main)',
                  fontSize: '0.76rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Volume2 size={14} color="var(--primary-cyan)" /> Repeat Current Instruction
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cooking Completion Confirmation Modal (Requirements 13, 14, 15, 16) */}
      <CookingCompletionModal
        recipe={activeRecipe}
        pantry={state.pantry}
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onConfirm={confirmCompletion}
      />

      {/* Mobile Responsive Grid Override */}
      <style>{`
        @media (max-width: 868px) {
          .cooking-layout-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

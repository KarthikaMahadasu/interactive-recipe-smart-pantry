import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Volume2, VolumeX, AlertCircle } from 'lucide-react';
import type { RecipeInstructionStep } from '../../../types/recipe';

interface CookingStepViewProps {
  currentStep: RecipeInstructionStep;
  currentStepIndex: number;
  totalSteps: number;
  progressPercentage: number;
  onPrev: () => void;
  onNext: () => void;
  onFinish: () => void;
  voiceEnabled: boolean;
  onToggleVoice: () => void;
  onSpeak: () => void;
}

export const CookingStepView: React.FC<CookingStepViewProps> = ({
  currentStep,
  currentStepIndex,
  totalSteps,
  progressPercentage,
  onPrev,
  onNext,
  onFinish,
  voiceEnabled,
  onToggleVoice,
  onSpeak
}) => {
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '28px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        background: 'rgba(15, 23, 42, 0.88)',
        border: '1.5px solid rgba(244, 63, 94, 0.35)',
        boxShadow: '0 8px 32px rgba(244, 63, 94, 0.15)'
      }}
    >
      {/* Top Bar: Progress Indicator & Voice Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '12px',
              background: 'rgba(244, 63, 94, 0.2)',
              color: 'var(--accent-rose)',
              fontWeight: 800,
              fontSize: '0.88rem'
            }}
          >
            Step {currentStepIndex + 1} of {totalSteps}
          </span>

          <button
            onClick={onToggleVoice}
            style={{
              padding: '6px 12px',
              borderRadius: '12px',
              background: voiceEnabled ? 'rgba(6, 182, 212, 0.15)' : 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: voiceEnabled ? 'var(--primary-cyan)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {voiceEnabled ? 'Voice Guidance ON' : 'Muted'}
          </button>
        </div>

        <button
          onClick={onSpeak}
          style={{
            padding: '6px 14px',
            borderRadius: '12px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: 'var(--text-main)',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <Volume2 size={16} color="var(--primary-cyan)" /> Read Step Aloud
        </button>
      </div>

      {/* Progress Bar Visual (Requirement 9: Step Progress) */}
      <div style={{ width: '100%', height: 8, borderRadius: 4, background: 'rgba(30, 41, 59, 0.8)', overflow: 'hidden' }}>
        <div
          style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #f43f5e 0%, #10b981 100%)',
            transition: 'width 0.4s ease'
          }}
        />
      </div>

      {/* Instruction Card */}
      <div
        style={{
          padding: '24px',
          borderRadius: '20px',
          background: 'rgba(30, 41, 59, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <h2 style={{ fontSize: '1.35rem', color: 'var(--text-main)', lineHeight: 1.45 }}>
          {currentStep.text}
        </h2>

        {currentStep.tip && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: 'var(--accent-amber)',
              fontSize: '0.85rem'
            }}
          >
            <AlertCircle size={14} style={{ display: 'inline', marginRight: 6 }} />
            <strong>Chef Tip:</strong> {currentStep.tip}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '8px' }}>
        <button
          disabled={currentStepIndex === 0}
          onClick={onPrev}
          style={{
            padding: '10px 20px',
            borderRadius: '14px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: currentStepIndex === 0 ? 'var(--text-dim)' : 'var(--text-main)',
            fontWeight: 600,
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: currentStepIndex === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          <ChevronLeft size={18} /> Previous Step
        </button>

        {!isLastStep ? (
          <button
            onClick={onNext}
            style={{
              padding: '10px 24px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent-rose) 0%, #e11d48 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(244, 63, 94, 0.3)'
            }}
          >
            Next Step <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={onFinish}
            style={{
              padding: '12px 26px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#000000',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)'
            }}
          >
            <CheckCircle size={18} /> Complete Cooking & Deduct Pantry
          </button>
        )}
      </div>
    </div>
  );
};

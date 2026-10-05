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
        background: '#ffffff',
        border: '1px solid #fed7aa',
        boxShadow: '0 4px 20px rgba(234, 88, 12, 0.06)'
      }}
    >
      {/* Top Bar: Progress Indicator & Voice Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: '12px',
              background: '#fff7ed',
              color: '#ea580c',
              border: '1px solid #ffedd5',
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
              background: voiceEnabled ? '#eff6ff' : '#f8fafc',
              border: `1px solid ${voiceEnabled ? '#bfdbfe' : '#e2e8f0'}`,
              color: voiceEnabled ? '#2563eb' : '#64748b',
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
            background: '#ffffff',
            border: '1px solid #fed7aa',
            color: '#ea580c',
            fontSize: '0.8rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
          }}
        >
          <Volume2 size={16} color="#ea580c" /> Read Step Aloud
        </button>
      </div>

      {/* Progress Bar Visual (Requirement 9: Step Progress) */}
      <div style={{ width: '100%', height: 8, borderRadius: 4, background: '#f1f5f9', overflow: 'hidden' }}>
        <div
          style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ea580c 0%, #f97316 100%)',
            transition: 'width 0.4s ease'
          }}
        />
      </div>

      {/* Instruction Card */}
      <div
        style={{
          padding: '24px',
          borderRadius: '20px',
          background: '#fff7ed',
          border: '1px solid #ffedd5'
        }}
      >
        <h2 style={{ fontSize: '1.35rem', color: '#0f172a', fontWeight: 800, lineHeight: 1.45 }}>
          {currentStep.text}
        </h2>

        {currentStep.tip && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              borderRadius: '14px',
              background: '#fffbe5',
              border: '1px solid #fde68a',
              color: '#92400e',
              fontSize: '0.85rem'
            }}
          >
            <AlertCircle size={14} style={{ display: 'inline', marginRight: 6 }} color="#d97706" />
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
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: currentStepIndex === 0 ? '#94a3b8' : '#334155',
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
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(234, 88, 12, 0.25)'
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
              background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(22, 163, 74, 0.25)'
            }}
          >
            <CheckCircle size={18} /> Complete Cooking & Deduct Pantry
          </button>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, ChevronRight, ChevronLeft, Flame, Timer, Sparkles, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKitchenState } from '../state/KitchenContext';
import type { Recipe } from '../types/recipe';

export const CookingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, finishCookingDeduction } = useKitchenState();

  // Active cooking recipe
  const [activeRecipe, setActiveRecipe] = useState<Recipe | null>(
    state.activeCookingRecipe || state.recipes[0] || null
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  // Timer state (seconds)
  const currentStep = activeRecipe?.instructions[currentStepIndex];
  const initialSeconds = (currentStep?.durationMinutes || 2) * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Success summary modal
  const [showFinishedModal, setShowFinishedModal] = useState(false);

  // Reset timer when step changes
  useEffect(() => {
    if (currentStep) {
      setTimeLeft((currentStep.durationMinutes || 2) * 60);
      setIsTimerRunning(false);
    }
  }, [currentStepIndex, activeRecipe]);

  // Timer Ticker
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      // Play audio chime if sound enabled
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {
        // Fallback quiet
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeft]);

  // Voice Text-to-Speech
  const handleSpeakStep = () => {
    if (!currentStep || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`Step ${currentStep.step}: ${currentStep.text}`);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleNextStep = () => {
    if (activeRecipe && currentStepIndex < activeRecipe.instructions.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      if (voiceEnabled) {
        setTimeout(handleSpeakStep, 300);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleFinishCooking = () => {
    if (!activeRecipe) return;
    finishCookingDeduction(activeRecipe);
    setShowFinishedModal(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          borderRadius: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/recipes')}
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: 'rgba(30, 41, 59, 0.6)',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-rose)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Module 4 &bull; Cooking Mode
            </div>
            <h1 style={{ fontSize: '1.6rem', color: 'var(--text-main)' }}>Live Guided Cooking Assistant</h1>
          </div>
        </div>

        {/* Recipe Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={activeRecipe?.id || ''}
            onChange={(e) => {
              const r = state.recipes.find((rec) => rec.id === e.target.value);
              if (r) {
                setActiveRecipe(r);
                setCurrentStepIndex(0);
              }
            }}
            style={{
              padding: '8px 14px',
              borderRadius: '14px',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              fontWeight: 600
            }}
          >
            {state.recipes.map((rec) => (
              <option key={rec.id} value={rec.id}>
                {rec.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {activeRecipe && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }} className="cooking-layout-grid">
          {/* Main Active Step Display */}
          <div
            className="glass-panel"
            style={{
              padding: '32px',
              borderRadius: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid rgba(244, 63, 94, 0.3)'
            }}
          >
            {/* Step Progress & Controls Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    padding: '6px 14px',
                    borderRadius: '12px',
                    background: 'rgba(244, 63, 94, 0.2)',
                    color: 'var(--accent-rose)',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}
                >
                  Step {currentStepIndex + 1} of {activeRecipe.instructions.length}
                </span>

                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
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
                onClick={handleSpeakStep}
                style={{
                  padding: '6px 12px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
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

            {/* Instruction Card */}
            <div
              style={{
                padding: '24px',
                borderRadius: '20px',
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <h2 style={{ fontSize: '1.4rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                {currentStep?.text}
              </h2>

              {currentStep?.tip && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: 'var(--accent-amber)',
                    fontSize: '0.88rem'
                  }}
                >
                  💡 <strong>Chef Tip:</strong> {currentStep.tip}
                </div>
              )}
            </div>

            {/* Step Navigation & Action Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px' }}>
              <button
                disabled={currentStepIndex === 0}
                onClick={handlePrevStep}
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

              {currentStepIndex < activeRecipe.instructions.length - 1 ? (
                <button
                  onClick={handleNextStep}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, var(--accent-rose) 0%, #e11d48 100%)',
                    color: '#fff',
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
                  onClick={handleFinishCooking}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)',
                    color: '#000',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <CheckCircle size={18} /> Finish & Deduct Pantry Stock
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Step Timer & Technique Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Live Step Timer Panel */}
            <div
              className="glass-panel"
              style={{
                padding: '28px 20px',
                borderRadius: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '16px',
                background: 'rgba(15, 23, 42, 0.9)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-rose)', fontWeight: 700, fontSize: '0.85rem' }}>
                <Timer size={18} /> Step Timer
              </div>

              {/* Countdown Display */}
              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: 900,
                  fontFamily: 'monospace',
                  color: timeLeft === 0 ? 'var(--accent-rose)' : 'var(--text-main)',
                  letterSpacing: '0.05em'
                }}
              >
                {formatTime(timeLeft)}
              </div>

              {/* Timer Control Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '14px',
                    background: isTimerRunning ? 'rgba(244, 63, 94, 0.2)' : 'linear-gradient(135deg, var(--primary-cyan) 0%, #0284c7 100%)',
                    color: isTimerRunning ? 'var(--accent-rose)' : '#000',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  {isTimerRunning ? <Pause size={16} /> : <Play size={16} />}
                  {isTimerRunning ? 'Pause' : 'Start'}
                </button>

                <button
                  onClick={() => {
                    setIsTimerRunning(false);
                    setTimeLeft(initialSeconds);
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '14px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  title="Reset timer"
                >
                  <RotateCcw size={16} />
                </button>
              </div>

              {/* Quick Adjust Buttons */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  onClick={() => setTimeLeft((t) => Math.max(0, t - 60))}
                  style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(30, 41, 59, 0.6)', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  -1 min
                </button>
                <button
                  onClick={() => setTimeLeft((t) => t + 60)}
                  style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(30, 41, 59, 0.6)', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  +1 min
                </button>
              </div>
            </div>

            {/* Technique & Heat Guidance Panel */}
            <div
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem' }}>
                <Flame size={18} /> Flame & Heat Guidance
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                Active Technique: <strong style={{ color: 'var(--text-main)' }}>Medium-High Sauté</strong>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '10px' }}>
                Maintain steady heat to achieve crispy golden edges without burning delicate spicing.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Finished Recipe Summary Modal */}
      {showFinishedModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: '100%',
              maxWidth: '500px',
              borderRadius: '28px',
              padding: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '20px',
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(16, 185, 129, 0.4)'
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={36} />
            </div>

            <div>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>Bon Appétit!</h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                You completed <strong>{activeRecipe?.title}</strong>. Required ingredients have been deducted from your Smart Pantry stock.
              </p>
            </div>

            <div style={{ width: '100%', background: 'rgba(30, 41, 59, 0.5)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
              <div>
                <Sparkles size={20} color="var(--primary-cyan)" />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Pantry Stock</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>Updated</div>
              </div>
              <div>
                <ShoppingBag size={20} color="var(--accent-amber)" />
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>Auto Restock</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-amber)' }}>Added</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
              <button
                onClick={() => {
                  setShowFinishedModal(false);
                  navigate('/pantry');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'rgba(30, 41, 59, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                View Pantry
              </button>

              <button
                onClick={() => {
                  setShowFinishedModal(false);
                  navigate('/grocery');
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, var(--accent-emerald) 0%, #059669 100%)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                View Restock List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Responsive Styling */}
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

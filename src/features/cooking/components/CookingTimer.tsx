import React, { useState, useEffect } from 'react';
import { Timer as TimerIcon, Play, Pause, RotateCcw } from 'lucide-react';

interface CookingTimerProps {
  durationMinutes: number;
  stepNumber: number;
}

export const CookingTimer: React.FC<CookingTimerProps> = ({ durationMinutes, stepNumber }) => {
  const initialSeconds = durationMinutes * 60;
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);

  // Reset timer when step duration or number changes
  useEffect(() => {
    setTimeLeft(durationMinutes * 60);
    setIsRunning(false);
  }, [durationMinutes, stepNumber]);

  // Timer interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play web audio chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
      } catch (e) {
        // Fallback
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px 20px',
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '14px',
        background: '#ffffff',
        border: '1px solid #fed7aa',
        boxShadow: '0 4px 20px rgba(234, 88, 12, 0.06)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ea580c', fontWeight: 800, fontSize: '0.85rem' }}>
        <TimerIcon size={18} /> Step {stepNumber} Timer ({durationMinutes}m)
      </div>

      <div
        style={{
          fontSize: '2.8rem',
          fontWeight: 900,
          fontFamily: 'monospace',
          color: timeLeft === 0 ? '#dc2626' : '#0f172a',
          letterSpacing: '0.05em'
        }}
      >
        {formatTime(timeLeft)}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            padding: '8px 18px',
            borderRadius: '12px',
            background: isRunning ? '#fef2f2' : 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
            border: isRunning ? '1px solid #fecaca' : 'none',
            color: isRunning ? '#dc2626' : '#ffffff',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
            boxShadow: isRunning ? 'none' : '0 4px 12px rgba(234, 88, 12, 0.25)'
          }}
        >
          {isRunning ? <Pause size={16} /> : <Play size={16} />}
          {isRunning ? 'Pause' : 'Start Timer'}
        </button>

        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(initialSeconds);
          }}
          style={{
            width: 38,
            height: 38,
            borderRadius: '12px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Reset step timer"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};

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
        background: 'rgba(15, 23, 42, 0.9)',
        border: '1.5px solid rgba(244, 63, 94, 0.3)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-rose)', fontWeight: 700, fontSize: '0.85rem' }}>
        <TimerIcon size={18} /> Step {stepNumber} Timer ({durationMinutes}m)
      </div>

      <div
        style={{
          fontSize: '2.8rem',
          fontWeight: 900,
          fontFamily: 'monospace',
          color: timeLeft === 0 ? 'var(--accent-rose)' : 'var(--text-main)',
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
            background: isRunning ? 'rgba(244, 63, 94, 0.2)' : 'linear-gradient(135deg, var(--primary-cyan) 0%, #0284c7 100%)',
            color: isRunning ? 'var(--accent-rose)' : '#000000',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
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
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'var(--text-main)',
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

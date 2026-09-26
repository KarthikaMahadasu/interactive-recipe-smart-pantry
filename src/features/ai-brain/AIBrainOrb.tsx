import React, { useRef, useEffect, useState } from 'react';
import type { AIBrainState } from '../../types/ai';
import { SpatialAnchorNode } from '../../spatial/SpatialAnchor';

interface AIBrainOrbProps {
  state: AIBrainState;
  size?: number;
  onClick?: () => void;
  showStatusLabel?: boolean;
}

export const STATUS_TEXT_MAP: Record<AIBrainState, string> = {
  idle: 'Ready',
  listening: 'Listening...',
  thinking: 'Thinking...',
  working: 'Working...',
  success: 'Completed',
  error: 'Something went wrong'
};

const STATE_CONFIGS: Record<
  AIBrainState,
  {
    coreColor: string;
    glowColor: string;
    particleColor: string;
    speed: number;
    pulseFrequency: number;
    particleCount: number;
    ariaDescription: string;
  }
> = {
  idle: {
    coreColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    particleColor: '#38bdf8',
    speed: 0.015,
    pulseFrequency: 0.003,
    particleCount: 24,
    ariaDescription: 'AI Kitchen Core is idle and ready.'
  },
  listening: {
    coreColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.65)',
    particleColor: '#34d399',
    speed: 0.04,
    pulseFrequency: 0.008,
    particleCount: 36,
    ariaDescription: 'AI Kitchen Core is listening to input.'
  },
  thinking: {
    coreColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.65)',
    particleColor: '#fbbf24',
    speed: 0.07,
    pulseFrequency: 0.012,
    particleCount: 45,
    ariaDescription: 'AI Kitchen Core is thinking and processing.'
  },
  working: {
    coreColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.75)',
    particleColor: '#c084fc',
    speed: 0.09,
    pulseFrequency: 0.015,
    particleCount: 50,
    ariaDescription: 'AI Kitchen Core is performing a task.'
  },
  success: {
    coreColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.85)',
    particleColor: '#6ee7b7',
    speed: 0.03,
    pulseFrequency: 0.005,
    particleCount: 60,
    ariaDescription: 'AI Task completed successfully.'
  },
  error: {
    coreColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.75)',
    particleColor: '#fda4af',
    speed: 0.06,
    pulseFrequency: 0.018,
    particleCount: 30,
    ariaDescription: 'AI Task encountered an error.'
  }
};

export const AIBrainOrb: React.FC<AIBrainOrbProps> = ({
  state = 'idle',
  size = 180,
  onClick,
  showStatusLabel = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check user preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let pulseAngle = 0;

    const config = STATE_CONFIGS[state] || STATE_CONFIGS.idle;
    const isReduced = prefersReducedMotion;
    const speedFactor = isReduced ? 0.2 : 1.0;

    // Initialize particle array
    const particles = Array.from({ length: config.particleCount }, (_, i) => ({
      orbitRadius: (size * 0.22) + (i % 3) * (size * 0.08),
      angle: (i * Math.PI * 2) / config.particleCount,
      speed: (0.01 + (i % 4) * 0.005) * (state === 'thinking' ? 2.5 : 1) * speedFactor,
      radius: 1.5 + (i % 3) * 0.8
    }));

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;
      const baseRadius = size * 0.28;

      angle += config.speed * speedFactor;
      pulseAngle += config.pulseFrequency * speedFactor;

      const currentPulse = isReduced ? 0 : Math.sin(pulseAngle) * (size * 0.04);
      const orbRadius = baseRadius + currentPulse;

      // 1. Volumetric Ambient Glow Layer
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        orbRadius * 0.3,
        centerX,
        centerY,
        orbRadius * 1.85
      );
      glowGrad.addColorStop(0, config.glowColor);
      glowGrad.addColorStop(0.5, config.glowColor.replace(/[\d.]+\)$/, '0.15)'));
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius * 1.85, 0, Math.PI * 2);
      ctx.fill();

      // 2. Soundwave Ripples for Listening & Working states
      if ((state === 'listening' || state === 'working') && !isReduced) {
        ctx.strokeStyle = config.coreColor;
        ctx.lineWidth = state === 'listening' ? 2 : 1.5;
        for (let r = 1; r <= 3; r++) {
          const ringRadius = (orbRadius * 1.1) + ((pulseAngle * 50 + r * 22) % (size * 0.36));
          const ringOpacity = Math.max(0, 1 - ringRadius / (size * 0.46));
          ctx.globalAlpha = ringOpacity * 0.7;
          ctx.beginPath();
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
      }

      // 3. Error Warning Pulse Ring
      if (state === 'error' && !isReduced) {
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 2;
        const errRadius = orbRadius + Math.abs(Math.sin(pulseAngle * 3)) * 12;
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, errRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      }

      // 4. Central Spherical Core Gradient
      const coreGrad = ctx.createRadialGradient(
        centerX - orbRadius * 0.3,
        centerY - orbRadius * 0.3,
        orbRadius * 0.08,
        centerX,
        centerY,
        orbRadius
      );
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.35, config.coreColor);
      coreGrad.addColorStop(0.85, config.coreColor.replace('#', '#11'));
      coreGrad.addColorStop(1, '#080c14');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // 5. Rotating Orbital Energy Mesh
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      ctx.strokeStyle = config.particleColor;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.55;

      ctx.beginPath();
      ctx.ellipse(0, 0, orbRadius * 1.22, orbRadius * 0.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, orbRadius * 1.22, orbRadius * 0.5, -Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // 6. Orbiting Ambient Particles (Inward swirl for Thinking, outward for Working)
      particles.forEach((p, idx) => {
        if (state === 'thinking') {
          p.orbitRadius = Math.max(size * 0.1, p.orbitRadius - 0.15 * speedFactor);
          if (p.orbitRadius <= size * 0.1) p.orbitRadius = size * 0.35;
        }

        p.angle += p.speed;
        const px = centerX + Math.cos(p.angle) * p.orbitRadius;
        const py = centerY + Math.sin(p.angle) * p.orbitRadius * (0.75 + (idx % 2) * 0.1);

        ctx.fillStyle = config.particleColor;
        ctx.shadowColor = config.coreColor;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(px, py, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [state, size, prefersReducedMotion]);

  const config = STATE_CONFIGS[state] || STATE_CONFIGS.idle;
  const statusText = STATUS_TEXT_MAP[state] || 'Ready';

  return (
    <SpatialAnchorNode id="AIAnchor">
      <div
        role="status"
        aria-live="polite"
        aria-label={`AI Kitchen Brain State: ${statusText}. ${config.ariaDescription}`}
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick?.();
          }
        }}
        className="ai-orb-container"
        style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: onClick ? 'pointer' : 'default',
          outline: 'none',
          userSelect: 'none',
          borderRadius: '50%'
        }}
      >
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          style={{
            display: 'block',
            filter: state === 'thinking' ? 'contrast(1.15) brightness(1.1)' : 'none',
            transition: 'filter 0.3s ease'
          }}
        />

        {showStatusLabel && (
          <div
            style={{
              position: 'absolute',
              bottom: -10,
              fontSize: '0.78rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: config.coreColor,
              textShadow: `0 0 12px ${config.glowColor}`,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              background: 'rgba(8, 12, 20, 0.88)',
              padding: '4px 14px',
              borderRadius: '14px',
              border: `1px solid ${config.glowColor}`,
              boxShadow: `0 4px 16px ${config.glowColor}44`,
              transition: 'all 0.3s ease'
            }}
          >
            {statusText}
          </div>
        )}
      </div>
    </SpatialAnchorNode>
  );
};

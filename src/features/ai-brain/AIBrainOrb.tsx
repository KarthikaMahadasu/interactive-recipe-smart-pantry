import React, { useRef, useEffect } from 'react';
import type { AIBrainState } from '../../types/ai';

interface AIBrainOrbProps {
  state: AIBrainState;
  size?: number;
  onClick?: () => void;
}

const STATE_CONFIGS: Record<
  AIBrainState,
  {
    coreColor: string;
    glowColor: string;
    particleColor: string;
    speed: number;
    pulseFrequency: number;
    particleCount: number;
    label: string;
  }
> = {
  idle: {
    coreColor: '#06b6d4',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    particleColor: '#38bdf8',
    speed: 0.02,
    pulseFrequency: 0.003,
    particleCount: 24,
    label: 'AI Kitchen Assistant (Idle)'
  },
  listening: {
    coreColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.6)',
    particleColor: '#34d399',
    speed: 0.05,
    pulseFrequency: 0.008,
    particleCount: 36,
    label: 'Listening to Kitchen Command...'
  },
  thinking: {
    coreColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.6)',
    particleColor: '#fbbf24',
    speed: 0.08,
    pulseFrequency: 0.012,
    particleCount: 45,
    label: 'Analyzing Pantry & Recipes...'
  },
  working: {
    coreColor: '#8b5cf6',
    glowColor: 'rgba(139, 92, 246, 0.7)',
    particleColor: '#a78bfa',
    speed: 0.1,
    pulseFrequency: 0.015,
    particleCount: 50,
    label: 'Synthesizing Culinary Output...'
  },
  success: {
    coreColor: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.8)',
    particleColor: '#6ee7b7',
    speed: 0.04,
    pulseFrequency: 0.006,
    particleCount: 60,
    label: 'Command Executed Successfully!'
  },
  error: {
    coreColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.7)',
    particleColor: '#fda4af',
    speed: 0.07,
    pulseFrequency: 0.02,
    particleCount: 30,
    label: 'AI Attention Required'
  }
};

export const AIBrainOrb: React.FC<AIBrainOrbProps> = ({ state = 'idle', size = 180, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;
    let pulseAngle = 0;

    const config = STATE_CONFIGS[state] || STATE_CONFIGS.idle;

    // Create particle positions
    const particles = Array.from({ length: config.particleCount }, (_, i) => ({
      orbitRadius: (size * 0.22) + (i % 3) * (size * 0.08),
      angle: (i * Math.PI * 2) / config.particleCount,
      speed: (0.01 + (i % 4) * 0.005) * (state === 'thinking' ? 2.5 : 1),
      radius: 1.5 + (i % 3) * 0.8
    }));

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      const centerX = size / 2;
      const centerY = size / 2;
      const baseRadius = size * 0.28;

      angle += config.speed;
      pulseAngle += config.pulseFrequency;

      const currentPulse = Math.sin(pulseAngle) * (size * 0.04);
      const orbRadius = baseRadius + currentPulse;

      // 1. Outer Volumetric Ambient Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        orbRadius * 0.4,
        centerX,
        centerY,
        orbRadius * 1.8
      );
      glowGrad.addColorStop(0, config.glowColor);
      glowGrad.addColorStop(0.5, config.glowColor.replace(/[\d.]+\)$/, '0.15)'));
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // 2. State-specific Wave Rings (for listening or working states)
      if (state === 'listening' || state === 'working') {
        ctx.strokeStyle = config.coreColor;
        ctx.lineWidth = 1.5;
        for (let r = 1; r <= 3; r++) {
          const ringRadius = (orbRadius * 1.1) + ((pulseAngle * 40 + r * 20) % (size * 0.35));
          const ringOpacity = Math.max(0, 1 - ringRadius / (size * 0.45));
          ctx.globalAlpha = ringOpacity * 0.6;
          ctx.beginPath();
          ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.globalAlpha = 1.0;
      }

      // 3. Central Core Spherical Gradient
      const coreGrad = ctx.createRadialGradient(
        centerX - orbRadius * 0.3,
        centerY - orbRadius * 0.3,
        orbRadius * 0.1,
        centerX,
        centerY,
        orbRadius
      );
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, config.coreColor);
      coreGrad.addColorStop(0.85, config.coreColor.replace('#', '#1a'));
      coreGrad.addColorStop(1, '#080c14');

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2);
      ctx.fill();

      // 4. Rotating Energy Ring Mesh
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      ctx.strokeStyle = config.particleColor;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.5;

      ctx.beginPath();
      ctx.ellipse(0, 0, orbRadius * 1.2, orbRadius * 0.5, Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, orbRadius * 1.2, orbRadius * 0.5, -Math.PI / 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();

      // 5. Orbiting Swarm Particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const px = centerX + Math.cos(p.angle) * p.orbitRadius;
        const py = centerY + Math.sin(p.angle) * p.orbitRadius * 0.8;

        ctx.fillStyle = config.particleColor;
        ctx.shadowColor = config.coreColor;
        ctx.shadowBlur = 8;
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
  }, [state, size]);

  const config = STATE_CONFIGS[state] || STATE_CONFIGS.idle;

  return (
    <div
      onClick={onClick}
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
        userSelect: 'none'
      }}
      title={config.label}
    >
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          display: 'block',
          filter: state === 'thinking' ? 'contrast(1.2)' : 'none',
          transition: 'filter 0.3s ease'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: -8,
          fontSize: '0.75rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: config.coreColor,
          textShadow: `0 0 10px ${config.glowColor}`,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          background: 'rgba(8, 12, 20, 0.7)',
          padding: '2px 10px',
          borderRadius: '12px',
          border: `1px solid ${config.glowColor}`
        }}
      >
        {state}
      </div>
    </div>
  );
};

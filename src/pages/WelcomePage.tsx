import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, LogIn, UserPlus, Package, Utensils, ShoppingBag } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated 3D-inspired peaceful nature canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Nature particles (floating pollen/light motes)
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.5 - 0.2,
      opacity: Math.random() * 0.5 + 0.3
    }));

    const render = () => {
      time += 0.008;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Sky Gradient (Peaceful twilight / dawn atmospheric lighting)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#0a1128');
      skyGrad.addColorStop(0.4, '#1c2d42');
      skyGrad.addColorStop(0.7, '#2b3a4e');
      skyGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Soft Glowing Sun / Horizon Glow
      const sunGrad = ctx.createRadialGradient(w * 0.5, h * 0.35, 10, w * 0.5, h * 0.35, w * 0.45);
      sunGrad.addColorStop(0, 'rgba(56, 189, 248, 0.25)');
      sunGrad.addColorStop(0.4, 'rgba(16, 185, 129, 0.12)');
      sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(0, 0, w, h);

      // 3. Parallax Mountain Range Layer 1 (Distant high mountains)
      ctx.fillStyle = '#152232';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.65);
      for (let x = 0; x <= w; x += 40) {
        const y = h * 0.45 + Math.sin((x * 0.003) + time * 0.5) * 45 + Math.cos(x * 0.007) * 30;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // 4. Parallax Mountain Range Layer 2 (Midground rolling mountains)
      ctx.fillStyle = '#0d1826';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.75);
      for (let x = 0; x <= w; x += 30) {
        const y = h * 0.55 + Math.sin((x * 0.005) - time * 0.8) * 35 + Math.sin(x * 0.012) * 20;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // 5. Pine Tree Outlines Layer at Horizon Base
      ctx.fillStyle = '#09101d';
      const treeSpacing = 28;
      for (let x = 0; x < w; x += treeSpacing) {
        const baseH = h * 0.68 + Math.sin(x * 0.004) * 20;
        const treeH = 35 + (Math.sin(x) * 15);
        ctx.beginPath();
        ctx.moveTo(x, baseH);
        ctx.lineTo(x + treeSpacing * 0.5, baseH - treeH);
        ctx.lineTo(x + treeSpacing, baseH);
        ctx.fill();
      }

      // 6. Water Reflection Base (Calm lake at lower 25%)
      const waterGrad = ctx.createLinearGradient(0, h * 0.72, 0, h);
      waterGrad.addColorStop(0, 'rgba(13, 27, 42, 0.9)');
      waterGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.95)');
      waterGrad.addColorStop(1, '#090d16');
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, h * 0.72, w, h * 0.28);

      // Water Ripple Highlights
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const ry = h * 0.76 + i * 22 + Math.sin(time * 2 + i) * 3;
        ctx.beginPath();
        ctx.moveTo(0, ry);
        ctx.bezierCurveTo(w * 0.25, ry + 4, w * 0.75, ry - 4, w, ry);
        ctx.stroke();
      }

      // 7. Floating Nature Particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = h;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#090d16'
      }}
    >
      {/* 3D Nature Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Hero Glass Content Center */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '920px',
          margin: '0 auto',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px'
        }}
      >
        {/* Brand Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            borderRadius: '9999px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 20px rgba(56, 189, 248, 0.15)'
          }}
        >
          <Sparkles size={16} /> Intelligent Kitchen OS & Smart Pantry
        </div>

        {/* Peaceful Grand Main Heading */}
        <div style={{ textAlign: 'center', maxWidth: '780px' }}>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: '#f9fafb',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)'
            }}
          >
            Serene Kitchen Intelligence & Restaurant Management
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#d1d5db',
              marginTop: '16px',
              lineHeight: 1.6,
              fontWeight: 400,
              maxWidth: '680px',
              margin: '16px auto 0'
            }}
          >
            Experience a modern, high-precision kitchen ecosystem. Seamlessly monitor live stock, discover recipe matches, automate restocking, and command your kitchen with AI intelligence.
          </p>
        </div>

        {/* Two Main Prominent Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            width: '100%',
            maxWidth: '520px',
            marginTop: '8px'
          }}
        >
          <button
            onClick={() => navigate('/signin')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '16px 32px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
              color: '#ffffff',
              fontSize: '1.05rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.04em',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 25px rgba(56, 189, 248, 0.4)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="hover-lift"
          >
            <LogIn size={20} />
            <span>SIGN IN</span>
          </button>

          <button
            onClick={() => navigate('/signup')}
            style={{
              flex: 1,
              minWidth: '200px',
              padding: '16px 32px',
              borderRadius: '18px',
              background: 'rgba(31, 41, 55, 0.85)',
              color: '#f9fafb',
              fontSize: '1.05rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.04em',
              border: '1.5px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="hover-lift"
          >
            <UserPlus size={20} color="#10b981" />
            <span>REGISTER</span>
          </button>
        </div>

        {/* Key Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            width: '100%',
            marginTop: '16px'
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: '20px 18px',
              borderRadius: '20px',
              background: 'rgba(17, 24, 39, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              textAlign: 'left'
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: '12px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', marginBottom: '10px' }}>
              <Package size={20} />
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f9fafb' }}>Shared Restaurant Stock</h3>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>Real-time isolated stock tracking with automatic quantity deductions.</p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '20px 18px',
              borderRadius: '20px',
              background: 'rgba(17, 24, 39, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              textAlign: 'left'
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a855f7', marginBottom: '10px' }}>
              <Sparkles size={20} />
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f9fafb' }}>AI Neural Assistant</h3>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>Execute voice & text commands for usage, waste, delivery, and recipe prep.</p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '20px 18px',
              borderRadius: '20px',
              background: 'rgba(17, 24, 39, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              textAlign: 'left'
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', marginBottom: '10px' }}>
              <Utensils size={20} />
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f9fafb' }}>Recipe & Cooking Studio</h3>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>Automatic inventory availability check and step-by-step guided cooking.</p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '20px 18px',
              borderRadius: '20px',
              background: 'rgba(17, 24, 39, 0.75)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(16px)',
              textAlign: 'left'
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', marginBottom: '10px' }}>
              <ShoppingBag size={20} />
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#f9fafb' }}>Smart Grocery Restock</h3>
            <p style={{ fontSize: '0.78rem', color: '#9ca3af', marginTop: '4px' }}>Automated restock list generation, priority tracking, and delivery intake.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

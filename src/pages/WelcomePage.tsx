import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, LogIn, UserPlus, Package, Utensils, ShoppingBag } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-performance 3D Reference-to-Life Canvas Layer Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const isMobile = window.innerWidth < 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 40;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 25;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Floating Orange Energy Particles
    const particleCount = isMobile ? 16 : 32;
    const particles = Array.from({ length: particleCount }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      speedY: Math.random() * 0.4 + 0.2,
      phase: i * 0.5,
      opacity: Math.random() * 0.5 + 0.3
    }));

    const render = () => {
      time += prefersReducedMotion ? 0.001 : 0.006;
      mouseX += (targetMouseX - mouseX) * 0.04;
      mouseY += (targetMouseY - mouseY) * 0.04;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // ==========================================
      // LAYER 1: Soft Cream / White Atmosphere & Pulsing Radial Glow
      // ==========================================
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#ffffff');
      skyGrad.addColorStop(0.25, '#fff7ed');
      skyGrad.addColorStop(0.65, '#ffedd5');
      skyGrad.addColorStop(1, '#f8fafc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Soft Breathing Orange Radial Glow behind heading
      const glowX = w * 0.5 + mouseX * 0.2;
      const glowY = h * 0.24 + mouseY * 0.2;
      const pulseRadius = (w * (isMobile ? 0.45 : 0.32)) + Math.sin(time * 1.5) * 15;

      const headingGlow = ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, pulseRadius);
      headingGlow.addColorStop(0, 'rgba(234, 88, 12, 0.18)');
      headingGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.08)');
      headingGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = headingGlow;
      ctx.beginPath();
      ctx.arc(glowX, glowY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // ==========================================
      // LAYER 2: Large Flowing 3D Orange Wave (Behind Action Buttons)
      // ==========================================
      ctx.save();
      ctx.translate(mouseX * 0.5, mouseY * 0.5);

      const waveBaseY = h * 0.48;
      const waveGrad = ctx.createLinearGradient(0, waveBaseY - 40, w, waveBaseY + 120);
      waveGrad.addColorStop(0, '#f97316');
      waveGrad.addColorStop(0.5, '#ea580c');
      waveGrad.addColorStop(1, '#c2410c');

      ctx.fillStyle = waveGrad;
      ctx.beginPath();
      ctx.moveTo(-50, h + 50);
      ctx.lineTo(-50, waveBaseY);

      for (let x = -50; x <= w + 50; x += 30) {
        const sine1 = Math.sin(x * 0.0025 + time * 1.2) * 45;
        const sine2 = Math.cos(x * 0.005 - time * 0.7) * 20;
        const y = waveBaseY + sine1 + sine2;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(w + 50, h + 50);
      ctx.closePath();

      ctx.shadowColor = 'rgba(234, 88, 12, 0.25)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 10;
      ctx.fill();
      ctx.shadowColor = 'transparent';

      // 3D Highlight Sheen Overlay on Top Edge of Wave
      ctx.strokeStyle = 'rgba(254, 215, 170, 0.6)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = -50; x <= w + 50; x += 30) {
        const sine1 = Math.sin(x * 0.0025 + time * 1.2) * 45;
        const sine2 = Math.cos(x * 0.005 - time * 0.7) * 20;
        const y = waveBaseY + sine1 + sine2;
        if (x === -50) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.restore();

      // ==========================================
      // LAYER 3: 3D Layered Geometric Landscape Prisms (Near Bottom Horizon)
      // ==========================================
      ctx.save();
      ctx.translate(mouseX * 0.8, mouseY * 0.8);

      const landscapeBaseY = h * 0.72;

      const drawPrism = (apexX: number, height: number, width: number, swayOffset: number) => {
        const currX = apexX + Math.sin(time + swayOffset) * 8;
        const topY = landscapeBaseY - height;
        const leftX = currX - width * 0.5;
        const rightX = currX + width * 0.5;
        const midX = currX + width * 0.08;

        // Shadow Under Prism
        ctx.fillStyle = 'rgba(194, 65, 12, 0.2)';
        ctx.beginPath();
        ctx.ellipse(currX, landscapeBaseY + 10, width * 0.45, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Left Lit Face (Lighter Orange)
        ctx.fillStyle = '#fb923c';
        ctx.beginPath();
        ctx.moveTo(currX, topY);
        ctx.lineTo(leftX, landscapeBaseY);
        ctx.lineTo(midX, landscapeBaseY);
        ctx.closePath();
        ctx.fill();

        // Right Shaded Face (Deeper Orange)
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(currX, topY);
        ctx.lineTo(midX, landscapeBaseY);
        ctx.lineTo(rightX, landscapeBaseY);
        ctx.closePath();
        ctx.fill();

        // Edge Highlight Line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(currX, topY);
        ctx.lineTo(midX, landscapeBaseY);
        ctx.stroke();
      };

      if (!isMobile) {
        drawPrism(w * 0.12, 110, 140, 0);
        drawPrism(w * 0.28, 150, 180, 1.2);
        drawPrism(w * 0.72, 140, 170, 2.4);
        drawPrism(w * 0.88, 100, 130, 3.6);
      } else {
        drawPrism(w * 0.2, 80, 100, 0);
        drawPrism(w * 0.8, 80, 100, 2);
      }

      ctx.restore();

      // ==========================================
      // LAYER 4: 3D Horizontal Orange Trajectory Lines (Near Bottom)
      // ==========================================
      ctx.save();
      ctx.translate(mouseX * 1.2, mouseY * 1.2);

      ctx.strokeStyle = 'rgba(234, 88, 12, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([12, 16]);

      const lineY1 = h * 0.76;
      const lineY2 = h * 0.84;
      const lineY3 = h * 0.92;

      ctx.lineDashOffset = -time * 30;
      ctx.beginPath();
      ctx.moveTo(-50, lineY1);
      ctx.lineTo(w + 50, lineY1);
      ctx.stroke();

      ctx.lineDashOffset = time * 25;
      ctx.beginPath();
      ctx.moveTo(-50, lineY2);
      ctx.lineTo(w + 50, lineY2);
      ctx.stroke();

      ctx.lineDashOffset = -time * 40;
      ctx.beginPath();
      ctx.moveTo(-50, lineY3);
      ctx.lineTo(w + 50, lineY3);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.restore();

      // ==========================================
      // LAYER 5: Floating Glowing Orange Energy Particles
      // ==========================================
      ctx.save();
      ctx.translate(mouseX * 1.5, mouseY * 1.5);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += Math.sin(time * 1.5 + p.phase) * 0.4;

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }

        ctx.fillStyle = `rgba(249, 115, 22, ${p.opacity * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
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
        background: '#f8fafc'
      }}
    >
      {/* Reference-to-Life 3D Layer Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* Hero Content Layer (Foreground UI Above All 3D Planes) */}
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
            background: 'rgba(234, 88, 12, 0.1)',
            border: '1px solid rgba(234, 88, 12, 0.25)',
            color: '#ea580c',
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            boxShadow: '0 4px 20px rgba(234, 88, 12, 0.1)'
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
              color: '#ea580c',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              textShadow: '0 2px 10px rgba(234, 88, 12, 0.15)'
            }}
          >
            Serene Kitchen Intelligence & Restaurant Management
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.2rem)',
              color: '#475569',
              marginTop: '16px',
              lineHeight: 1.6,
              fontWeight: 500,
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
              background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
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
              boxShadow: '0 8px 25px rgba(234, 88, 12, 0.35)',
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
              background: '#ffffff',
              color: '#ea580c',
              fontSize: '1.05rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              letterSpacing: '0.04em',
              border: '1.5px solid #ea580c',
              backdropFilter: 'blur(16px)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            className="hover-lift"
          >
            <UserPlus size={20} color="#ea580c" />
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
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
              textAlign: 'left'
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: '12px', background: 'rgba(234, 88, 12, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', marginBottom: '10px' }}>
              <Package size={20} />
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ea580c' }}>Shared Restaurant Stock</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Real-time isolated stock tracking with automatic quantity deductions.</p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '20px 18px',
              borderRadius: '20px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
              textAlign: 'left'
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: '12px', background: 'rgba(234, 88, 12, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', marginBottom: '10px' }}>
              <Sparkles size={20} />
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ea580c' }}>AI Neural Assistant</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Execute voice & text commands for usage, waste, delivery, and recipe prep.</p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '20px 18px',
              borderRadius: '20px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
              textAlign: 'left'
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: '12px', background: 'rgba(234, 88, 12, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', marginBottom: '10px' }}>
              <Utensils size={20} />
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ea580c' }}>Recipe & Cooking Studio</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Automatic inventory availability check and step-by-step guided cooking.</p>
          </div>

          <div
            className="glass-panel"
            style={{
              padding: '20px 18px',
              borderRadius: '20px',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.04)',
              textAlign: 'left'
            }}
          >
            <div style={{ width: 38, height: 38, borderRadius: '12px', background: 'rgba(234, 88, 12, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c', marginBottom: '10px' }}>
              <ShoppingBag size={20} />
            </div>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ea580c' }}>Smart Grocery Restock</h3>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '4px' }}>Automated restock list generation, priority tracking, and delivery intake.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

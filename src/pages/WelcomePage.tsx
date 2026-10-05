import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, LogIn, UserPlus, Package, Utensils, ShoppingBag } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated AI Restaurant Garden Courtyard canvas background
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

    // Floating AI energy particles
    const aiParticles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -Math.random() * 0.6 - 0.2,
      opacity: Math.random() * 0.5 + 0.3
    }));

    // Creative Orange Butterflies fluttering in the courtyard
    const butterflies = Array.from({ length: 6 }, (_, i) => ({
      x: (i + 1) * (canvas.width / 7),
      y: canvas.height * (0.35 + Math.random() * 0.35),
      baseX: (i + 1) * (canvas.width / 7),
      baseY: canvas.height * 0.5,
      size: Math.random() * 5 + 8,
      speed: 0.005 + Math.random() * 0.005,
      phase: i * (Math.PI / 3),
      wingAngle: 0
    }));

    const render = () => {
      time += 0.008;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Sky & Canvas Atmosphere (Clean White + Warm Sunlit Orange Tint)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#fff7ed');
      skyGrad.addColorStop(0.35, '#ffedd5');
      skyGrad.addColorStop(0.75, '#f1f5f9');
      skyGrad.addColorStop(1, '#f8fafc');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Central AI Core Warm Radial Light Glow
      const aiGlow = ctx.createRadialGradient(w * 0.5, h * 0.38, 10, w * 0.5, h * 0.38, w * 0.4);
      aiGlow.addColorStop(0, 'rgba(234, 88, 12, 0.16)');
      aiGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.06)');
      aiGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = aiGlow;
      ctx.fillRect(0, 0, w, h);

      // 3. Restaurant Courtyard Perspective Terrace & Tile Floor Grid
      const horizonY = h * 0.58;
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.08)';
      ctx.lineWidth = 1;

      // Courtyard Perspective Lines
      for (let x = -w * 0.5; x <= w * 1.5; x += w * 0.12) {
        ctx.beginPath();
        ctx.moveTo(w * 0.5, horizonY * 0.9);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Courtyard Horizontal Tile Lines
      for (let y = horizonY; y <= h; y += (h - horizonY) / 7) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Courtyard Terrace Base Line
      ctx.fillStyle = 'rgba(254, 215, 170, 0.4)';
      ctx.fillRect(0, horizonY, w, 2);

      // 4. Restaurant Courtyard Pergola / Archway Structure Silhouettes
      ctx.strokeStyle = 'rgba(234, 88, 12, 0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Left Archway Pillar
      ctx.moveTo(w * 0.1, h);
      ctx.lineTo(w * 0.1, horizonY * 0.6);
      ctx.bezierCurveTo(w * 0.1, horizonY * 0.3, w * 0.3, horizonY * 0.3, w * 0.3, horizonY * 0.6);
      ctx.lineTo(w * 0.3, h);

      // Right Archway Pillar
      ctx.moveTo(w * 0.7, h);
      ctx.lineTo(w * 0.7, horizonY * 0.6);
      ctx.bezierCurveTo(w * 0.7, horizonY * 0.3, w * 0.9, horizonY * 0.3, w * 0.9, horizonY * 0.6);
      ctx.lineTo(w * 0.9, h);
      ctx.stroke();

      // 5. Warm Restaurant Hanging Pendant Lights
      const pendantPositions = [w * 0.2, w * 0.35, w * 0.65, w * 0.8];
      pendantPositions.forEach((px) => {
        const py = horizonY * 0.45;
        // Cord
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px, 0);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Lamp Shade
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI, true);
        ctx.fill();

        // Soft Warm Glow Halo
        const glow = ctx.createRadialGradient(px, py + 4, 2, px, py + 4, 35);
        glow.addColorStop(0, 'rgba(249, 115, 22, 0.25)');
        glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(px, py + 4, 35, 0, Math.PI * 2);
        ctx.fill();
      });

      // 6. Courtyard Dining Tables & Smart Kitchen Counter Silhouettes
      const drawTable = (tx: number, ty: number, scale: number) => {
        ctx.fillStyle = 'rgba(234, 88, 12, 0.12)';
        ctx.strokeStyle = 'rgba(234, 88, 12, 0.25)';
        ctx.lineWidth = 1.5;

        // Tabletop
        ctx.beginPath();
        ctx.ellipse(tx, ty, 32 * scale, 12 * scale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Table Stand
        ctx.beginPath();
        ctx.moveTo(tx, ty + 12 * scale);
        ctx.lineTo(tx, ty + 36 * scale);
        ctx.stroke();

        // Plates & Wine Glass Silhouettes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(tx - 10 * scale, ty - 2 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.arc(tx + 10 * scale, ty - 2 * scale, 5 * scale, 0, Math.PI * 2);
        ctx.fill();
      };

      drawTable(w * 0.18, horizonY + 50, 0.85);
      drawTable(w * 0.82, horizonY + 50, 0.85);
      drawTable(w * 0.32, horizonY + 110, 1.1);
      drawTable(w * 0.68, horizonY + 110, 1.1);

      // 7. Subtle Decorative Courtyard Potted Plants
      const drawPottedPlant = (px: number, py: number, pScale: number) => {
        // Pot
        ctx.fillStyle = '#fdba74';
        ctx.beginPath();
        ctx.moveTo(px - 10 * pScale, py);
        ctx.lineTo(px + 10 * pScale, py);
        ctx.lineTo(px + 7 * pScale, py + 20 * pScale);
        ctx.lineTo(px - 7 * pScale, py + 20 * pScale);
        ctx.closePath();
        ctx.fill();

        // Leaves
        ctx.fillStyle = 'rgba(234, 88, 12, 0.35)';
        for (let a = -0.8; a <= 0.8; a += 0.4) {
          ctx.beginPath();
          ctx.ellipse(px + Math.sin(a) * 12 * pScale, py - 10 * pScale - Math.cos(a) * 8 * pScale, 6 * pScale, 14 * pScale, a, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      drawPottedPlant(w * 0.06, horizonY + 30, 0.9);
      drawPottedPlant(w * 0.94, horizonY + 30, 0.9);
      drawPottedPlant(w * 0.24, horizonY + 130, 1.1);
      drawPottedPlant(w * 0.76, horizonY + 130, 1.1);

      // 8. Elegant Animated Orange Butterflies
      butterflies.forEach((b) => {
        const flowTime = time * 0.8 + b.phase;
        b.x = b.baseX + Math.sin(flowTime * 1.2) * 90 + Math.cos(flowTime * 0.5) * 40;
        b.y = b.baseY + Math.cos(flowTime * 0.9) * 45 + Math.sin(flowTime * 1.5) * 20;
        b.wingAngle = Math.sin(time * 16 + b.phase) * 0.8;

        ctx.save();
        ctx.translate(b.x, b.y);

        // Butterfly Wings (Orange + Light Amber)
        ctx.fillStyle = 'rgba(234, 88, 12, 0.75)';
        const wingW = b.size * Math.cos(b.wingAngle);

        // Left Wing
        ctx.beginPath();
        ctx.ellipse(-wingW * 0.6, -b.size * 0.4, Math.max(1, Math.abs(wingW)), b.size * 0.7, -0.3, 0, Math.PI * 2);
        ctx.fill();

        // Right Wing
        ctx.beginPath();
        ctx.ellipse(wingW * 0.6, -b.size * 0.4, Math.max(1, Math.abs(wingW)), b.size * 0.7, 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Butterfly Body
        ctx.fillStyle = '#c2410c';
        ctx.beginPath();
        ctx.ellipse(0, 0, 1.5, b.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // 9. Floating Orange AI Energy Particles
      aiParticles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) {
          p.y = h;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        ctx.fillStyle = `rgba(234, 88, 12, ${p.opacity * 0.5})`;
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
        background: '#f8fafc'
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

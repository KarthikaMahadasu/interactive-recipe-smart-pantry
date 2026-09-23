import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  return (
    <div className="app-container">
      {/* Ambient Radial Mesh Background */}
      <div className="kitchen-ambient-bg" />

      {/* Floating Glass Navigation Header */}
      <Navbar />

      {/* Primary Page Route Content */}
      <main className="main-content" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '24px 16px 40px' }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: 'auto',
          padding: '20px 16px',
          textAlign: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-dim)',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}
      >
        <span>Interactive Recipe & Smart Pantry Manager</span> &bull; 
        <span>Module 1 AI Kitchen World Foundation</span>
      </footer>
    </div>
  );
};

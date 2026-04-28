import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * Shared layout wrapper for all dashboard pages.
 * Uses explicit inline styles for the 256px sidebar offset
 * to avoid Tailwind v4 utility class issues.
 */
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex" style={{ background: '#080c14' }}>
      <Sidebar />
      {/* Main content: offset by sidebar width using explicit style */}
      <div
        style={{
          marginLeft: '256px',
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Navbar />
        <main
          style={{
            flex: 1,
            padding: '2rem',
            overflowX: 'hidden',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

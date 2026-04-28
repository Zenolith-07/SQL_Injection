import { Bell, Search, Command } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <header
      className="h-16 flex items-center justify-between px-8 sticky top-0 z-30"
      style={{
        background: 'rgba(10, 16, 24, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(30,45,66,0.8)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {/* Left — Greeting */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold" style={{ color: '#e2e8f0', fontFamily: 'var(--font-heading)' }}>
            {getGreeting()}, <span style={{ color: '#818cf8' }}>{firstName}</span>
          </h2>
          <span className="text-base">👋</span>
        </div>
        <p className="text-xs" style={{ color: '#4a5568' }}>{formatDate()}</p>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {/* Search hint */}
        <button
          className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all duration-200 cursor-pointer"
          style={{
            background: 'rgba(20,30,46,0.8)',
            border: '1px solid #1e2d42',
            color: '#6b7a99',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2a3d57'; e.currentTarget.style.color = '#8896b3'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d42'; e.currentTarget.style.color = '#6b7a99'; }}
        >
          <Search size={13} />
          <span>Quick search...</span>
          <span
            className="ml-2 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}
          >
            <Command size={9} />
            K
          </span>
        </button>

        {/* Notification Bell */}
        <button
          className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 cursor-pointer"
          style={{ background: 'rgba(20,30,46,0.8)', border: '1px solid #1e2d42', color: '#6b7a99' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2a3d57'; e.currentTarget.style.color = '#c8d3e8'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e2d42'; e.currentTarget.style.color = '#6b7a99'; }}
        >
          <Bell size={17} />
          {/* Notification dot */}
          <span
            className="absolute top-2 right-2 w-2 h-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #f43f5e, #e11d48)',
              boxShadow: '0 0 6px rgba(244,63,94,0.6)',
              border: '1.5px solid #0a1018',
            }}
          />
        </button>

        {/* Divider */}
        <div className="w-px h-6 mx-1" style={{ background: '#1e2d42' }} />

        {/* Security Mode indicator */}
        <div
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium"
          style={{
            background: 'rgba(16,185,129,0.08)',
            border: '1px solid rgba(16,185,129,0.15)',
            color: '#10b981',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: '#10b981', boxShadow: '0 0 6px rgba(16,185,129,0.7)' }}
          />
          Secure Session
        </div>
      </div>
    </header>
  );
}

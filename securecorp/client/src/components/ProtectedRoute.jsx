import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2 } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#080c14' }}
      >
        <div className="flex flex-col items-center gap-5">
          {/* Animated logo */}
          <div
            className="w-16 h-16 rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(99,102,241,0.15)',
              animation: 'pulse-glow 2s ease-in-out infinite',
            }}
          >
            <Building2 size={28} className="text-white" />
          </div>

          {/* Spinner ring */}
          <div
            className="w-8 h-8 rounded-full animate-spin-slow"
            style={{
              border: '2px solid rgba(99,102,241,0.2)',
              borderTopColor: '#6366f1',
            }}
          />

          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: '#8896b3', fontFamily: 'var(--font-heading)' }}>
              NexaHR
            </p>
            <p className="text-xs mt-1" style={{ color: '#4a5568' }}>
              Authenticating session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

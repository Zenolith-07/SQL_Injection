import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Format date
  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <header className="h-16 border-b border-border bg-surface/50 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left — Greeting */}
      <div>
        <h2 className="text-lg font-semibold text-text font-[family-name:var(--font-heading)]">
          {getGreeting()}, {firstName} 👋
        </h2>
        <p className="text-xs text-muted">{formatDate()}</p>
      </div>

      {/* Right — Notifications */}
      <div className="flex items-center gap-4">
        <button className="relative p-2.5 rounded-lg text-muted hover:text-text hover:bg-surface-hover transition-all duration-200 cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-surface" />
        </button>
      </div>
    </header>
  );
}

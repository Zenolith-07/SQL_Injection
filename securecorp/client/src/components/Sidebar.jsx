import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, FileText, Bell, Settings,
  Users, BarChart3, Shield, Wrench, LogOut,
  ChevronRight, Building2, TrendingUp
} from 'lucide-react';

const userNavItems = [
  { path: '/dashboard',               icon: LayoutDashboard, label: 'Dashboard',     exact: true },
  { path: '/dashboard/profile',       icon: User,            label: 'My Profile' },
  { path: '/dashboard/requests',      icon: FileText,        label: 'Requests' },
  { path: '/dashboard/notifications', icon: Bell,            label: 'Notifications' },
  { path: '/dashboard/settings',      icon: Settings,        label: 'Settings' },
];

const adminNavItems = [
  { path: '/admin',           icon: LayoutDashboard, label: 'Overview',   exact: true },
  { path: '/admin/employees', icon: Users,           label: 'Employees' },
  { path: '/admin/reports',   icon: BarChart3,       label: 'Analytics' },
  { path: '/admin/security',  icon: Shield,          label: 'Security' },
  { path: '/admin/settings',  icon: Wrench,          label: 'Settings' },
];

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const getAvatarGradient = (name) => {
  const gradients = [
    'from-indigo-500 to-purple-600',
    'from-violet-500 to-indigo-600',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
  ];
  const idx = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return gradients[idx % gradients.length];
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user?.role === 'admin';
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (item) => {
    if (item.path.includes('#')) return false;
    if (item.exact) return location.pathname === item.path;
    return location.pathname === item.path || location.pathname.startsWith(item.path + '/');
  };

  return (
    <aside
      style={{
        background: 'linear-gradient(180deg, #0c1220 0%, #0a1018 100%)',
        borderRight: '1px solid #1e2d42',
        width: '256px',
      }}
      className="fixed left-0 top-0 bottom-0 flex flex-col z-40 overflow-hidden"
    >
      {/* ── Logo ── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid #1e2d42' }}>
        <div className="flex items-center gap-3">
          {/* Logo Icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 4px 14px rgba(99,102,241,0.4)'
            }}
          >
            <Building2 size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight tracking-wide">NexaHR</h2>
            <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: '#6b7a99' }}>
              {isAdmin ? 'Admin Console' : 'Employee Portal'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="px-2 mb-3 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#4a5568' }}>
          {isAdmin ? 'Management' : 'Navigation'}
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm relative group transition-all duration-200"
                style={{
                  background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                  color: active ? '#818cf8' : '#6b7a99',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(25,33,51,0.8)'; e.currentTarget.style.color = '#c8d3e8'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7a99'; }}}
              >
                {active && <span className="nav-indicator" />}
                <Icon
                  size={17}
                  style={{ color: active ? '#6366f1' : 'currentColor', flexShrink: 0 }}
                />
                <span className="flex-1 font-medium">{item.label}</span>
                {active && (
                  <ChevronRight size={14} style={{ color: '#4f46e5', opacity: 0.7 }} />
                )}
              </NavLink>
            );
          })}
        </div>

        {/* ── Quick Stats (Admin only) ── */}
        {isAdmin && (
          <div className="mt-6">
            <p className="px-2 mb-3 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#4a5568' }}>
              Quick Info
            </p>
            <div
              className="mx-1 p-3.5 rounded-xl"
              style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.12)' }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} style={{ color: '#6366f1' }} />
                <span className="text-xs font-semibold" style={{ color: '#a5b4fc' }}>System Status</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span className="text-xs" style={{ color: '#6b7a99' }}>All systems operational</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ── User Section ── */}
      <div className="p-3" style={{ borderTop: '1px solid #1e2d42' }}>
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1"
          style={{ background: 'rgba(15,22,35,0.6)' }}
        >
          <div
            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarGradient(user?.name)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
            style={{ boxShadow: '0 3px 10px rgba(0,0,0,0.3)' }}
          >
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: '#e2e8f0' }}>{user?.name}</p>
            <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : 'badge-accent'}`}>
              {user?.role}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer"
          style={{ color: '#6b7a99' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7a99'; }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

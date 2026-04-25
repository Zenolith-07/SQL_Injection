import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, User, FileText, Bell, Settings,
  Users, BarChart3, Shield, Wrench, LogOut, ChevronRight
} from 'lucide-react';
import logo from '../assets/logo.svg';

const userNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/dashboard#profile', icon: User, label: 'My Profile' },
  { path: '/dashboard#requests', icon: FileText, label: 'Requests' },
  { path: '/dashboard#notifications', icon: Bell, label: 'Notifications' },
  { path: '/dashboard#settings', icon: Settings, label: 'Settings' },
];

const adminNavItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/employees', icon: Users, label: 'Employees' },
  { path: '/admin#reports', icon: BarChart3, label: 'Reports' },
  { path: '/admin#security', icon: Shield, label: 'Security' },
  { path: '/admin#settings', icon: Wrench, label: 'Settings' },
];

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

  // Generate initials from user name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  // Generate a consistent color from name
  const getAvatarColor = (name) => {
    const colors = [
      'from-blue-500 to-blue-700',
      'from-purple-500 to-purple-700',
      'from-emerald-500 to-emerald-700',
      'from-orange-500 to-orange-700',
      'from-pink-500 to-pink-700',
      'from-cyan-500 to-cyan-700',
    ];
    const index = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  const isActive = (path) => {
    if (path.includes('#')) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-surface border-r border-border flex flex-col z-40">
      {/* Logo Area */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <img src={logo} alt="SecureCorp" className="w-9 h-auto" />
          <div>
            <h2 className="text-base font-bold font-[family-name:var(--font-heading)] text-text leading-tight">
              SecureCorp
            </h2>
            <p className="text-[10px] text-muted uppercase tracking-wider">Employee Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative ${
                  active
                    ? 'bg-accent/10 text-accent-light'
                    : 'text-muted hover:text-text hover:bg-surface-hover'
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-r-full" />
                )}
                <Icon size={18} className={active ? 'text-accent' : 'text-muted group-hover:text-text'} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={14} className="text-accent/50" />}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Section */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${getAvatarColor(user?.name)} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text truncate">{user?.name}</p>
            <span className={`inline-block text-[10px] px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
              user?.role === 'admin'
                ? 'bg-danger/15 text-danger'
                : 'bg-accent/15 text-accent'
            }`}>
              {user?.role}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-danger hover:bg-danger/10 transition-all duration-200 cursor-pointer"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

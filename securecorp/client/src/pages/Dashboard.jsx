import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { Building2, Briefcase, CalendarDays, Clock, Monitor, LogIn, Eye } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

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

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return '$' + salary.toLocaleString();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Mock activity log
  const recentActivity = [
    { icon: LogIn, text: 'Logged in from Windows Desktop', time: '2 minutes ago', color: 'text-success' },
    { icon: Eye, text: 'Viewed employee directory', time: '1 hour ago', color: 'text-accent' },
    { icon: Monitor, text: 'Session started - Chrome Browser', time: '1 hour ago', color: 'text-muted' },
    { icon: LogIn, text: 'Logged in from Windows Desktop', time: 'Yesterday, 9:15 AM', color: 'text-success' },
    { icon: Eye, text: 'Updated profile information', time: 'Yesterday, 10:30 AM', color: 'text-warning' },
  ];

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 animate-fade-in-up opacity-0">
            <StatCard icon={Building2} label="Department" value={user?.department || 'N/A'} color="accent" />
            <StatCard icon={Briefcase} label="Job Role" value={user?.role === 'admin' ? 'Administrator' : 'Employee'} color="success" />
            <StatCard icon={CalendarDays} label="Member Since" value={formatDate(user?.joined_date)} color="warning" />
          </div>

          {/* Profile Card */}
          <div className="bg-surface border border-border rounded-xl p-8 mb-8 animate-fade-in-up opacity-0 stagger-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${getAvatarColor(user?.name)} flex items-center justify-center text-white text-2xl font-bold shadow-xl`}>
                {getInitials(user?.name)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text">{user?.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    user?.role === 'admin'
                      ? 'bg-danger/15 text-danger'
                      : 'bg-accent/15 text-accent'
                  }`}>
                    {user?.role}
                  </span>
                </div>
                <p className="text-muted text-sm">{user?.department} Department</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-muted uppercase tracking-wider">Email</p>
                <p className="text-sm text-text">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted uppercase tracking-wider">Phone</p>
                <p className="text-sm text-text">{user?.phone || 'Not set'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted uppercase tracking-wider">Department</p>
                <p className="text-sm text-text">{user?.department}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted uppercase tracking-wider">Salary</p>
                <p className="text-sm text-text">{formatSalary(user?.salary)}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface border border-border rounded-xl p-6 animate-fade-in-up opacity-0 stagger-2">
            <div className="flex items-center gap-2 mb-5">
              <Clock size={18} className="text-muted" />
              <h4 className="text-base font-semibold font-[family-name:var(--font-heading)] text-text">Recent Activity</h4>
            </div>
            <div className="space-y-4">
              {recentActivity.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-4 py-2 border-b border-border/50 last:border-0">
                    <div className={`w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center ${item.color}`}>
                      <Icon size={15} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-text">{item.text}</p>
                    </div>
                    <span className="text-xs text-muted whitespace-nowrap">{item.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

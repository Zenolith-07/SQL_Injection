import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import {
  Building2, Briefcase, CalendarDays, Clock,
  Monitor, LogIn, Eye, Mail, Phone, DollarSign,
  Activity, TrendingUp, Award, AlertCircle
} from 'lucide-react';

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const getAvatarGradient = (name) => {
  const g = [
    ['#6366f1', '#8b5cf6'],
    ['#8b5cf6', '#6366f1'],
    ['#3b82f6', '#6366f1'],
    ['#10b981', '#0d9488'],
    ['#f43f5e', '#e11d48'],
    ['#f59e0b', '#d97706'],
  ];
  const idx = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return g[idx % g.length];
};

const formatSalary = (s) => s ? '$' + Number(s).toLocaleString() : 'N/A';
const formatDate   = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

const recentActivity = [
  { icon: LogIn,   text: 'Signed in from Windows · Chrome 124',    time: '2 min ago',          color: '#10b981' },
  { icon: Eye,     text: 'Viewed company directory',                time: '1 hr ago',            color: '#6366f1' },
  { icon: Monitor, text: 'New session initiated',                   time: '1 hr ago',            color: '#6b7a99' },
  { icon: LogIn,   text: 'Signed in from macOS · Safari',          time: 'Yesterday 9:15 AM',   color: '#10b981' },
  { icon: Eye,     text: 'Updated profile information',             time: 'Yesterday 10:30 AM',  color: '#f59e0b' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [c1, c2] = getAvatarGradient(user?.name);

  return (
    <DashboardLayout>
      {/* ── Page Title ── */}
      <div style={{ marginBottom: '1.5rem' }} className="animate-fade-in-up opacity-0">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>
          My Dashboard
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7a99' }}>
          Your personal workspace and activity overview
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem', marginBottom: '1.5rem' }}
        className="animate-fade-in-up opacity-0 stagger-1"
      >
        <StatCard icon={Building2}   label="Department"  value={user?.department || 'N/A'}                            subValue="Current assignment" color="accent"  />
        <StatCard icon={Briefcase}   label="Job Role"    value={user?.role === 'admin' ? 'Administrator' : 'Employee'} subValue="Access level"       color="violet"  />
        <StatCard icon={CalendarDays} label="Member Since" value={formatDate(user?.joined_date)}                       subValue="Onboarding date"    color="success" />
      </div>

      {/* ── Profile + Activity Row ── */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}
        className="animate-fade-in-up opacity-0 stagger-2"
      >
        {/* Profile Card */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(20,30,46,0.95), rgba(12,18,32,0.98))',
            border: '1px solid #1e2d42',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}
        >
          {/* Avatar + name */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #1e2d42' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '1rem',
                background: `linear-gradient(135deg, ${c1}, ${c2})`,
                boxShadow: `0 8px 24px rgba(99,102,241,0.35)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '1.5rem', fontWeight: 700,
              }}>
                {getInitials(user?.name)}
              </div>
              <span style={{
                position: 'absolute', bottom: '-4px', right: '-4px',
                width: '16px', height: '16px', borderRadius: '9999px',
                background: '#10b981', border: '2.5px solid #0c1220',
                boxShadow: '0 0 8px rgba(16,185,129,0.6)',
              }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>
                  {user?.name}
                </h3>
                <span className={`badge ${user?.role === 'admin' ? 'badge-danger' : 'badge-accent'}`}>
                  {user?.role}
                </span>
                <span className="badge badge-success">Active</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#6b7a99', marginBottom: '0.75rem' }}>{user?.department} Department</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {[
                  { icon: Award,      label: 'Performance', val: 'Excellent' },
                  { icon: TrendingUp, label: 'YTD Growth',  val: '+12%' },
                  { icon: Activity,   label: 'Engagement',  val: 'High' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Icon size={12} style={{ color: '#6366f1' }} />
                      <span style={{ fontSize: '0.75rem', color: '#4a5568' }}>{item.label}:</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#818cf8' }}>{item.val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Info grid 2x2 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { icon: Mail,       label: 'Email Address', value: user?.email },
              { icon: Phone,      label: 'Phone Number',  value: user?.phone || 'Not configured' },
              { icon: Building2,  label: 'Department',    value: user?.department },
              { icon: DollarSign, label: 'Salary',        value: formatSalary(user?.salary) },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  padding: '0.875rem', borderRadius: '0.75rem',
                  background: 'rgba(8,12,20,0.6)', border: '1px solid rgba(30,45,66,0.5)',
                }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '0.5rem', flexShrink: 0,
                    background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={14} style={{ color: '#818cf8' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: '#4a5568', marginBottom: '0.2rem' }}>
                      {item.label}
                    </p>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#c8d3e8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(20,30,46,0.95), rgba(12,18,32,0.98))',
            border: '1px solid #1e2d42',
            borderRadius: '1rem',
            padding: '1.5rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            display: 'flex', flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={13} style={{ color: '#818cf8' }} />
              </div>
              <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>Recent Activity</h4>
            </div>
            <span className="badge badge-accent">Live</span>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {recentActivity.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', padding: '0.625rem', borderRadius: '0.625rem', transition: 'background 0.15s', cursor: 'default' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(20,30,46,0.8)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ width: '26px', height: '26px', borderRadius: '0.5rem', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                    <Icon size={12} style={{ color: item.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.75rem', color: '#8896b3', lineHeight: 1.4 }}>{item.text}</p>
                    <p style={{ fontSize: '0.65rem', color: '#4a5568', marginTop: '0.15rem' }}>{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            style={{ marginTop: '0.75rem', width: '100%', padding: '0.625rem', borderRadius: '0.625rem', background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.12)', color: '#818cf8', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.14)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.07)'}
          >
            View all activity →
          </button>
        </div>
      </div>

      {/* ── Security Banner ── */}
      <div
        className="animate-fade-in-up opacity-0 stagger-3"
        style={{ marginTop: '1.25rem', borderRadius: '1rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)' }}
      >
        <div style={{ width: '36px', height: '36px', borderRadius: '0.625rem', flexShrink: 0, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertCircle size={16} style={{ color: '#818cf8' }} />
        </div>
        <div>
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#c8d3e8' }}>Your session is secured with end-to-end encryption</p>
          <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>All activity is logged and monitored. Unauthorized access is prohibited.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

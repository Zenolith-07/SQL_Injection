import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  User, Bell, Shield, Monitor, Globe, Moon, Eye, EyeOff,
  Smartphone, Key, LogOut, Save, ChevronRight, Check
} from 'lucide-react';

const cardStyle = {
  background: 'linear-gradient(135deg, rgba(20,30,46,0.95), rgba(12,18,32,0.98))',
  border: '1px solid #1e2d42', borderRadius: '1rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)', padding: '1.5rem',
};

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      style={{
        width: '44px', height: '24px', borderRadius: '9999px', flexShrink: 0, cursor: 'pointer', transition: 'all 0.25s',
        background: enabled ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(30,45,66,0.8)',
        border: enabled ? '1px solid rgba(99,102,241,0.5)' : '1px solid #2a3d57',
        boxShadow: enabled ? '0 0 10px rgba(99,102,241,0.35)' : 'none',
        position: 'relative',
      }}
    >
      <span style={{
        position: 'absolute', top: '3px',
        left: enabled ? '23px' : '3px',
        width: '16px', height: '16px', borderRadius: '9999px',
        background: '#fff', transition: 'left 0.25s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
      }} />
    </button>
  );
}

function SettingRow({ icon: Icon, label, description, control }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid rgba(30,45,66,0.4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
        <div style={{ width: '34px', height: '34px', borderRadius: '0.625rem', flexShrink: 0, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} style={{ color: '#818cf8' }} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#c8d3e8' }}>{label}</p>
          {description && <p style={{ fontSize: '0.75rem', color: '#4a5568', marginTop: '0.1rem' }}>{description}</p>}
        </div>
      </div>
      <div style={{ flexShrink: 0 }}>{control}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { id } = useParams();
  const { user: authUser, logout } = useAuth();
  const [targetUser, setTargetUser] = useState(null);

  const [emailNotifs,   setEmailNotifs]   = useState(true);
  const [pushNotifs,    setPushNotifs]    = useState(true);
  const [leaveAlerts,   setLeaveAlerts]   = useState(true);
  const [securityAlerts,setSecurityAlerts]= useState(true);
  const [twoFA,         setTwoFA]         = useState(false);
  const [darkMode,      setDarkMode]      = useState(true);
  const [showSalary,    setShowSalary]    = useState(true);
  const [language,      setLanguage]      = useState('en');
  const [timezone,      setTimezone]      = useState('UTC-5');

  const [currentPw,   setCurrentPw]   = useState('');
  const [newPw,       setNewPw]       = useState('');
  const [confirmPw,   setConfirmPw]   = useState('');
  const [showNewPw,   setShowNewPw]   = useState(false);
  const [savedSection,setSavedSection]= useState(null);

  const targetId = id || authUser?.id;
  const displayUser = targetUser || authUser;
  const isAdminView = authUser?.role === 'admin' && !!id;

  useEffect(() => {
    const loadData = async () => {
      if (!targetId) return;
      try {
        // Fetch User Info if it's admin viewing
        if (id) {
          const userRes = await api.get(`/employees/${id}`);
          setTargetUser(userRes.data);
        }
        
        // Fetch Settings
        const setRes = await api.get(`/settings/${targetId}`);
        const s = setRes.data;
        setEmailNotifs(s.email_notifs ?? true);
        setPushNotifs(s.push_notifs ?? true);
        setLeaveAlerts(s.leave_alerts ?? true);
        setSecurityAlerts(s.security_alerts ?? true);
        setTwoFA(s.two_fa_enabled ?? false);
        setDarkMode(s.dark_mode ?? true);
        setShowSalary(s.show_salary ?? true);
        setLanguage(s.language || 'en');
        setTimezone(s.timezone || 'UTC-5');
      } catch (err) {
        console.error(err);
      }
    };
    loadData();
  }, [targetId, id]);

  const handleSave = async (section) => {
    try {
      if (section !== 'password') {
        const payload = {
          email_notifs: emailNotifs, push_notifs: pushNotifs, leave_alerts: leaveAlerts,
          security_alerts: securityAlerts, two_fa_enabled: twoFA, dark_mode: darkMode,
          show_salary: showSalary, language, timezone
        };
        await api.put(`/settings/${targetId}`, payload);
      }
      setSavedSection(section);
      setTimeout(() => setSavedSection(null), 2500);
    } catch (err) {
      console.error('Save settings failed', err);
    }
  };

  const sections = [
    {
      key: 'notifications',
      icon: Bell, title: 'Notification Preferences',
      description: 'Choose which alerts you want to receive',
      rows: [
        { icon: Bell,      label: 'Email Notifications',   description: 'Receive updates via email',              control: <Toggle enabled={emailNotifs}    onChange={setEmailNotifs} /> },
        { icon: Smartphone,label: 'Push Notifications',    description: 'Browser & mobile push alerts',           control: <Toggle enabled={pushNotifs}    onChange={setPushNotifs} /> },
        { icon: Bell,      label: 'Leave Request Alerts',  description: 'Notify on approval/rejection',           control: <Toggle enabled={leaveAlerts}   onChange={setLeaveAlerts} /> },
        { icon: Shield,    label: 'Security Alerts',       description: 'Login attempts and account changes',     control: <Toggle enabled={securityAlerts} onChange={setSecurityAlerts} /> },
      ],
    },
    {
      key: 'security',
      icon: Shield, title: 'Security Settings',
      description: 'Manage your account security options',
      rows: [
        { icon: Smartphone,label: 'Two-Factor Authentication', description: 'Add an extra layer of security',       control: <Toggle enabled={twoFA} onChange={setTwoFA} /> },
        { icon: Monitor,   label: 'Active Sessions',           description: '2 active sessions on different devices', control: <button className="btn-secondary" style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><ChevronRight size={12} />Manage</button> },
      ],
    },
    {
      key: 'privacy',
      icon: Eye, title: 'Privacy & Display',
      description: 'Control what information is visible',
      rows: [
        { icon: DarkModeIcon, label: 'Dark Mode',         description: 'Use dark theme across the portal',    control: <Toggle enabled={darkMode}   onChange={setDarkMode} /> },
        { icon: Eye,          label: 'Show Salary Info',  description: 'Display salary on profile & dashboard', control: <Toggle enabled={showSalary} onChange={setShowSalary} /> },
        { icon: Globe,        label: 'Language',          description: 'Interface display language',          control: (
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="input-field"
            style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem', width: 'auto', minWidth: '120px' }}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        )},
        { icon: Globe, label: 'Time Zone', description: 'Your local timezone for dates',
          control: (
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="input-field"
              style={{ padding: '0.375rem 0.625rem', fontSize: '0.75rem', width: 'auto', minWidth: '120px' }}
            >
              <option value="UTC-8">UTC-8 (PST)</option>
              <option value="UTC-5">UTC-5 (EST)</option>
              <option value="UTC+0">UTC+0 (GMT)</option>
              <option value="UTC+5:45">UTC+5:45 (NPT)</option>
            </select>
        )},
      ],
    },
  ];

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }} className="animate-fade-in-up opacity-0">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>{isAdminView ? "Employee Settings" : "Settings"}</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7a99' }}>{isAdminView ? `Manage settings for ${displayUser?.name}` : "Manage your account preferences and security"}</p>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem' }}>
        {/* Left column */}
        <div style={{ flex: '0 0 auto', width: '240px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* User badge */}
          <div style={{ ...cardStyle, padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '1rem', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, color: '#fff', margin: '0 auto 0.75rem', boxShadow: '0 6px 20px rgba(99,102,241,0.4)' }}>
              {displayUser?.name?.charAt(0) || '?'}
            </div>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '0.25rem' }}>{displayUser?.name}</p>
            <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>{displayUser?.email}</p>
          </div>

          {!isAdminView && (
            <div style={{ ...cardStyle, padding: '1.25rem' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, color: '#f43f5e', marginBottom: '0.875rem' }}>Danger Zone</p>
              <button
                className="btn-danger"
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.8125rem', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                onClick={logout}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Right column - settings sections */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Change Password */}
          <div style={{ ...cardStyle }} className="animate-fade-in-up opacity-0 stagger-1">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid #1e2d42' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={14} style={{ color: '#818cf8' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>Change Password</h3>
                <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>Update your login credentials</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.875rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Current Password</label>
                <input
                  type="password" value={currentPw} placeholder="••••••••"
                  onChange={e => setCurrentPw(e.target.value)}
                  className="input-field" style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showNewPw ? 'text' : 'password'} value={newPw} placeholder="Min 8 chars"
                    onChange={e => setNewPw(e.target.value)}
                    className="input-field" style={{ padding: '0.5rem 2.25rem 0.5rem 0.75rem', fontSize: '0.875rem' }}
                  />
                  <button onClick={() => setShowNewPw(!showNewPw)} style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#4a5568' }}>
                    {showNewPw ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Confirm Password</label>
                <input
                  type="password" value={confirmPw} placeholder="Re-enter password"
                  onChange={e => setConfirmPw(e.target.value)}
                  className="input-field" style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => handleSave('password')} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
                {savedSection === 'password' ? <><Check size={14} /> Saved!</> : <><Save size={14} /> Update Password</>}
              </button>
            </div>
          </div>

          {/* Dynamic sections */}
          {sections.map((sec, si) => {
            const SectionIcon = sec.icon;
            return (
              <div key={sec.key} style={{ ...cardStyle }} className={`animate-fade-in-up opacity-0 stagger-${si + 2}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem', paddingBottom: '0.875rem', borderBottom: '1px solid #1e2d42' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SectionIcon size={14} style={{ color: '#818cf8' }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>{sec.title}</h3>
                      <p style={{ fontSize: '0.75rem', color: '#4a5568' }}>{sec.description}</p>
                    </div>
                  </div>
                  <button onClick={() => handleSave(sec.key)} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>
                    {savedSection === sec.key ? <><Check size={12} style={{ color: '#10b981' }} /> Saved</> : <><Save size={12} /> Save</>}
                  </button>
                </div>
                <div>
                  {sec.rows.map((row, ri) => (
                    <SettingRow key={ri} icon={row.icon} label={row.label} description={row.description} control={row.control} />
                  ))}
                  {/* Remove border from last row */}
                  <style>{`.settings-last-row { border-bottom: none !important; }`}</style>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

// Fix: local icon component for dark mode (Moon doesn't need import workaround)
function DarkModeIcon(props) { return <Moon {...props} />; }

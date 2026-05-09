import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  User, Mail, Phone, Building2, DollarSign, CalendarDays,
  Edit3, Save, X, Camera, Award, TrendingUp, Activity,
  Shield, Clock, MapPin
} from 'lucide-react';

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

const getAvatarGradient = (name) => {
  const g = [
    ['#6366f1', '#8b5cf6'], ['#8b5cf6', '#6366f1'], ['#3b82f6', '#6366f1'],
    ['#10b981', '#0d9488'], ['#f43f5e', '#e11d48'], ['#f59e0b', '#d97706'],
  ];
  const idx = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return g[idx % g.length];
};

const formatSalary = (s) => s ? '$' + Number(s).toLocaleString() : 'N/A';
const formatDate   = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

const cardStyle = {
  background: 'linear-gradient(135deg, rgba(20,30,46,0.95), rgba(12,18,32,0.98))',
  border: '1px solid #1e2d42',
  borderRadius: '1rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

const sectionLabel = { fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: '#4a5568', marginBottom: '0.35rem' };
const sectionValue = { fontSize: '0.875rem', fontWeight: 500, color: '#c8d3e8' };

export default function ProfilePage() {
  const { id } = useParams();
  const { user: authUser } = useAuth();
  
  const [targetUser, setTargetUser] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [editing, setEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', department: '', salary: ''
  });

  const isSelf = !id || parseInt(id) === authUser?.id;
  const displayUser = targetUser || authUser;

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await api.get(`/employees/${id}`);
        setTargetUser(res.data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    if (displayUser) {
      setFormData({
        name: displayUser.name || '',
        email: displayUser.email || '',
        phone: displayUser.phone || '',
        department: displayUser.department || '',
        salary: displayUser.salary || ''
      });
    }
  }, [displayUser]);

  const handleSave = async () => {
    try {
      const updateId = id || authUser.id;
      const res = await api.put(`/employees/${updateId}`, formData);
      setTargetUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const [c1, c2] = getAvatarGradient(displayUser?.name);

  const stats = [
    { icon: Award,      label: 'Performance Score', value: '94 / 100',    color: '#10b981' },
    { icon: TrendingUp, label: 'YTD Growth',         value: '+12%',        color: '#6366f1' },
    { icon: Activity,   label: 'Tasks Completed',    value: '143',         color: '#f59e0b' },
    { icon: Clock,      label: 'Avg. Work Hours',    value: '8.4 hrs/day', color: '#8b5cf6' },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }} className="animate-fade-in-up opacity-0">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>My Profile</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7a99' }}>View and manage your personal information</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1rem', borderRadius: '0.625rem', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            background: editing ? 'rgba(244,63,94,0.1)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
            color: editing ? '#f43f5e' : '#fff',
            border: editing ? '1px solid rgba(244,63,94,0.3)' : '1px solid rgba(99,102,241,0.4)',
            boxShadow: editing ? 'none' : '0 4px 14px rgba(99,102,241,0.3)',
          }}
        >
          {editing ? <X size={14} /> : <Edit3 size={14} />}
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }}>
        {/* Left: Avatar Card */}
        <div className="animate-fade-in-up opacity-0 stagger-1">
          {/* Avatar panel */}
          <div style={{ ...cardStyle, padding: '2rem', textAlign: 'center', marginBottom: '1.25rem' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
              <div style={{
                width: '96px', height: '96px', borderRadius: '1.5rem', margin: '0 auto',
                background: `linear-gradient(135deg, ${c1}, ${c2})`,
                boxShadow: `0 12px 32px rgba(99,102,241,0.4)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '2rem', fontWeight: 700,
              }}>
                {getInitials(displayUser?.name)}
              </div>
              {editing && (
                <button style={{
                  position: 'absolute', bottom: '-4px', right: '-4px',
                  width: '28px', height: '28px', borderRadius: '9999px',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  border: '2px solid #0c1220', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}>
                  <Camera size={12} color="#fff" />
                </button>
              )}
            </div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '0.375rem' }}>{displayUser?.name}</h2>
            <p style={{ fontSize: '0.8125rem', color: '#6b7a99', marginBottom: '0.75rem' }}>{displayUser?.department} Department</p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className={`badge ${displayUser?.role === 'admin' ? 'badge-danger' : 'badge-accent'}`}>{displayUser?.role}</span>
              <span className="badge badge-success">Active</span>
            </div>
          </div>

          {/* Quick info */}
          <div style={{ ...cardStyle, padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Quick Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {[
                { icon: Mail,        label: 'Email',    value: displayUser?.email },
                { icon: Phone,       label: 'Phone',    value: displayUser?.phone || '—' },
                { icon: MapPin,      label: 'Location', value: 'New York, USA' },
                { icon: CalendarDays,label: 'Joined',   value: formatDate(displayUser?.joined_date) },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '30px', height: '30px', borderRadius: '0.5rem', flexShrink: 0, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={13} style={{ color: '#818cf8' }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={sectionLabel}>{item.label}</p>
                      <p style={{ ...sectionValue, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="animate-fade-in-up opacity-0 stagger-2" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Performance Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} style={{ ...cardStyle, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '0.75rem', flexShrink: 0, background: `${s.color}15`, border: `1px solid ${s.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.65rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.07em', fontWeight: 600 }}>{s.label}</p>
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Personal Information */}
          <div style={{ ...cardStyle, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1e2d42' }}>
              Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { key: 'name',       label: 'Full Name',   value: displayUser?.name,       icon: User },
                { key: 'email',      label: 'Email',       value: displayUser?.email,      icon: Mail },
                { key: 'phone',      label: 'Phone',       value: displayUser?.phone || 'Not set', icon: Phone },
                { key: 'department', label: 'Department',  value: displayUser?.department,  icon: Building2 },
                { key: 'salary',     label: 'Salary',      value: formatSalary(displayUser?.salary), icon: DollarSign, rawValue: displayUser?.salary },
                { key: 'joined_date',label: 'Start Date',  value: formatDate(displayUser?.joined_date), icon: CalendarDays, readOnly: true },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i}>
                    <p style={sectionLabel}>{item.label}</p>
                    {editing && !item.readOnly ? (
                      <input
                        value={formData[item.key] || ''}
                        onChange={(e) => setFormData({ ...formData, [item.key]: e.target.value })}
                        className="input-field"
                        style={{ padding: '0.5rem 0.75rem', fontSize: '0.875rem', marginTop: '0.25rem' }}
                      />
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(8,12,20,0.5)', border: '1px solid rgba(30,45,66,0.4)', borderRadius: '0.5rem', marginTop: '0.25rem' }}>
                        <Icon size={12} style={{ color: '#4a5568', flexShrink: 0 }} />
                        <span style={{ ...sectionValue, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {editing && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #1e2d42' }}>
                <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Save size={14} /> Save Changes
                </button>
              </div>
            )}
          </div>

          {/* Security Info */}
          <div style={{ ...cardStyle, padding: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1e2d42' }}>
              Security & Access
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                { label: 'Account Role',   value: displayUser?.role === 'admin' ? 'Administrator' : 'Employee', icon: Shield, badge: displayUser?.role === 'admin' ? 'badge-danger' : 'badge-accent' },
                { label: 'Session Status', value: 'Active & Secure',   icon: Shield, badge: 'badge-success' },
                { label: '2FA Status',     value: 'Not Configured',    icon: Shield, badge: 'badge-warning' },
                { label: 'Last Login',     value: '2 minutes ago',     icon: Clock,  badge: null },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} style={{ padding: '0.875rem', background: 'rgba(8,12,20,0.5)', border: '1px solid rgba(30,45,66,0.4)', borderRadius: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                      <Icon size={12} style={{ color: '#4a5568' }} />
                      <p style={sectionLabel}>{item.label}</p>
                    </div>
                    {item.badge ? (
                      <span className={`badge ${item.badge}`}>{item.value}</span>
                    ) : (
                      <p style={sectionValue}>{item.value}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

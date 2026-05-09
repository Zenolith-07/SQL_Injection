import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { FileText, Clock, CheckCircle2, XCircle, AlertCircle, Plus, Calendar, ChevronRight, Check } from 'lucide-react';

const statusConfig = {
  pending:  { badge: 'badge-warning', icon: AlertCircle, label: 'Pending',  color: '#f59e0b' },
  approved: { badge: 'badge-success', icon: CheckCircle2,label: 'Approved', color: '#10b981' },
  rejected: { badge: 'badge-danger',  icon: XCircle,     label: 'Rejected', color: '#f43f5e' },
};

const cardStyle = {
  background: 'linear-gradient(135deg, rgba(20,30,46,0.95), rgba(12,18,32,0.98))',
  border: '1px solid #1e2d42', borderRadius: '1rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

export default function RequestsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter]     = useState('all');
  
  const [formData, setFormData] = useState({ type: 'Annual Leave', from_date: '', to_date: '', days: 1, reason: '' });

  const targetId = id || user?.id;
  const isAdminView = user?.role === 'admin' && !!id;

  const fetchRequests = async () => {
    if (!targetId) return;
    try {
      const res = await api.get(`/requests/${targetId}`);
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [targetId]);

  const handleSubmit = async () => {
    try {
      await api.post('/requests', formData);
      setShowForm(false);
      setFormData({ type: 'Annual Leave', from_date: '', to_date: '', days: 1, reason: '' });
      fetchRequests();
    } catch (err) {
      console.error('Failed to submit request', err);
    }
  };

  const updateStatus = async (reqId, status) => {
    try {
      await api.put(`/requests/${reqId}/status`, { status });
      fetchRequests();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const counts   = { pending: requests.filter(r => r.status === 'pending').length, approved: requests.filter(r => r.status === 'approved').length, rejected: requests.filter(r => r.status === 'rejected').length };

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }} className="animate-fade-in-up opacity-0">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>{isAdminView ? "Employee Requests" : "Leave & Requests"}</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7a99' }}>{isAdminView ? "Manage employee requests" : "Submit and track your HR requests"}</p>
        </div>
        {!isAdminView && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
          >
            <Plus size={15} /> New Request
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }} className="animate-fade-in-up opacity-0 stagger-1">
        {[
          { label: 'Pending',  value: counts.pending,  color: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.15)'  },
          { label: 'Approved', value: counts.approved, color: '#10b981', bgColor: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.15)'  },
          { label: 'Rejected', value: counts.rejected, color: '#f43f5e', bgColor: 'rgba(244,63,94,0.08)',   border: 'rgba(244,63,94,0.15)'   },
        ].map(s => (
          <div key={s.label} style={{ ...cardStyle, padding: '1.25rem', borderTop: `2px solid ${s.color}` }}>
            <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: '#4a5568', marginBottom: '0.375rem' }}>{s.label} Requests</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-heading)', lineHeight: 1 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* New Request Form */}
      {showForm && (
        <div style={{ ...cardStyle, padding: '1.5rem', marginBottom: '1.25rem' }} className="animate-fade-in opacity-0">
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #1e2d42' }}>
            Submit New Request
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Request Type</label>
              <select className="input-field" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ padding: '0.625rem 0.875rem', fontSize: '0.875rem' }}>
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Work From Home">Work From Home</option>
                <option value="Training Leave">Training Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>From Date</label>
              <input type="date" value={formData.from_date} onChange={e => setFormData({...formData, from_date: e.target.value})} className="input-field" style={{ padding: '0.625rem 0.875rem', fontSize: '0.875rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>To Date</label>
              <input type="date" value={formData.to_date} onChange={e => setFormData({...formData, to_date: e.target.value})} className="input-field" style={{ padding: '0.625rem 0.875rem', fontSize: '0.875rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Days / Reason</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="number" min="1" value={formData.days} onChange={e => setFormData({...formData, days: parseInt(e.target.value) || 1})} className="input-field" style={{ width: '60px', padding: '0.625rem 0.5rem', fontSize: '0.875rem' }} />
                <input type="text" placeholder="Brief reason" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className="input-field" style={{ flex: 1, padding: '0.625rem 0.875rem', fontSize: '0.875rem' }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #1e2d42' }}>
            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn-primary" onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
              <FileText size={14} /> Submit Request
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs + Table */}
      <div style={{ ...cardStyle }} className="animate-fade-in-up opacity-0 stagger-2">
        {/* Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(30,45,66,0.5)' }}>
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.375rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
                background: filter === f ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: filter === f ? '#fff' : '#6b7a99',
                border: filter === f ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (filter !== f) { e.currentTarget.style.color = '#c8d3e8'; e.currentTarget.style.background = 'rgba(25,33,51,0.8)'; }}}
              onMouseLeave={e => { if (filter !== f) { e.currentTarget.style.color = '#6b7a99'; e.currentTarget.style.background = 'transparent'; }}}
            >
              {f === 'all' ? `All (${requests.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${counts[f]})`}
            </button>
          ))}
        </div>

        {/* Request list */}
        <div style={{ padding: '0.5rem' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#4a5568' }}>
              <FileText size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.875rem' }}>No {filter} requests found</p>
            </div>
          ) : filtered.map((req) => {
            const sc = statusConfig[req.status];
            const StatusIcon = sc.icon;
            return (
              <div
                key={req.id}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '0.75rem', transition: 'background 0.15s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(20,30,46,0.7)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Left: icon */}
                <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', flexShrink: 0, background: `${sc.color}12`, border: `1px solid ${sc.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StatusIcon size={18} style={{ color: sc.color }} />
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#e2e8f0' }}>{req.type}</span>
                    <span className={`badge ${sc.badge}`}>{sc.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Calendar size={11} style={{ color: '#4a5568' }} />
                      <span style={{ fontSize: '0.75rem', color: '#6b7a99' }}>{new Date(req.from_date).toLocaleDateString()} → {new Date(req.to_date).toLocaleDateString()}</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#4a5568' }}>{req.days} day{req.days !== 1 ? 's' : ''}</span>
                    <span style={{ fontSize: '0.75rem', color: '#4a5568' }}>· {req.reason}</span>
                  </div>
                </div>
                {/* Right: time + actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={11} style={{ color: '#4a5568' }} />
                    <span style={{ fontSize: '0.7rem', color: '#4a5568' }}>{req.submitted}</span>
                  </div>
                  
                  {isAdminView && req.status === 'pending' ? (
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                       <button onClick={(e) => { e.stopPropagation(); updateStatus(req.id, 'approved'); }} className="btn-secondary" style={{ padding: '0.375rem 0.5rem', color: '#10b981' }}><Check size={14}/></button>
                       <button onClick={(e) => { e.stopPropagation(); updateStatus(req.id, 'rejected'); }} className="btn-secondary" style={{ padding: '0.375rem 0.5rem', color: '#f43f5e' }}><XCircle size={14}/></button>
                    </div>
                  ) : (
                    <ChevronRight size={14} style={{ color: '#2a3d57' }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

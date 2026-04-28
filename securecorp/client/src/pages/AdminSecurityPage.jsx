import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api/axios';
import { ShieldAlert, ShieldCheck, Activity, Search, AlertOctagon, Info, AlertTriangle } from 'lucide-react';

export default function AdminSecurityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/security/logs');
        setLogs(res.data);
      } catch (err) {
        console.error('Failed to fetch security logs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = filter === 'all' ? logs : logs.filter(l => l.severity === filter);

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'critical': return { color: '#f43f5e', bg: 'rgba(244,63,94,0.1)', icon: AlertOctagon };
      case 'warning':  return { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: AlertTriangle };
      default:         return { color: '#38bdf8', bg: 'rgba(56,189,248,0.1)', icon: Info };
    }
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }} className="animate-fade-in-up opacity-0">
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>Security & Audit Logs</h1>
          <p style={{ fontSize: '0.875rem', color: '#6b7a99' }}>Monitor system integrity and access events</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.75rem' }}>
          <ShieldCheck size={16} style={{ color: '#10b981' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#10b981' }}>System Secured</span>
        </div>
      </div>

      <div className="card animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s' }}>
        {/* Toolbar */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e2d42', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['all', 'critical', 'warning', 'info'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '0.375rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', transition: 'all 0.2s',
                  background: filter === f ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                  color: filter === f ? '#fff' : '#6b7a99',
                  border: filter === f ? '1px solid transparent' : '1px solid #1e2d42',
                  boxShadow: filter === f ? '0 2px 8px rgba(99,102,241,0.4)' : 'none'
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#4a5568' }} />
            <input type="text" placeholder="Search event ID or IP..." className="input-field" style={{ paddingLeft: '2rem', paddingRight: '1rem', py: '0.5rem', fontSize: '0.8125rem', width: '250px' }} />
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto" style={{ padding: '1rem 1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6b7a99' }}>Scanning audit trails...</div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6b7a99', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={28} style={{ color: '#10b981', opacity: 0.5 }} />
              <p>No high-severity alerts detected.</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Severity</th>
                  <th>Event Type</th>
                  <th>Description</th>
                  <th>Source IP</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => {
                  const s = getSeverityStyles(log.severity);
                  const Icon = s.icon;
                  return (
                    <tr key={log.id}>
                      <td style={{ color: '#6b7a99', fontSize: '0.8125rem' }}>
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.25rem 0.625rem', borderRadius: '0.375rem', background: s.bg, border: `1px solid ${s.color}33` }}>
                          <Icon size={12} style={{ color: s.color }} />
                          <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: s.color }}>
                            {log.severity}
                          </span>
                        </div>
                      </td>
                      <td style={{ color: '#e2e8f0', fontSize: '0.8125rem', fontWeight: 600 }}>
                        {log.event_type}
                      </td>
                      <td style={{ color: '#8896b3', fontSize: '0.8125rem' }}>
                        {log.description}
                      </td>
                      <td style={{ color: '#6b7a99', fontSize: '0.8125rem', fontFamily: 'monospace' }}>
                        {log.ip_address || '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

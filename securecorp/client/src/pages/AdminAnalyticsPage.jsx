import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import api from '../api/axios';
import { BarChart3, Users, DollarSign, Briefcase, Activity } from 'lucide-react';

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '1.5rem' }} className="animate-fade-in-up opacity-0">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>Enterprise Analytics</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7a99' }}>Real-time metadata and operational oversight</p>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7a99' }}>Analyzing metadata...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
          
          {/* Top KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
            <div className="card" style={{ padding: '1.25rem', borderTop: '2px solid #8b5cf6' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Headcount</p>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f0f4ff', marginTop: '0.25rem' }}>{stats?.totalUsers}</h3>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '0.75rem', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={18} style={{ color: '#a78bfa' }} />
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderTop: '2px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Annual Payroll</p>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f0f4ff', marginTop: '0.25rem' }}>{formatCurrency(stats?.totalSalary)}</h3>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '0.75rem', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={18} style={{ color: '#34d399' }} />
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', borderTop: '2px solid #38bdf8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Departments</p>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f0f4ff', marginTop: '0.25rem' }}>{stats?.departments?.length || 0}</h3>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '0.75rem', background: 'rgba(56,189,248,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={18} style={{ color: '#7dd3fc' }} />
                </div>
              </div>
            </div>
            
            <div className="card" style={{ padding: '1.25rem', borderTop: '2px solid #f59e0b' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8896b3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Leave Requests</p>
                  <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f0f4ff', marginTop: '0.25rem' }}>
                    {stats?.requests?.reduce((acc, r) => acc + parseInt(r.count), 0) || 0}
                  </h3>
                </div>
                <div style={{ width: '36px', height: '36px', borderRadius: '0.75rem', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={18} style={{ color: '#fbbf24' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem', alignItems: 'start' }}>
            {/* Department Distribution Chart */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={16} /> Department Payroll Distribution
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats?.departments?.map((dept) => {
                  const maxSalary = Math.max(...stats.departments.map(d => parseInt(d.total_salary)));
                  const pct = Math.round((parseInt(dept.total_salary) / maxSalary) * 100);
                  return (
                    <div key={dept.department}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e2e8f0' }}>{dept.department}</span>
                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8125rem' }}>
                          <span style={{ color: '#6b7a99' }}>{dept.headcount} employees</span>
                          <span style={{ color: '#818cf8', fontWeight: 600 }}>{formatCurrency(dept.total_salary)}</span>
                        </div>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: 'rgba(30,45,66,0.6)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: '4px', transition: 'width 1s ease-out' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Request Status Breakdown */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f4ff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={16} /> Request Volumes
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {stats?.requests?.map((req) => {
                  const colors = { pending: '#f59e0b', approved: '#10b981', rejected: '#f43f5e' };
                  const color = colors[req.status] || '#6366f1';
                  return (
                    <div key={req.status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(15,22,35,0.4)', borderRadius: '0.5rem', border: '1px solid #1e2d42' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#e2e8f0', textTransform: 'capitalize' }}>{req.status}</span>
                      </div>
                      <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f0f4ff' }}>{req.count}</span>
                    </div>
                  );
                })}
                {(!stats?.requests || stats.requests.length === 0) && (
                  <p style={{ fontSize: '0.8125rem', color: '#6b7a99', textAlign: 'center' }}>No request data available.</p>
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
}

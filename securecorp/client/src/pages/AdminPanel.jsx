import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import EmployeeTable from '../components/EmployeeTable';
import { useState, useEffect } from 'react';
import {
  Users, ShieldCheck, Building2, UserPlus,
  TrendingUp, RefreshCw, Loader2, ListFilter, Layers
} from 'lucide-react';
import api from '../api/axios';

export default function AdminPanel() {
  const [employees, setEmployees]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEmployees = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const totalEmployees = employees.length;
  const totalAdmins    = employees.filter(e => e.role === 'admin').length;
  const totalUsers     = totalEmployees - totalAdmins;
  const departments    = [...new Set(employees.map(e => e.department).filter(Boolean))];

  return (
    <DashboardLayout>
      {/* ── Header ── */}
      <div
        style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}
        className="animate-fade-in-up opacity-0"
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>
              Employee Management
            </h1>
            <span className="badge badge-danger">Admin Only</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6b7a99' }}>
            Manage, promote, and monitor all employee accounts
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={() => fetchEmployees(true)}
            disabled={refreshing}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', padding: '0.5rem 0.875rem' }}
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin-slow' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', padding: '0.5rem 0.875rem' }}>
            <UserPlus size={14} />
            Add Employee
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}
        className="animate-fade-in-up opacity-0 stagger-1"
      >
        <StatCard icon={Users}      label="Total Employees" value={loading ? '—' : totalEmployees} subValue="Across all depts" color="accent"  trend={5} />
        <StatCard icon={ShieldCheck} label="Administrators" value={loading ? '—' : totalAdmins}    subValue="Full access"     color="danger" />
        <StatCard icon={Building2}  label="Departments"     value={loading ? '—' : departments.length} subValue="Active divisions" color="success" trend={2} />
        <StatCard icon={Layers}     label="Regular Users"   value={loading ? '—' : totalUsers}    subValue="Standard access" color="violet" />
      </div>

      {/* ── Insights Row ── */}
      {!loading && employees.length > 0 && (
        <div
          style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}
          className="animate-fade-in-up opacity-0 stagger-2"
        >
          {/* Dept Breakdown */}
          <div style={{ background: 'linear-gradient(135deg, rgba(20,30,46,0.9), rgba(12,18,32,0.95))', border: '1px solid #1e2d42', borderRadius: '1rem', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ListFilter size={13} style={{ color: '#818cf8' }} />
              </div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>Department Overview</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {departments.slice(0, 5).map(dept => {
                const count = employees.filter(e => e.department === dept).length;
                const pct   = Math.round((count / totalEmployees) * 100);
                return (
                  <div key={dept}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#8896b3' }}>{dept}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c8d3e8' }}>{count} <span style={{ color: '#4a5568', fontWeight: 400 }}>({pct}%)</span></span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '9999px', background: 'rgba(25,33,51,0.8)', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: '9999px', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', boxShadow: '0 0 8px rgba(99,102,241,0.4)', transition: 'width 0.7s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role Split */}
          <div style={{ background: 'linear-gradient(135deg, rgba(20,30,46,0.9), rgba(12,18,32,0.95))', border: '1px solid #1e2d42', borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '0.5rem', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={13} style={{ color: '#818cf8' }} />
              </div>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>Role Split</h3>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
              {[
                { icon: Users,       label: 'Employees', count: totalUsers,  pct: totalEmployees ? (totalUsers/totalEmployees)*100 : 0,  bar: 'linear-gradient(90deg, #6366f1, #8b5cf6)', color: '#818cf8', iconBg: 'rgba(99,102,241,0.1)', iconBorder: 'rgba(99,102,241,0.15)' },
                { icon: ShieldCheck, label: 'Admins',    count: totalAdmins, pct: totalEmployees ? (totalAdmins/totalEmployees)*100 : 0, bar: 'linear-gradient(90deg, #f43f5e, #e11d48)', color: '#f43f5e', iconBg: 'rgba(244,63,94,0.08)',  iconBorder: 'rgba(244,63,94,0.15)' },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '0.625rem', flexShrink: 0, background: item.iconBg, border: `1px solid ${item.iconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={15} style={{ color: item.color }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                        <span style={{ color: '#8896b3' }}>{item.label}</span>
                        <span style={{ fontWeight: 700, color: item.color }}>{item.count}</span>
                      </div>
                      <div style={{ height: '6px', background: '#192133', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div style={{ width: `${item.pct}%`, height: '100%', background: item.bar, borderRadius: '9999px', transition: 'width 0.7s ease' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Employee Table ── */}
      <div
        style={{ background: 'linear-gradient(135deg, rgba(15,22,35,0.95), rgba(10,16,24,0.98))', border: '1px solid #1e2d42', borderRadius: '1rem', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
        className="animate-fade-in-up opacity-0 stagger-3"
      >
        {/* Table header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(30,45,66,0.5)' }}>
          <div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>Employee Directory</h3>
            {!loading && <p style={{ fontSize: '0.75rem', color: '#4a5568', marginTop: '0.15rem' }}>{totalEmployees} employees registered</p>}
          </div>
          <span className="badge badge-danger">Confidential</span>
        </div>
        <div style={{ padding: '1.25rem 1.5rem' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 0', gap: '1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '1rem', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={24} style={{ color: '#6366f1' }} className="animate-spin-slow" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#8896b3' }}>Loading employee records</p>
                <p style={{ fontSize: '0.75rem', color: '#4a5568', marginTop: '0.25rem' }}>Fetching directory data...</p>
              </div>
            </div>
          ) : (
            <EmployeeTable employees={employees} onRefresh={() => fetchEmployees(true)} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

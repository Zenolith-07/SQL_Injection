import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import EmployeeTable from '../components/EmployeeTable';
import api from '../api/axios';
import { Users } from 'lucide-react';

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <DashboardLayout>
      <div style={{ marginBottom: '1.5rem' }} className="animate-fade-in-up opacity-0">
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)', marginBottom: '0.25rem' }}>Employee Management</h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7a99' }}>Manage roles, view profiles, and organize your workforce</p>
      </div>

      <div className="card animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e2d42', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '0.75rem', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={16} style={{ color: '#818cf8' }} />
          </div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f4ff' }}>Directory</h2>
        </div>
        <div style={{ padding: '1.5rem' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: '#6b7a99' }}>Scanning directory...</div>
          ) : (
            <EmployeeTable employees={employees} onRefresh={fetchEmployees} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import EmployeeTable from '../components/EmployeeTable';
import { Users, ShieldCheck, Building2, Download } from 'lucide-react';
import api from '../api/axios';

export default function AdminPanel() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const totalEmployees = employees.length;
  const totalAdmins = employees.filter(e => e.role === 'admin').length;
  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];

  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Navbar />
        <main className="p-8">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 animate-fade-in-up opacity-0">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] text-text">
                Employee Records
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-danger/15 text-danger border border-danger/20">
                Confidential
              </span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-muted bg-surface border border-border hover:border-border-light hover:text-text transition-all cursor-pointer">
              <Download size={16} />
              Export
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 animate-fade-in-up opacity-0 stagger-1">
            <StatCard icon={Users} label="Total Employees" value={totalEmployees} color="accent" />
            <StatCard icon={ShieldCheck} label="Administrators" value={totalAdmins} color="danger" />
            <StatCard icon={Building2} label="Active Departments" value={departments.length} color="success" />
          </div>

          {/* Employee Table */}
          <div className="animate-fade-in-up opacity-0 stagger-2">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin-slow" />
                  <p className="text-muted text-sm">Loading employee records...</p>
                </div>
              </div>
            ) : (
              <EmployeeTable employees={employees} onRefresh={fetchEmployees} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

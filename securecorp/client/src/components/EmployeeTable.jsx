import { useState } from 'react';
import {
  Search, ChevronUp, ChevronDown, Trash2,
  ChevronLeft, ChevronRight, ShieldCheck, ShieldMinus,
  UserCog, Filter, Download, MoreHorizontal
} from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const getAvatarGradient = (name) => {
  const g = [
    'from-indigo-500 to-purple-600',
    'from-violet-500 to-indigo-600',
    'from-blue-500 to-indigo-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-600',
  ];
  const idx = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return g[idx % g.length];
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
};

export default function EmployeeTable({ employees, onRefresh }) {
  const navigate = useNavigate();
  const [search, setSearch]             = useState('');
  const [currentPage, setCurrentPage]   = useState(1);
  const [sortField, setSortField]       = useState('id');
  const [sortDir, setSortDir]           = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const rowsPerPage = 8;

  const filtered = employees.filter(emp => {
    const q = search.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q) ||
      emp.role?.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    let aV = a[sortField], bV = b[sortField];
    if (typeof aV === 'string') aV = aV.toLowerCase();
    if (typeof bV === 'string') bV = bV.toLowerCase();
    if (aV < bV) return sortDir === 'asc' ? -1 : 1;
    if (aV > bV) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated  = sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSort = (field) => {
    setSortField(field);
    setSortDir(sortField === field && sortDir === 'asc' ? 'desc' : 'asc');
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={13} style={{ color: '#2a3d57' }} />;
    return sortDir === 'asc'
      ? <ChevronUp size={13} style={{ color: '#6366f1' }} />
      : <ChevronDown size={13} style={{ color: '#6366f1' }} />;
  };

  const handleRoleChange = async (id, newRole) => {
    setActionLoading(id);
    try {
      await api.patch(`/employees/${id}/role`, { role: newRole });
      onRefresh();
    } catch (err) {
      console.error('Role update failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(deleteTarget.id);
    try {
      await api.delete(`/employees/${deleteTarget.id}`);
      setDeleteTarget(null);
      onRefresh();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const formatSalary = (s) => s ? '$' + Number(s).toLocaleString() : 'N/A';
  const formatDate   = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

  const columns = [
    { key: 'id',          label: '#' },
    { key: 'name',        label: 'Employee' },
    { key: 'email',       label: 'Email' },
    { key: 'department',  label: 'Department' },
    { key: 'role',        label: 'Role' },
    { key: 'salary',      label: 'Salary' },
    { key: 'joined_date', label: 'Joined' },
  ];

  return (
    <div>
      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        {/* Search */}
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: '#4a5568' }}
          />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="input-field pl-10 pr-4 py-2.5 text-sm w-72"
          />
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button className="btn-secondary text-xs gap-1.5 py-2">
            <Filter size={13} />
            Filter
          </button>
          <button className="btn-secondary text-xs gap-1.5 py-2">
            <Download size={13} />
            Export
          </button>
        </div>
      </div>

      {/* ── Table Wrapper ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid #1e2d42', background: 'rgba(12,18,32,0.5)' }}
      >
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key} onClick={() => handleSort(col.key)}>
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon field={col.key} />
                    </div>
                  </th>
                ))}
                <th className="text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)' }}
                      >
                        <Search size={20} style={{ color: '#4a5568' }} />
                      </div>
                      <p className="text-sm" style={{ color: '#4a5568' }}>No employees match your search</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map(emp => (
                  <tr key={emp.id}>
                    {/* ID */}
                    <td>
                      <span className="text-xs font-mono" style={{ color: '#4a5568' }}>#{emp.id}</span>
                    </td>

                    {/* Employee */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl bg-gradient-to-br ${getAvatarGradient(emp.name)} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}
                        >
                          {getInitials(emp.name)}
                        </div>
                        <span className="font-semibold text-sm" style={{ color: '#e2e8f0' }}>{emp.name}</span>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <span className="text-sm" style={{ color: '#8896b3' }}>{emp.email}</span>
                    </td>

                    {/* Department */}
                    <td>
                      <span
                        className="px-2.5 py-1 rounded-lg text-xs font-medium"
                        style={{ background: 'rgba(99,102,241,0.07)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.12)' }}
                      >
                        {emp.department || '—'}
                      </span>
                    </td>

                    {/* Role */}
                    <td>
                      <span className={`badge ${emp.role === 'admin' ? 'badge-danger' : 'badge-accent'}`}>
                        {emp.role === 'admin' ? (
                          <ShieldCheck size={9} />
                        ) : null}
                        {emp.role}
                      </span>
                    </td>

                    {/* Salary */}
                    <td>
                      <span className="text-sm font-mono font-medium" style={{ color: '#10b981' }}>
                        {formatSalary(emp.salary)}
                      </span>
                    </td>

                    {/* Joined */}
                    <td>
                      <span className="text-xs" style={{ color: '#4a5568' }}>{formatDate(emp.joined_date)}</span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex items-center justify-end gap-1.5 pr-2">
                        {emp.role === 'user' ? (
                          <button
                            onClick={() => handleRoleChange(emp.id, 'admin')}
                            disabled={actionLoading === emp.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
                            style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
                            title="Promote to Admin"
                          >
                            <ShieldCheck size={11} />
                            Promote
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(emp.id, 'user')}
                            disabled={actionLoading === emp.id}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50"
                            style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}
                            title="Demote to User"
                          >
                            <ShieldMinus size={11} />
                            Demote
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/admin/users/${emp.id}/profile`)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer"
                          style={{ background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.1)'}
                          title="Manage User"
                        >
                          <UserCog size={11} />
                          Manage
                        </button>
                        <button
                          onClick={() => setDeleteTarget(emp)}
                          disabled={actionLoading === emp.id}
                          className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
                          style={{ color: '#6b7a99' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.color = '#f43f5e'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7a99'; }}
                          title="Delete Employee"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ borderTop: '1px solid rgba(30,45,66,0.6)' }}
        >
          <p className="text-xs" style={{ color: '#4a5568' }}>
            {sorted.length === 0
              ? 'No results'
              : `Showing ${(currentPage - 1) * rowsPerPage + 1}–${Math.min(currentPage * rowsPerPage, sorted.length)} of ${sorted.length}`
            }
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
                style={{ color: '#6b7a99' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#192133'; e.currentTarget.style.color = '#c8d3e8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7a99'; }}
              >
                <ChevronLeft size={15} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="w-7 h-7 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                  style={page === currentPage
                    ? { background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }
                    : { color: '#6b7a99' }
                  }
                  onMouseEnter={e => { if (page !== currentPage) { e.currentTarget.style.background = '#192133'; e.currentTarget.style.color = '#c8d3e8'; }}}
                  onMouseLeave={e => { if (page !== currentPage) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7a99'; }}}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all cursor-pointer disabled:opacity-30"
                style={{ color: '#6b7a99' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#192133'; e.currentTarget.style.color = '#c8d3e8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7a99'; }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Confirm Modal ── */}
      <Dialog.Root open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content
            className="w-full max-w-md"
            style={{
              background: 'linear-gradient(135deg, #141e2e, #0f1623)',
              border: '1px solid #1e2d42',
              borderRadius: '1.25rem',
              padding: '1.75rem',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7)',
            }}
          >
            {/* Warning Icon */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}
            >
              <Trash2 size={22} style={{ color: '#f43f5e' }} />
            </div>

            <Dialog.Title
              className="text-xl font-bold mb-2"
              style={{ color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}
            >
              Delete Employee
            </Dialog.Title>
            <Dialog.Description className="text-sm mb-6" style={{ color: '#6b7a99' }}>
              Are you sure you want to permanently remove{' '}
              <span className="font-semibold" style={{ color: '#e2e8f0' }}>{deleteTarget?.name}</span>
              {' '}from the system? This action is{' '}
              <span style={{ color: '#f43f5e' }}>irreversible</span>.
            </Dialog.Description>

            <div className="flex items-center gap-3 justify-end">
              <Dialog.Close asChild>
                <button className="btn-secondary">Cancel</button>
              </Dialog.Close>
              <button
                onClick={handleDelete}
                disabled={actionLoading === deleteTarget?.id}
                className="btn-danger"
              >
                {actionLoading === deleteTarget?.id ? 'Removing...' : 'Delete Employee'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

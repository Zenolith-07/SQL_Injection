import { useState } from 'react';
import { Search, ChevronUp, ChevronDown, ArrowUpCircle, ArrowDownCircle, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import api from '../api/axios';

export default function EmployeeTable({ employees, onRefresh }) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('id');
  const [sortDir, setSortDir] = useState('asc');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const rowsPerPage = 10;

  // Filter employees by search
  const filtered = employees.filter((emp) => {
    const q = search.toLowerCase();
    return (
      emp.name.toLowerCase().includes(q) ||
      emp.email.toLowerCase().includes(q) ||
      emp.department?.toLowerCase().includes(q) ||
      emp.role?.toLowerCase().includes(q)
    );
  });

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = sorted.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={14} className="text-muted/30" />;
    return sortDir === 'asc'
      ? <ChevronUp size={14} className="text-accent" />
      : <ChevronDown size={14} className="text-accent" />;
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

  const formatSalary = (salary) => {
    if (!salary) return 'N/A';
    return '$' + salary.toLocaleString();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-5 relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search employees by name, email, department..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full max-w-md pl-11 pr-4 py-2.5 bg-bg border border-border rounded-lg text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg/50 border-b border-border">
              {[
                { key: 'id', label: '#' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'department', label: 'Department' },
                { key: 'role', label: 'Role' },
                { key: 'salary', label: 'Salary' },
                { key: 'joined_date', label: 'Joined' },
              ].map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider cursor-pointer hover:text-text transition-colors select-none"
                  onClick={() => handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <SortIcon field={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted">
                  No employees found matching your search.
                </td>
              </tr>
            ) : (
              paginated.map((emp, i) => (
                <tr
                  key={emp.id}
                  className={`border-b border-border/50 hover:bg-surface-hover transition-colors ${
                    i % 2 === 1 ? 'bg-bg/30' : ''
                  }`}
                >
                  <td className="px-4 py-3 text-muted">{emp.id}</td>
                  <td className="px-4 py-3 font-medium text-text">{emp.name}</td>
                  <td className="px-4 py-3 text-muted-light">{emp.email}</td>
                  <td className="px-4 py-3 text-muted-light">{emp.department}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                      emp.role === 'admin'
                        ? 'bg-danger/15 text-danger'
                        : 'bg-accent/15 text-accent'
                    }`}>
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-light font-mono text-xs">{formatSalary(emp.salary)}</td>
                  <td className="px-4 py-3 text-muted text-xs">{formatDate(emp.joined_date)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {emp.role === 'user' ? (
                        <button
                          onClick={() => handleRoleChange(emp.id, 'admin')}
                          disabled={actionLoading === emp.id}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors disabled:opacity-50 cursor-pointer"
                          title="Promote to Admin"
                        >
                          <ArrowUpCircle size={13} />
                          Promote
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(emp.id, 'user')}
                          disabled={actionLoading === emp.id}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-warning/10 text-warning hover:bg-warning/20 transition-colors disabled:opacity-50 cursor-pointer"
                          title="Demote to User"
                        >
                          <ArrowDownCircle size={13} />
                          Demote
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(emp)}
                        disabled={actionLoading === emp.id}
                        className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-danger/10 text-danger hover:bg-danger/20 transition-colors disabled:opacity-50 cursor-pointer"
                        title="Delete Employee"
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-1">
          <p className="text-xs text-muted">
            Showing {(currentPage - 1) * rowsPerPage + 1}–{Math.min(currentPage * rowsPerPage, sorted.length)} of {sorted.length} employees
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md text-muted hover:text-text hover:bg-surface-hover disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  page === currentPage
                    ? 'bg-accent text-white'
                    : 'text-muted hover:text-text hover:bg-surface-hover'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md text-muted hover:text-text hover:bg-surface-hover disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog.Root open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content className="bg-surface border border-border rounded-xl p-6 w-full max-w-md shadow-2xl">
            <Dialog.Title className="text-lg font-bold font-[family-name:var(--font-heading)] text-text mb-2">
              Delete Employee
            </Dialog.Title>
            <Dialog.Description className="text-sm text-muted mb-6">
              Are you sure you want to permanently delete{' '}
              <span className="text-text font-semibold">{deleteTarget?.name}</span>?
              This action cannot be undone.
            </Dialog.Description>
            <div className="flex items-center justify-end gap-3">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded-lg text-sm text-muted hover:text-text hover:bg-surface-hover transition-colors cursor-pointer">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                onClick={handleDelete}
                disabled={actionLoading === deleteTarget?.id}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-danger hover:bg-danger-dark text-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                {actionLoading === deleteTarget?.id ? 'Deleting...' : 'Delete Employee'}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

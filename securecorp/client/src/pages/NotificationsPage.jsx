import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Bell, CheckCheck, Trash2, ShieldCheck, Users, Calendar as CalendarIcon, DollarSign, Info } from 'lucide-react';

const iconMap = {
  security: ShieldCheck,
  hr: CalendarIcon,
  team: Users,
  info: Info,
};

const cardStyle = {
  background: 'linear-gradient(135deg, rgba(20,30,46,0.95), rgba(12,18,32,0.98))',
  border: '1px solid #1e2d42', borderRadius: '1rem',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
};

export default function NotificationsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter]               = useState('all');

  const targetId = id || user?.id;

  const fetchNotifs = async () => {
    if (!targetId) return;
    try {
      const res = await api.get(`/notifications/${targetId}`);
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, [targetId]);

  const unreadCount  = notifications.filter(n => !n.is_read).length;
  const filtered     = filter === 'unread' ? notifications.filter(n => !n.is_read) : filter === 'read' ? notifications.filter(n => n.is_read) : notifications;

  const markAllRead  = async () => {
    await api.put(`/notifications/user/${targetId}/read-all`);
    fetchNotifs();
  };
  const markRead     = async (notifId) => {
    await api.put(`/notifications/${notifId}/read`);
    fetchNotifs();
  };
  const deleteNotif  = async (notifId) => {
    await api.delete(`/notifications/${notifId}`);
    fetchNotifs();
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }} className="animate-fade-in-up opacity-0">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>Notifications</h1>
            {unreadCount > 0 && (
              <span style={{ padding: '0.2rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', boxShadow: '0 2px 8px rgba(99,102,241,0.4)' }}>
                {unreadCount} new
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6b7a99' }}>Stay updated with your latest alerts and messages</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div style={{ ...cardStyle }} className="animate-fade-in-up opacity-0 stagger-1">
        {/* Filter tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '1rem 1.25rem', borderBottom: '1px solid rgba(30,45,66,0.5)' }}>
          {[
            { key: 'all',    label: `All (${notifications.length})` },
            { key: 'unread', label: `Unread (${unreadCount})` },
            { key: 'read',   label: `Read (${notifications.length - unreadCount})` },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '0.375rem 0.875rem', borderRadius: '0.5rem', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                background: filter === f.key ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'transparent',
                color: filter === f.key ? '#fff' : '#6b7a99',
                border: filter === f.key ? '1px solid rgba(99,102,241,0.4)' : '1px solid transparent',
              }}
              onMouseEnter={e => { if (filter !== f.key) { e.currentTarget.style.color = '#c8d3e8'; e.currentTarget.style.background = 'rgba(25,33,51,0.8)'; }}}
              onMouseLeave={e => { if (filter !== f.key) { e.currentTarget.style.color = '#6b7a99'; e.currentTarget.style.background = 'transparent'; }}}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div style={{ padding: '0.5rem' }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#4a5568' }}>
              <Bell size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#4a5568' }}>No notifications here</p>
            </div>
          ) : filtered.map((n) => {
            const Icon = iconMap[n.type] || Info;
            return (
              <div
                key={n.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', borderRadius: '0.75rem', transition: 'background 0.15s', cursor: 'pointer', position: 'relative',
                  background: n.is_read ? 'transparent' : 'rgba(99,102,241,0.04)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(20,30,46,0.7)'}
                onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'transparent' : 'rgba(99,102,241,0.04)'}
              >
                {/* Unread dot */}
                {!n.is_read && (
                  <span style={{ position: 'absolute', top: '1.25rem', left: '0.25rem', width: '6px', height: '6px', borderRadius: '9999px', background: '#6366f1', boxShadow: '0 0 6px rgba(99,102,241,0.7)' }} />
                )}

                {/* Icon */}
                <div style={{ width: '40px', height: '40px', borderRadius: '0.75rem', flexShrink: 0, background: `${n.color}12`, border: `1px solid ${n.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} style={{ color: n.color }} />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: n.is_read ? 500 : 700, color: n.is_read ? '#c8d3e8' : '#f0f4ff' }}>{n.title}</p>
                    <span style={{ fontSize: '0.7rem', color: '#4a5568', flexShrink: 0, marginLeft: '0.75rem' }}>{n.time_label}</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#6b7a99', lineHeight: 1.5 }}>{n.body}</p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', flexShrink: 0 }}>
                  {!n.is_read && (
                    <button
                      onClick={e => { e.stopPropagation(); markRead(n.id); }}
                      title="Mark as read"
                      style={{ width: '28px', height: '28px', borderRadius: '0.5rem', background: 'transparent', border: 'none', color: '#4a5568', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.color = '#818cf8'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4a5568'; }}
                    >
                      <CheckCheck size={13} />
                    </button>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}
                    title="Delete"
                    style={{ width: '28px', height: '28px', borderRadius: '0.5rem', background: 'transparent', border: 'none', color: '#4a5568', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.1)'; e.currentTarget.style.color = '#f43f5e'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4a5568'; }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

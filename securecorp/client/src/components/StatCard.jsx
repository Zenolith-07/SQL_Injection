const colorConfig = {
  accent: {
    icon: { background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8' },
    glow: 'rgba(99,102,241,0.15)',
    bar: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  success: {
    icon: { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' },
    glow: 'rgba(16,185,129,0.12)',
    bar: 'linear-gradient(135deg, #10b981, #059669)',
  },
  warning: {
    icon: { background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' },
    glow: 'rgba(245,158,11,0.12)',
    bar: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  danger: {
    icon: { background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: '#f43f5e' },
    glow: 'rgba(244,63,94,0.12)',
    bar: 'linear-gradient(135deg, #f43f5e, #e11d48)',
  },
  violet: {
    icon: { background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', color: '#a78bfa' },
    glow: 'rgba(139,92,246,0.12)',
    bar: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  },
};

export default function StatCard({ icon: Icon, label, value, subValue, color = 'accent', trend }) {
  const cfg = colorConfig[color] || colorConfig.accent;

  return (
    <div
      className="stat-card card p-5 relative overflow-hidden"
      style={{ '--hover-glow': cfg.glow }}
    >
      {/* Subtle top bar accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: cfg.bar, opacity: 0.7 }}
      />

      {/* Background glow blob */}
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-30"
        style={{ background: cfg.bar }}
      />

      <div className="relative flex items-start justify-between">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={cfg.icon}
        >
          <Icon size={20} />
        </div>

        {/* Trend badge */}
        {trend && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: trend > 0 ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)',
              color: trend > 0 ? '#10b981' : '#f43f5e',
            }}
          >
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>

      <div className="relative mt-4">
        <p className="text-2xl font-bold" style={{ color: '#f0f4ff', fontFamily: 'var(--font-heading)' }}>
          {value}
        </p>
        <p className="text-xs font-medium mt-1 uppercase tracking-wider" style={{ color: '#6b7a99' }}>
          {label}
        </p>
        {subValue && (
          <p className="text-xs mt-1" style={{ color: '#4a5568' }}>{subValue}</p>
        )}
      </div>
    </div>
  );
}

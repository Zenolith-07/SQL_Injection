export default function StatCard({ icon: Icon, label, value, color = 'accent' }) {
  const colorMap = {
    accent: 'text-accent bg-accent/10 border-accent/20',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    danger: 'text-danger bg-danger/10 border-danger/20',
  };

  const iconColor = colorMap[color] || colorMap.accent;

  return (
    <div className="bg-surface border border-border rounded-xl p-5 hover:border-border-light transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center border ${iconColor} transition-all duration-300`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs text-muted uppercase tracking-wider mb-0.5">{label}</p>
          <p className="text-lg font-semibold text-text font-[family-name:var(--font-heading)]">{value}</p>
        </div>
      </div>
    </div>
  );
}

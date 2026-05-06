const StatsCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
  <div
    className="p-5 rounded-xl border transition-all duration-200 hover:border-opacity-60"
    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
  >
    <div className="flex items-start justify-between mb-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}20` }}
      >
        <Icon size={20} style={{ color }} />
      </div>
      {trend != null && (
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            background: trend >= 0 ? '#22c55e15' : '#ef444415',
            color: trend >= 0 ? '#22c55e' : '#ef4444',
          }}
        >
          {trend >= 0 ? '+' : ''}
          {trend}%
        </span>
      )}
    </div>
    <p className="text-3xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
      {value}
    </p>
    <p className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
      {title}
    </p>
    {subtitle && (
      <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
        {subtitle}
      </p>
    )}
  </div>
);

export default StatsCard;

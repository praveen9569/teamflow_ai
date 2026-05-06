import { useState, useEffect } from 'react';
import { RiSparklingLine, RiRefreshLine, RiLightbulbLine } from 'react-icons/ri';
import { aiService } from '../services';

const AIAssistantPanel = ({ taskTitle, dueDate, projectDeadline, onUseDescription }) => {
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    if (!taskTitle?.trim()) return;
    setLoading(true);
    try {
      const [descRes, priRes, tipsRes] = await Promise.all([
        aiService.getDescription(taskTitle),
        aiService.suggestPriority(dueDate, projectDeadline),
        aiService.getTips(),
      ]);
      setDescription(descRes.data.data.description);
      setPriority(priRes.data.data.priority);
      setTips(tipsRes.data.data.tips);
    } catch {
      // silently fail — AI is a nice-to-have
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (taskTitle?.length > 3) {
      const t = setTimeout(fetchAll, 600);
      return () => clearTimeout(t);
    }
  }, [taskTitle]);

  if (!taskTitle?.trim()) return null;

  return (
    <div
      className="rounded-xl border p-4 space-y-4"
      style={{ background: '#6366f108', borderColor: '#6366f130' }}
    >
      <div className="flex items-center gap-2">
        <RiSparklingLine size={16} style={{ color: '#818cf8' }} />
        <span className="text-sm font-semibold" style={{ color: '#818cf8' }}>
          AI Assistant
        </span>
        {loading && (
          <div className="ml-auto w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        )}
      </div>

      {description && (
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
            Suggested Description
          </p>
          <p className="text-sm leading-relaxed mb-2" style={{ color: 'var(--color-text)' }}>
            {description}
          </p>
          {onUseDescription && (
            <button
              onClick={() => onUseDescription(description)}
              className="text-xs px-3 py-1 rounded-lg font-medium transition-colors"
              style={{ background: '#6366f120', color: '#818cf8' }}
            >
              Use this description
            </button>
          )}
        </div>
      )}

      {priority && (
        <div>
          <p className="text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
            Suggested Priority
          </p>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-semibold capitalize"
            style={{
              background:
                priority === 'urgent' ? '#ec489920'
                : priority === 'high' ? '#ef444420'
                : priority === 'medium' ? '#f59e0b20'
                : '#22c55e20',
              color:
                priority === 'urgent' ? '#ec4899'
                : priority === 'high' ? '#ef4444'
                : priority === 'medium' ? '#f59e0b'
                : '#22c55e',
            }}
          >
            {priority}
          </span>
        </div>
      )}

      {tips.length > 0 && (
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-text-muted)' }}>
            <RiLightbulbLine size={12} className="inline mr-1" />
            Productivity Tips
          </p>
          <ul className="space-y-2">
            {tips.map((t, i) => (
              <li key={i} className="text-xs leading-relaxed flex gap-2">
                <span style={{ color: '#6366f1' }}>→</span>
                <span style={{ color: 'var(--color-text)' }}>{t.tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AIAssistantPanel;

import { RiCalendarLine, RiFlag2Line, RiUser3Line } from 'react-icons/ri';
import { formatDate, isOverdue } from '../utils/helpers';

const priorityConfig = {
  low: { label: 'Low', color: '#22c55e', bg: '#22c55e15' },
  medium: { label: 'Medium', color: '#f59e0b', bg: '#f59e0b15' },
  high: { label: 'High', color: '#ef4444', bg: '#ef444415' },
  urgent: { label: 'Urgent', color: '#ec4899', bg: '#ec489915' },
};

const TaskCard = ({ task, onClick, onStatusChange, compact = false }) => {
  const priority = priorityConfig[task.priority] ?? priorityConfig.medium;
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div
      className="group p-4 rounded-xl border cursor-pointer transition-all duration-150 hover:border-indigo-500/30"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      onClick={() => onClick?.(task)}
    >
      {/* Priority + title */}
      <div className="flex items-start gap-2 mb-3">
        <RiFlag2Line size={14} style={{ color: priority.color, marginTop: 2, shrink: 0 }} />
        <span className="text-sm font-medium leading-snug" style={{ color: 'var(--color-text)' }}>
          {task.title}
        </span>
      </div>

      {!compact && task.description && (
        <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: priority.bg, color: priority.color }}
        >
          {priority.label}
        </span>

        <div className="flex items-center gap-3">
          {task.dueDate && (
            <span
              className="flex items-center gap-1 text-xs"
              style={{ color: overdue ? '#ef4444' : 'var(--color-text-muted)' }}
            >
              <RiCalendarLine size={12} />
              {overdue ? 'Overdue' : formatDate(task.dueDate)}
            </span>
          )}

          {task.assignee && (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontSize: '9px' }}
              title={task.assignee.name}
            >
              {task.assignee.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

import { fromNow } from '../utils/helpers';
import { RiTaskLine } from 'react-icons/ri';

const ActivityFeed = ({ tasks }) => {
  if (!tasks?.length) {
    return (
      <p className="text-sm text-center py-8" style={{ color: 'var(--color-text-muted)' }}>
        No recent activity
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <div key={task._id} className="flex items-start gap-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: `${task.project?.color ?? '#6366f1'}20` }}
          >
            <RiTaskLine size={14} style={{ color: task.project?.color ?? '#6366f1' }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
              {task.title}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {task.project?.title}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>·</span>
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {fromNow(task.createdAt)}
              </span>
            </div>
          </div>
          <span
            className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
              task.status === 'done'
                ? 'status-done'
                : task.status === 'in-progress'
                ? 'status-in-progress'
                : 'status-todo'
            }`}
          >
            {task.status === 'in-progress' ? 'In Progress' : task.status === 'done' ? 'Done' : 'To Do'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;

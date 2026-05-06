import TaskCard from './TaskCard';
import EmptyState from './EmptyState';

const columns = [
  { id: 'todo', label: 'To Do', dotColor: '#71717a' },
  { id: 'in-progress', label: 'In Progress', dotColor: '#60a5fa' },
  { id: 'done', label: 'Done', dotColor: '#4ade80' },
];

const KanbanColumn = ({ column, tasks, onTaskClick, onStatusChange }) => (
  <div className="flex flex-col min-w-[300px] max-w-[340px] flex-1">
    {/* Column header */}
    <div className="flex items-center gap-2 mb-4 px-1">
      <span className="w-2 h-2 rounded-full" style={{ background: column.dotColor }} />
      <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
        {column.label}
      </span>
      <span
        className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
        style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
      >
        {tasks.length}
      </span>
    </div>

    {/* Task list */}
    <div
      className="flex-1 rounded-xl p-3 space-y-3 min-h-[200px]"
      style={{ background: 'var(--color-surface-2)' }}
    >
      {tasks.length === 0 ? (
        <div className="flex items-center justify-center h-24">
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            No tasks here
          </p>
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={onTaskClick}
            onStatusChange={onStatusChange}
            compact
          />
        ))
      )}
    </div>
  </div>
);

const KanbanBoard = ({ tasks, onTaskClick, onStatusChange }) => {
  const grouped = columns.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  return (
    <div className="flex gap-5 overflow-x-auto pb-4">
      {columns.map((col) => (
        <KanbanColumn
          key={col.id}
          column={col}
          tasks={grouped[col.id] || []}
          onTaskClick={onTaskClick}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;

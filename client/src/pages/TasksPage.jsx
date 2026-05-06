import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RiAddLine, RiFilterLine, RiSearchLine, RiLayoutColumnLine, RiListUnordered } from 'react-icons/ri';
import { taskService, projectService } from '../services';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/KanbanBoard';
import TaskCard from '../components/TaskCard';
import TaskFormModal from '../components/TaskFormModal';
import EmptyState from '../components/EmptyState';
import { TableSkeleton } from '../components/SkeletonLoader';

const TasksPage = () => {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('kanban'); // kanban | list
  const [taskModal, setTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') ?? '',
    status: '',
    priority: '',
    projectId: '',
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v));
      const res = await taskService.getAll(params);
      setTasks(res.data.data.tasks);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    projectService.getAll().then((r) => setProjects(r.data.data.projects)).catch(() => {});
    if (searchParams.get('new') === '1') {
      setTaskModal(true);
      searchParams.delete('new');
      setSearchParams(searchParams);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [filters]);

  const setFilter = (key, val) => setFilters((p) => ({ ...p, [key]: val }));

  const handleTaskClick = (task) => { setSelectedTask(task); setTaskModal(true); };
  const handleTaskSaved = () => { setTaskModal(false); setSelectedTask(null); fetchTasks(); };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.update(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    } catch {
      toast.error('Failed to update task status');
    }
  };

  // Get project from selected task for modal members
  const selectedProject = projects.find(
    (p) => p._id === (selectedTask?.project?._id ?? filters.projectId)
  );

  return (
    <div className="max-w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>Tasks</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
            {[
              { id: 'kanban', icon: RiLayoutColumnLine },
              { id: 'list', icon: RiListUnordered },
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className="px-3 py-2 transition-colors"
                style={{
                  background: view === id ? '#6366f1' : 'var(--color-surface)',
                  color: view === id ? '#fff' : 'var(--color-text-muted)',
                }}
              >
                <Icon size={16} />
              </button>
            ))}
          </div>
          <button
            onClick={() => { setSelectedTask(null); setTaskModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <RiAddLine size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2" size={14} style={{ color: 'var(--color-text-muted)' }} />
          <input
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="Search tasks..."
            className="pl-9 pr-4 py-2 rounded-lg border text-sm outline-none"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)', minWidth: '200px' }}
          />
        </div>
        <select
          value={filters.status}
          onChange={(e) => setFilter('status', e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilter('priority', e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filters.projectId}
          onChange={(e) => setFilter('projectId', e.target.value)}
          className="px-3 py-2 rounded-lg border text-sm outline-none"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>
        {Object.values(filters).some(Boolean) && (
          <button
            onClick={() => setFilters({ search: '', status: '', priority: '', projectId: '' })}
            className="px-3 py-2 text-sm rounded-lg"
            style={{ color: '#ef4444', background: '#ef444415' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        view === 'list' ? <TableSkeleton rows={6} /> : (
          <div className="flex gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-1 space-y-3 min-w-[280px]">
                <div className="h-5 w-24 rounded animate-pulse" style={{ background: 'var(--color-border)' }} />
                {Array.from({ length: 3 }).map((__, j) => (
                  <div key={j} className="h-24 rounded-xl animate-pulse" style={{ background: 'var(--color-surface)' }} />
                ))}
              </div>
            ))}
          </div>
        )
      ) : tasks.length === 0 ? (
        <EmptyState
          icon="task"
          title="No tasks found"
          description="Create a task or adjust your filters."
          action={
            <button
              onClick={() => { setSelectedTask(null); setTaskModal(true); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
            >
              Create Task
            </button>
          }
        />
      ) : view === 'kanban' ? (
        <KanbanBoard tasks={tasks} onTaskClick={handleTaskClick} onStatusChange={handleStatusChange} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tasks.map((t) => (
            <TaskCard key={t._id} task={t} onClick={handleTaskClick} />
          ))}
        </div>
      )}

      {/* Task Modal */}
      {taskModal && (
        <TaskFormModal
          isOpen={taskModal}
          onClose={() => { setTaskModal(false); setSelectedTask(null); }}
          projectId={selectedTask?.project?._id ?? (filters.projectId || undefined)}
          projects={projects}
          task={selectedTask}
          members={selectedProject?.members ?? []}
          onSaved={handleTaskSaved}
        />
      )}
    </div>
  );
};

export default TasksPage;

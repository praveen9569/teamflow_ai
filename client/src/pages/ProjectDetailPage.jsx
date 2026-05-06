import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { RiArrowLeftLine, RiCalendarLine, RiGroupLine, RiAddLine, RiTaskLine } from 'react-icons/ri';
import { projectService, taskService, userService } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/helpers';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import { CardSkeleton } from '../components/SkeletonLoader';
import TaskFormModal from '../components/TaskFormModal';

const statusColors = {
  active: { bg: '#14532d20', text: '#4ade80' },
  'on-hold': { bg: '#78350f20', text: '#fbbf24' },
  completed: { bg: '#1e3a5f20', text: '#60a5fa' },
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [taskModal, setTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const load = async () => {
    try {
      const [projRes, taskRes, statsRes] = await Promise.all([
        projectService.getById(id),
        taskService.getAll({ projectId: id }),
        projectService.getStats(id),
      ]);
      setProject(projRes.data.data.project);
      setTasks(taskRes.data.data.tasks);
      setStats(statsRes.data.data.stats);
    } catch {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  useEffect(() => {
    if (isAdmin) {
      userService.getAll().then((r) => setAllUsers(r.data.data.users)).catch(() => {});
    }
  }, [isAdmin]);

  const handleAddMember = async () => {
    if (!selectedUserId) return;
    try {
      await projectService.addMember(id, selectedUserId);
      toast.success('Member added');
      setAddMemberModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await projectService.removeMember(id, userId);
      toast.success('Member removed');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleTaskSaved = () => { setTaskModal(false); setSelectedTask(null); load(); };

  if (loading) {
    return (
      <div className="max-w-5xl space-y-6">
        <div className="h-8 w-48 rounded-lg animate-pulse" style={{ background: 'var(--color-border)' }} />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!project) return null;
  const status = statusColors[project.status] ?? statusColors.active;
  const progress = stats?.total ? Math.round((stats.done / stats.total) * 100) : 0;
  const nonMembers = allUsers.filter((u) => !project.members.some((m) => m._id === u._id));

  return (
    <div className="max-w-5xl space-y-6">
      {/* Back + title */}
      <div>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-sm mb-4 transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
        >
          <RiArrowLeftLine size={16} /> Back to Projects
        </button>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `${project.color}20` }}
            >
              <RiTaskLine size={20} style={{ color: project.color }} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
                {project.title}
              </h1>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: status.bg, color: status.text }}
              >
                {project.status}
              </span>
            </div>
          </div>
          <button
            onClick={() => { setSelectedTask(null); setTaskModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            <RiAddLine size={16} /> Add Task
          </button>
        </div>
        {project.description && (
          <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {project.description}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tasks', val: stats?.total ?? 0 },
          { label: 'To Do', val: stats?.todo ?? 0 },
          { label: 'In Progress', val: stats?.inProgress ?? 0 },
          { label: 'Done', val: stats?.done ?? 0 },
        ].map((s) => (
          <div
            key={s.label}
            className="p-4 rounded-xl border text-center"
            style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <p className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>{s.val}</p>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="p-5 rounded-xl border"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: 'var(--color-text)' }}>Overall Progress</span>
          <span style={{ color: project.color }}>{progress}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${project.color}, ${project.color}99)` }}
          />
        </div>
        {project.deadline && (
          <div className="flex items-center gap-1.5 mt-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <RiCalendarLine size={12} /> Deadline: {formatDate(project.deadline)}
          </div>
        )}
      </div>

      {/* Members */}
      <div
        className="p-5 rounded-xl border"
        style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <RiGroupLine size={16} /> Members ({project.members.length})
          </h2>
          {isAdmin && nonMembers.length > 0 && (
            <button
              onClick={() => setAddMemberModal(true)}
              className="text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{ background: '#6366f120', color: '#818cf8' }}
            >
              + Add Member
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {project.members.map((m) => (
            <div
              key={m._id}
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ background: 'var(--color-surface-2)' }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}
              >
                {m.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{m.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{m.email}</p>
              </div>
              {isAdmin && !project.owner._id.toString().includes(m._id) && (
                <button
                  onClick={() => handleRemoveMember(m._id)}
                  className="ml-2 text-xs"
                  style={{ color: '#ef4444' }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div>
        <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
          Tasks ({tasks.length})
        </h2>
        {tasks.length === 0 ? (
          <EmptyState
            icon="task"
            title="No tasks yet"
            description="Add the first task to this project."
            action={
              <button
                onClick={() => setTaskModal(true)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                Add Task
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tasks.map((t) => (
              <TaskCard
                key={t._id}
                task={t}
                onClick={(task) => { setSelectedTask(task); setTaskModal(true); }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      <Modal
        isOpen={addMemberModal}
        onClose={() => setAddMemberModal(false)}
        title="Add Member"
        size="sm"
        footer={
          <>
            <button onClick={() => setAddMemberModal(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface-2)' }}>
              Cancel
            </button>
            <button onClick={handleAddMember} className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              Add
            </button>
          </>
        }
      >
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
          style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        >
          <option value="">Select a user</option>
          {nonMembers.map((u) => (
            <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
          ))}
        </select>
      </Modal>

      {/* Task Form Modal */}
      {taskModal && (
        <TaskFormModal
          isOpen={taskModal}
          onClose={() => { setTaskModal(false); setSelectedTask(null); }}
          projectId={id}
          task={selectedTask}
          members={project.members}
          onSaved={handleTaskSaved}
        />
      )}
    </div>
  );
};

export default ProjectDetailPage;

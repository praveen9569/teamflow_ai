import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { taskService, projectService } from '../services';
import Modal from './Modal';
import AIAssistantPanel from './AIAssistantPanel';

const defaultForm = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignee: '',
  dueDate: '',
  tags: '',
  selectedProjectId: '',
};

// Used both from ProjectDetailPage (projectId pre-set) and TasksPage (user picks project)
const TaskFormModal = ({ isOpen, onClose, projectId, projects = [], task, members: propMembers = [], onSaved }) => {
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [projectMembers, setProjectMembers] = useState(propMembers);

  // When editing an existing task, pre-fill the form
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title ?? '',
        description: task.description ?? '',
        status: task.status ?? 'todo',
        priority: task.priority ?? 'medium',
        assignee: task.assignee?._id ?? '',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        tags: task.tags?.join(', ') ?? '',
        selectedProjectId: task.project?._id ?? projectId ?? '',
      });
    } else {
      setForm({ ...defaultForm, selectedProjectId: projectId ?? '' });
    }
  }, [task, isOpen, projectId]);

  // When projectId prop is fixed (from project detail), use propMembers directly
  useEffect(() => {
    if (projectId) {
      setProjectMembers(propMembers);
    }
  }, [projectId, propMembers]);

  // When user selects a project from the dropdown, fetch its members
  const handleProjectChange = async (e) => {
    const pid = e.target.value;
    set('selectedProjectId')({ target: { value: pid } });
    if (!pid) { setProjectMembers([]); return; }
    try {
      const res = await projectService.getById(pid);
      setProjectMembers(res.data.data.project.members ?? []);
    } catch {
      setProjectMembers([]);
    }
  };

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));

  const resolvedProjectId = projectId || form.selectedProjectId;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    if (!resolvedProjectId) { toast.error('Please select a project'); return; }

    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      projectId: resolvedProjectId,
      assignee: form.assignee || null,
      dueDate: form.dueDate || null,
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };

    try {
      if (task) {
        await taskService.update(task._id, payload);
        toast.success('Task updated');
      } else {
        await taskService.create(payload);
        toast.success('Task created');
      }
      onSaved?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;
    setDeleting(true);
    try {
      await taskService.delete(task._id);
      toast.success('Task deleted');
      onSaved?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const inputStyle = {
    background: 'var(--color-surface-2)',
    borderColor: 'var(--color-border)',
    color: 'var(--color-text)',
  };

  // Show project selector only when we're NOT coming from a specific project page
  const showProjectSelector = !projectId && projects.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'New Task'}
      size="lg"
      footer={
        <div className="flex w-full items-center">
          {task && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="mr-auto text-sm px-3 py-1.5 rounded-lg"
              style={{ color: '#ef4444', background: '#ef444415' }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm ml-auto mr-2"
            style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface-2)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {saving ? 'Saving...' : task ? 'Update' : 'Create'}
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left column — form fields */}
        <div className="space-y-4">

          {/* Project selector — only shown when not coming from a project page */}
          {showProjectSelector && (
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Project *
              </label>
              <select
                value={form.selectedProjectId}
                onChange={handleProjectChange}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={inputStyle}
              >
                <option value="">— Select a project —</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>{p.title}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
              Title *
            </label>
            <input
              autoFocus
              value={form.title}
              onChange={set('title')}
              placeholder="e.g. Implement authentication flow"
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={set('description')}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none resize-none"
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Status
              </label>
              <select value={form.status} onChange={set('status')} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={inputStyle}>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Priority
              </label>
              <select value={form.priority} onChange={set('priority')} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={inputStyle}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Assignee
              </label>
              <select value={form.assignee} onChange={set('assignee')} className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none" style={inputStyle}>
                <option value="">Unassigned</option>
                {projectMembers.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
                Due Date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={set('dueDate')}
                className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
              Tags (comma-separated)
            </label>
            <input
              value={form.tags}
              onChange={set('tags')}
              placeholder="frontend, auth, bug"
              className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none"
              style={inputStyle}
            />
          </div>
        </div>

        {/* Right column — AI panel */}
        <div>
          <AIAssistantPanel
            taskTitle={form.title}
            dueDate={form.dueDate}
            onUseDescription={(desc) => setForm((p) => ({ ...p, description: desc }))}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TaskFormModal;

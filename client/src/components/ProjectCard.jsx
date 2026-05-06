import { useNavigate, useParams } from 'react-router-dom';
import { RiFolderLine, RiCalendarLine, RiGroupLine, RiMoreLine } from 'react-icons/ri';
import { formatDate } from '../utils/helpers';

const statusColors = {
  active: { bg: '#14532d20', text: '#4ade80' },
  'on-hold': { bg: '#78350f20', text: '#fbbf24' },
  completed: { bg: '#1e3a5f20', text: '#60a5fa' },
  archived: { bg: '#27272a', text: '#71717a' },
};

const ProjectCard = ({ project, onEdit, onDelete, isAdmin }) => {
  const navigate = useNavigate();

  const status = statusColors[project.status] ?? statusColors.active;
  const progress = project._taskStats
    ? Math.round((project._taskStats.done / (project._taskStats.total || 1)) * 100)
    : null;

  return (
    <div
      className="group p-5 rounded-xl border cursor-pointer transition-all duration-200 hover:border-indigo-500/40 hover:-translate-y-0.5"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      onClick={() => navigate(`/projects/${project._id}`)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${project.color}20` }}
          >
            <RiFolderLine size={18} style={{ color: project.color }} />
          </div>
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              {project.title}
            </h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: status.bg, color: status.text }}
            >
              {project.status}
            </span>
          </div>
        </div>

        {isAdmin && (
          <div
            className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="px-2 py-1 text-xs rounded-lg transition-colors"
              style={{ color: 'var(--color-text-muted)', background: 'var(--color-surface-2)' }}
              onClick={() => onEdit(project)}
            >
              Edit
            </button>
            <button
              className="px-2 py-1 text-xs rounded-lg transition-colors"
              style={{ color: '#ef4444', background: '#ef444410' }}
              onClick={() => onDelete(project)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-xs mb-4 line-clamp-2" style={{ color: 'var(--color-text-muted)' }}>
          {project.description}
        </p>
      )}

      {/* Progress bar */}
      {progress !== null && (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: project.color }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-2">
          {project.members?.slice(0, 4).map((m) => (
            <div
              key={m._id}
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold"
              style={{
                borderColor: 'var(--color-surface)',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff',
                fontSize: '9px',
              }}
              title={m.name}
            >
              {m.name?.[0]?.toUpperCase()}
            </div>
          ))}
          {project.members?.length > 4 && (
            <div
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs"
              style={{ borderColor: 'var(--color-surface)', background: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              +{project.members.length - 4}
            </div>
          )}
        </div>

        {project.deadline && (
          <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
            <RiCalendarLine size={12} />
            {formatDate(project.deadline)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;

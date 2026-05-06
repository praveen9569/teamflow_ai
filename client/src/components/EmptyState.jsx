import { RiInboxLine, RiFolderAddLine, RiTaskLine } from 'react-icons/ri';

const icons = {
  inbox: RiInboxLine,
  folder: RiFolderAddLine,
  task: RiTaskLine,
};

const EmptyState = ({ icon = 'inbox', title, description, action }) => {
  const Icon = icons[icon] ?? RiInboxLine;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: 'var(--color-surface-2)' }}
      >
        <Icon size={28} style={{ color: 'var(--color-text-muted)' }} />
      </div>
      <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
        {title}
      </h3>
      {description && (
        <p className="text-sm mb-5 max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
};

export default EmptyState;

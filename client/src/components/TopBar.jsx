import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RiSearchLine, RiBellLine, RiAddLine } from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
};

const TopBar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const title = Object.entries(pageTitles).find(([path]) =>
    location.pathname.startsWith(path)
  )?.[1] ?? 'TeamFlow AI';

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(query.trim())}`);
      setQuery('');
    }
  };

  return (
    <header
      className="flex items-center gap-4 px-6 py-3 border-b shrink-0"
      style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
    >
      <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
        {title}
      </h1>

      <form onSubmit={handleSearch} className="flex-1 max-w-xs ml-6">
        <div className="relative">
          <RiSearchLine
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={15}
            style={{ color: 'var(--color-text-muted)' }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full text-sm pl-9 pr-4 py-1.5 rounded-lg border outline-none transition-colors"
            style={{
              background: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
          />
        </div>
      </form>

      <div className="flex items-center gap-3 ml-auto">
        <button
          className="relative p-2 rounded-lg transition-colors"
          style={{ color: 'var(--color-text-muted)' }}
          title="Notifications"
        >
          <RiBellLine size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        <button
          onClick={() => navigate('/tasks?new=1')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-all duration-150"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <RiAddLine size={16} />
          New Task
        </button>
      </div>
    </header>
  );
};

export default TopBar;

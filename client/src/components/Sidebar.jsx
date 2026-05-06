import { NavLink, useNavigate } from 'react-router-dom';
import {
  RiDashboardLine,
  RiFolderLine,
  RiTaskLine,
  RiLogoutBoxLine,
  RiSparklingLine,
  RiTeamLine,
} from 'react-icons/ri';
import { useAuth } from '../context/AuthContext';
import { initials } from '../utils/helpers';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: RiDashboardLine },
  { label: 'Projects', to: '/projects', icon: RiFolderLine },
  { label: 'Tasks', to: '/tasks', icon: RiTaskLine },
];

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className="flex flex-col h-full w-60 shrink-0 border-r"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          <RiSparklingLine className="text-white" size={16} />
        </div>
        <div>
          <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>TeamFlow</span>
          <span className="text-xs font-medium ml-1" style={{ color: '#6366f1' }}>AI</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'text-white'
                  : ''
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: 'linear-gradient(135deg, #6366f115, #8b5cf615)', color: '#818cf8', borderLeft: '2px solid #6366f1', paddingLeft: '10px' }
                : { color: 'var(--color-text-muted)' }
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <div className="pt-4">
            <p className="px-3 text-xs font-semibold mb-2 uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
              Admin
            </p>
            <div
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-default"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <RiTeamLine size={18} />
              All Members
              <span className="ml-auto text-xs px-1.5 py-0.5 rounded" style={{ background: '#6366f120', color: '#818cf8' }}>
                Admin
              </span>
            </div>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff' }}
          >
            {initials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
              {user?.name}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
              {user?.role}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="shrink-0 p-1 rounded transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
            title="Logout"
          >
            <RiLogoutBoxLine size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

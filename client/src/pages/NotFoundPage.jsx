import { Link } from 'react-router-dom';
import { RiSparklingLine } from 'react-icons/ri';

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-bg)' }}>
    <div className="text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      >
        <RiSparklingLine size={28} className="text-white" />
      </div>
      <h1 className="text-6xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>404</h1>
      <p className="text-lg mb-2 font-medium" style={{ color: 'var(--color-text)' }}>Page not found</p>
      <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
      >
        Back to Dashboard
      </Link>
    </div>
  </div>
);

export default NotFoundPage;

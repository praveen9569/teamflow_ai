import { useState, useEffect } from 'react';
import {
  RiFolderLine,
  RiCheckLine,
  RiTimeLine,
  RiAlertLine,
  RiSparklingLine,
} from 'react-icons/ri';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { taskService, aiService } from '../services';
import StatsCard from '../components/StatsCard';
import ActivityFeed from '../components/ActivityFeed';
import { StatSkeleton } from '../components/SkeletonLoader';

const PIE_COLORS = { todo: '#71717a', 'in-progress': '#60a5fa', done: '#4ade80' };

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded-lg text-xs shadow-lg"
      style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
    >
      <p className="font-semibold">{payload[0].payload.name || payload[0].name}</p>
      <p>{payload[0].value} tasks</p>
    </div>
  );
};

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, tipsRes] = await Promise.all([
          taskService.getDashboard(),
          aiService.getTips(),
        ]);
        setData(dashRes.data.data);
        setTips(tipsRes.data.data.tips);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = data?.tasksByStatus?.map((s) => ({
    name: s._id === 'in-progress' ? 'In Progress' : s._id === 'todo' ? 'To Do' : 'Done',
    value: s.count,
    color: PIE_COLORS[s._id] ?? '#6366f1',
  })) ?? [];

  const barData = [
    { label: 'To Do', count: data?.stats?.pendingTasks ?? 0 },
    { label: 'Done', count: data?.stats?.completedTasks ?? 0 },
    { label: 'Overdue', count: data?.stats?.overdueTasks ?? 0 },
  ];

  return (
    <div className="space-y-7 max-w-7xl">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
        ) : (
          <>
            <StatsCard
              title="Total Projects"
              value={data?.stats?.totalProjects ?? 0}
              icon={RiFolderLine}
              color="#6366f1"
            />
            <StatsCard
              title="Completed Tasks"
              value={data?.stats?.completedTasks ?? 0}
              icon={RiCheckLine}
              color="#22c55e"
            />
            <StatsCard
              title="Pending Tasks"
              value={data?.stats?.pendingTasks ?? 0}
              icon={RiTimeLine}
              color="#f59e0b"
            />
            <StatsCard
              title="Overdue Tasks"
              value={data?.stats?.overdueTasks ?? 0}
              icon={RiAlertLine}
              color="#ef4444"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Bar chart */}
        <div
          className="lg:col-span-2 p-5 rounded-xl border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--color-text)' }}>
            Task Overview
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={32}>
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div
          className="p-5 rounded-xl border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-sm font-semibold mb-5" style={{ color: 'var(--color-text)' }}>
            Status Breakdown
          </h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48">
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>No task data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Activity feed */}
        <div
          className="lg:col-span-2 p-5 rounded-xl border"
          style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Recent Activity
          </h2>
          <ActivityFeed tasks={data?.recentTasks ?? []} />
        </div>

        {/* AI Tips */}
        <div
          className="p-5 rounded-xl border"
          style={{ background: '#6366f108', borderColor: '#6366f130' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <RiSparklingLine size={16} style={{ color: '#818cf8' }} />
            <h2 className="text-sm font-semibold" style={{ color: '#818cf8' }}>
              AI Productivity Tips
            </h2>
          </div>
          {tips.length > 0 ? (
            <ul className="space-y-4">
              {tips.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    className="text-xs font-bold shrink-0 px-2 py-0.5 rounded"
                    style={{ background: '#6366f120', color: '#818cf8' }}
                  >
                    {t.category}
                  </span>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>
                    {t.tip}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Loading tips...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

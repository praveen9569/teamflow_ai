const Skeleton = ({ className = '', style = {} }) => (
  <div
    className={`rounded-lg animate-pulse ${className}`}
    style={{ background: 'var(--color-border)', ...style }}
  />
);

export const CardSkeleton = () => (
  <div
    className="p-5 rounded-xl border space-y-3"
    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
  >
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
    <div className="flex gap-2 pt-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  </div>
);

export const StatSkeleton = () => (
  <div
    className="p-5 rounded-xl border"
    style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
  >
    <Skeleton className="h-3 w-1/2 mb-3" />
    <Skeleton className="h-8 w-1/3" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center px-4 py-3 rounded-lg" style={{ background: 'var(--color-surface)' }}>
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </div>
);

export default Skeleton;

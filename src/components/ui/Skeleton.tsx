interface SkeletonProps {
  className?: string;
  height?: string;
  width?: string;
}

export default function Skeleton({ className = '', height, width }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-input bg-gray-200 ${className}`}
      style={{ height, width }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-[12px] border border-gray-100 bg-white overflow-hidden shadow-sm">
      <Skeleton className="h-[200px] w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-card bg-white shadow-sm overflow-hidden">
      <div className="p-3 border-b border-gray-100 flex gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border-b border-gray-50">
          {Array.from({ length: 6 }).map((_, j) => (
            <Skeleton key={j} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

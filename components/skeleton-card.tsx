import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-neutral-800/50 p-6 min-h-[300px]",
        className
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="h-7 w-32 bg-neutral-700 rounded animate-pulse" />
        <div className="h-5 w-16 bg-neutral-700 rounded-full animate-pulse" />
      </div>

      {/* Description lines */}
      <div className="space-y-2 mb-4">
        <div className="h-4 w-full bg-neutral-700 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-neutral-700 rounded animate-pulse" />
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-4">
        <div className="h-4 w-16 bg-neutral-700 rounded animate-pulse" />
        <div className="h-4 w-12 bg-neutral-700 rounded animate-pulse" />
      </div>

      {/* Tech badges */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="h-6 w-20 bg-neutral-700 rounded-full animate-pulse" />
        <div className="h-6 w-16 bg-neutral-700 rounded-full animate-pulse" />
        <div className="h-6 w-24 bg-neutral-700 rounded-full animate-pulse" />
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-neutral-700 rounded animate-pulse" />
        <div className="h-8 w-16 bg-neutral-700 rounded animate-pulse" />
      </div>
    </div>
  );
}

export function SkeletonCardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

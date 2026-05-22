import React from 'react'

// Common shimmer utility class
const shimmerClass = "animate-pulse bg-gray-800 rounded-lg"

export function StatCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
      <div className={`h-4 w-24 ${shimmerClass}`}></div>
      <div className={`h-8 w-12 ${shimmerClass}`}></div>
    </div>
  )
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className={`h-5 w-1/2 ${shimmerClass}`}></div>
          <div className={`h-4 w-5/6 ${shimmerClass}`}></div>
        </div>
        <div className={`h-4 w-10 ${shimmerClass} shrink-0`}></div>
      </div>
      
      {/* Progress Bar Skeleton */}
      <div className="space-y-1.5 pt-2">
        <div className="flex justify-between">
          <div className={`h-3 w-12 ${shimmerClass}`}></div>
          <div className={`h-3 w-8 ${shimmerClass}`}></div>
        </div>
        <div className={`h-2.5 w-full ${shimmerClass}`}></div>
      </div>

      {/* Member Avatars Skeleton */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex -space-x-1">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`w-6 h-6 rounded-full border border-gray-900 ${shimmerClass}`}></div>
          ))}
        </div>
        <div className={`h-3 w-16 ${shimmerClass}`}></div>
      </div>

      <div className={`h-9 w-full ${shimmerClass}`}></div>
    </div>
  )
}

export function KanbanColumnSkeleton() {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className={`h-5 w-24 ${shimmerClass}`}></div>
        <div className={`h-5 w-6 rounded-full ${shimmerClass}`}></div>
      </div>
      <div className="space-y-3 min-h-24 pt-2">
        {[1, 2].map((n) => (
          <div key={n} className="bg-gray-900 rounded-lg p-3 border border-gray-800 space-y-3">
            <div className="flex justify-between items-start gap-2">
              <div className={`h-4 w-4/5 ${shimmerClass}`}></div>
              <div className={`h-4 w-4 rounded-full ${shimmerClass} shrink-0`}></div>
            </div>
            <div className={`h-3 w-11/12 ${shimmerClass}`}></div>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <div className={`h-5 w-16 ${shimmerClass}`}></div>
              <div className={`h-5 w-20 ${shimmerClass}`}></div>
            </div>
            <div className={`h-6 w-full ${shimmerClass}`}></div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function SkeletonLoader({ type = 'project', count = 2 }) {
  const items = Array.from({ length: count })
  
  if (type === 'stat') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {items.map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    )
  }

  if (type === 'kanban') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((_, i) => <KanbanColumnSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map((_, i) => <ProjectCardSkeleton key={i} />)}
    </div>
  )
}

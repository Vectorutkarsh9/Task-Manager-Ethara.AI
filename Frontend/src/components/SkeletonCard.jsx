import React from 'react'

// Base utility for shimmer items
const shimmerBase = "animate-pulse bg-gray-850 rounded-lg"

export function StatSkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-850 rounded-xl p-5 space-y-3 shadow-lg shadow-black/10">
      <div className={`h-3 w-16 ${shimmerBase}`}></div>
      <div className={`h-8 w-20 ${shimmerBase} bg-gray-800`}></div>
    </div>
  )
}

export function ProjectSkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-850 rounded-2xl p-5 space-y-5 shadow-lg shadow-black/10">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className={`h-5 w-2/3 ${shimmerBase} bg-gray-800`}></div>
          <div className={`h-3.5 w-11/12 ${shimmerBase}`}></div>
          <div className={`h-3.5 w-3/4 ${shimmerBase}`}></div>
        </div>
        <div className={`h-8 w-8 rounded-lg ${shimmerBase} shrink-0`}></div>
      </div>
      
      {/* Progress Bar Skeleton */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between">
          <div className={`h-3 w-16 ${shimmerBase}`}></div>
          <div className={`h-3 w-8 ${shimmerBase}`}></div>
        </div>
        <div className={`h-2 w-full ${shimmerBase} bg-gray-800`}></div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-850/50">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {[1, 2, 3].map((n) => (
              <div key={n} className={`w-6 h-6 rounded-full border border-gray-900 ${shimmerBase} bg-gray-800`}></div>
            ))}
          </div>
          <div className={`h-3.5 w-12 ${shimmerBase}`}></div>
        </div>
        <div className={`h-7 w-24 rounded-lg ${shimmerBase} bg-gray-800`}></div>
      </div>
    </div>
  )
}

export function TaskSkeletonCard() {
  return (
    <div className="bg-gray-900 border border-gray-850 rounded-xl p-4 space-y-4 shadow-md min-h-[140px] flex flex-col justify-between border-l-4 border-l-gray-800">
      <div>
        <div className="flex justify-between items-start gap-3">
          <div className={`h-4 w-4/5 ${shimmerBase} bg-gray-800`}></div>
          <div className={`h-4 w-4 rounded ${shimmerBase}`}></div>
        </div>
        <div className={`h-3.5 w-11/12 ${shimmerBase} mt-2`}></div>
        <div className={`h-3.5 w-2/3 ${shimmerBase} mt-1`}></div>
      </div>

      <div className="space-y-3 pt-3 border-t border-gray-850/40">
        <div className="flex justify-between items-center">
          <div className={`h-4 w-16 ${shimmerBase}`}></div>
          <div className={`h-4 w-12 rounded-full ${shimmerBase} bg-gray-800`}></div>
        </div>
        <div className="flex justify-between items-center">
          <div className={`h-5 w-20 rounded-full ${shimmerBase} bg-gray-800`}></div>
          <div className={`h-5 w-14 rounded ${shimmerBase}`}></div>
        </div>
      </div>
    </div>
  )
}

export default function SkeletonCard({ type = 'project' }) {
  if (type === 'stat') return <StatSkeletonCard />
  if (type === 'task') return <TaskSkeletonCard />
  return <ProjectSkeletonCard />
}

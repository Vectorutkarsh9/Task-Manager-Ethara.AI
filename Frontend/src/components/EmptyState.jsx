import React from 'react'

export default function EmptyState({ 
  title = "No items found", 
  description = "Get started by creating a new entry.", 
  actionLabel, 
  onAction,
  icon = "list"
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-900/40 border border-gray-900 rounded-2xl p-8 max-w-lg mx-auto animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-indigo-950/60 border border-indigo-800/30 flex items-center justify-center mb-5 text-indigo-400">
        {icon === "project" ? (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ) : icon === "task" ? (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        ) : (
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-6 leading-relaxed max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 text-white text-sm font-semibold rounded-xl transition duration-300 shadow-lg shadow-indigo-600/20"
        >
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  )
}

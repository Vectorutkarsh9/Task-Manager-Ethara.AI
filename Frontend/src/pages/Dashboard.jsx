import { useEffect, useState } from 'react'
import api from '../services/api'
import Navbar from '../components/Navbar'

const StatCard = ({ label, value, color }) => (
  <div className={`bg-gray-900 border ${color} rounded-xl p-5`}>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-3xl font-bold text-white mt-1">{value}</p>
  </div>
)

const statusColor = { Todo: 'bg-gray-700', InProgress: 'bg-yellow-700', Done: 'bg-green-700' }

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/dashboard')
      .then(r => setData(r.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Tasks"   value={data?.totalTasks}      color="border-gray-700" />
          <StatCard label="To Do"         value={data?.todoCount}        color="border-gray-600" />
          <StatCard label="In Progress"   value={data?.inProgressCount}  color="border-yellow-800" />
          <StatCard label="Done"          value={data?.doneCount}        color="border-green-800" />
        </div>

        {data?.overdueCount > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-red-400 font-semibold">⚠ Overdue Tasks</span>
              <span className="bg-red-900 text-red-300 text-xs px-2 py-0.5 rounded-full">{data.overdueCount}</span>
            </div>
            <div className="space-y-2">
              {data.overdueTasks.map(t => (
                <div key={t.id} className="bg-gray-900 border border-red-900/50 rounded-lg px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{t.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Due: {new Date(t.dueDate).toLocaleDateString()} · Assigned to: {t.assignedTo?.name || 'Unassigned'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full text-white ${statusColor[t.status] || 'bg-gray-700'}`}>
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data?.overdueCount === 0 && (
          <div className="bg-green-900/20 border border-green-800 rounded-xl p-6 text-center text-green-400">
            ✅ No overdue tasks! Everything is on track.
          </div>
        )}
      </div>
    </div>
  )
}

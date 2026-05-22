import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ProjectSkeletonCard } from '../components/SkeletonCard'
import EmptyState from '../components/EmptyState'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [creating, setCreating] = useState(false)
  const { isAdmin } = useAuth()
  const { success, error: toastError } = useToast()

  const fetchProjects = () => {
    setLoading(true)
    api.get('/api/projects')
      .then(r => setProjects(r.data))
      .catch(err => {
        toastError('Failed to fetch projects.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProjects() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/api/projects', form)
      success(`Project "${form.name}" created successfully!`)
      setForm({ name: '', description: '' })
      setShowForm(false)
      fetchProjects()
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create project'
      toastError(errMsg)
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete project "${name}" and all its tasks?`)) return
    try {
      await api.delete(`/api/projects/${id}`)
      success(`Project "${name}" has been deleted.`)
      setProjects(p => p.filter(x => x.id !== id))
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete project')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2.5xl font-extrabold text-white tracking-tight">Projects</h1>
            <p className="text-gray-400 text-sm mt-0.5">Manage and organize your active sprint workgroups.</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95"
            >
              {showForm ? 'Close Form' : '+ New Project'}
            </button>
          )}
        </div>

        {showForm && isAdmin && (
          <form onSubmit={handleCreate} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 space-y-4 animate-fade-in shadow-xl shadow-black/10">
            <h2 className="text-white font-bold text-lg">Create New Project</h2>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-400">Project Name</label>
              <input
                required
                placeholder="e.g. LLM Data Pipeline"
                className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 border border-gray-700/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-400">Description</label>
              <textarea
                placeholder="Summarize the core target of this project..."
                rows={3}
                className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 border border-gray-700/80 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={creating} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition shadow-lg shadow-indigo-600/10">
                {creating ? 'Creating…' : 'Create'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-400 hover:text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-800 transition">
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="grid md:grid-cols-2 gap-5 pt-2">
            <ProjectSkeletonCard />
            <ProjectSkeletonCard />
          </div>
        ) : projects.length === 0 ? (
          <div className="py-12">
            <EmptyState
              title="No Projects Active"
              description="You aren't associated with any active projects yet. Get started by creating your first sprint project."
              icon="project"
              actionLabel={isAdmin ? "Create Your First Project" : null}
              onAction={isAdmin ? () => setShowForm(true) : null}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {projects.map(p => (
              <div 
                key={p.id} 
                className="bg-gray-900 border border-gray-850 rounded-2xl p-5 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-950/10 hover:-translate-y-1.5 transition-all duration-300 ease-out group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Link to={`/projects/${p.id}`} className="text-white font-bold text-lg hover:text-indigo-400 transition group-hover:text-indigo-400">
                        {p.name}
                      </Link>
                      <p className="text-gray-400 text-xs mt-1.5 leading-relaxed line-clamp-2">{p.description || 'No description provided.'}</p>
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={() => handleDelete(p.id, p.name)} 
                        className="text-gray-500 hover:text-red-400 hover:bg-red-950/20 p-1.5 rounded-lg transition ml-4 shrink-0"
                        title="Delete Project"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Task Completion Progress Bar */}
                  <div className="mt-5 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-semibold">
                      <span className="text-gray-500">Sprints Done</span>
                      <span className="text-indigo-300 font-bold">
                        {p.totalTasks > 0 ? `${Math.round((p.completedTasks / p.totalTasks) * 100)}%` : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800/80 rounded-full h-2 overflow-hidden border border-gray-700/30">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${p.totalTasks > 0 ? (p.completedTasks / p.totalTasks) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between pt-4 border-t border-gray-850/50">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1.5">
                      {p.members?.slice(0, 4).map(m => {
                        const initials = m.name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()
                        return (
                          <div 
                            key={m.id} 
                            className="w-6.5 h-6.5 rounded-full bg-indigo-950 border border-gray-900 flex items-center justify-center text-[10px] text-indigo-300 font-bold shrink-0"
                            title={`${m.name} (${m.role})`}
                          >
                            {initials}
                          </div>
                        )
                      })}
                      {p.members?.length > 4 && (
                        <div className="w-6.5 h-6.5 rounded-full bg-gray-850 border border-gray-900 flex items-center justify-center text-[9px] text-gray-400 font-bold shrink-0">
                          +{p.members.length - 4}
                        </div>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs font-medium">{p.members?.length} staff</span>
                  </div>
                  <Link
                    to={`/projects/${p.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-950/60 border border-indigo-900/60 text-indigo-300 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 text-xs font-semibold rounded-lg transition duration-200"
                  >
                    <span>View Kanban</span>
                    <span className="text-[10px]">&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

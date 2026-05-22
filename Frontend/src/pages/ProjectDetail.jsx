import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import SkeletonLoader from '../components/SkeletonLoader'
import EmptyState from '../components/EmptyState'

const STATUSES = ['Todo', 'InProgress', 'Done']
const STATUS_LABELS = { Todo: 'To Do', InProgress: 'In Progress', Done: 'Done' }
const STATUS_COLORS = {
  Todo:       'border-gray-800 bg-gray-900/40',
  InProgress: 'border-amber-950/50 bg-amber-950/10',
  Done:       'border-emerald-950/50 bg-emerald-950/10',
}
const STATUS_LEFT_BORDER = {
  Todo:       'border-l-4 border-l-slate-500',
  InProgress: 'border-l-4 border-l-amber-500',
  Done:       'border-l-4 border-l-emerald-500',
}
const PRIORITY_BADGES = {
  High:   'bg-red-950/50 text-red-400 border border-red-900/30',
  Medium: 'bg-amber-950/50 text-amber-400 border border-amber-900/30',
  Low:    'bg-gray-800 text-gray-400 border border-gray-700/30',
}

export default function ProjectDetail() {
  const { id } = useParams()
  const { isAdmin, user } = useAuth()
  const { success, error: toastError } = useToast()
  const [project, setProject]   = useState(null)
  const [tasks, setTasks]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showMemberForm, setShowMemberForm] = useState(false)
  const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedToId: '', dueDate: '', priority: 'Medium' })
  const [memberUserId, setMemberUserId] = useState('')
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  const fetchAll = async () => {
    try {
      const [pRes, tRes] = await Promise.all([
        api.get(`/api/projects/${id}`),
        api.get(`/api/projects/${id}/tasks`)
      ])
      setProject(pRes.data)
      setTasks(tRes.data)
    } catch (err) {
      toastError('Failed to load board details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [id])

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/api/tasks/${taskId}`, { status: newStatus })
      setTasks(ts => ts.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
      success(`Task status updated to ${STATUS_LABELS[newStatus]}.`)
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to update task status')
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const payload = {
        title: taskForm.title,
        description: taskForm.description,
        assignedToId: taskForm.assignedToId ? parseInt(taskForm.assignedToId) : null,
        dueDate: taskForm.dueDate || null,
        priority: taskForm.priority,
      }
      await api.post(`/api/projects/${id}/tasks`, payload)
      success(`Task "${taskForm.title}" added to backlog.`)
      setTaskForm({ title: '', description: '', assignedToId: '', dueDate: '', priority: 'Medium' })
      setShowTaskForm(false)
      fetchAll()
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to create task'
      setError(errMsg)
      toastError(errMsg)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTask = async (taskId, title) => {
    if (!confirm(`Delete task "${title}"?`)) return
    try {
      await api.delete(`/api/tasks/${taskId}`)
      success(`Task "${title}" deleted.`)
      setTasks(ts => ts.filter(t => t.id !== taskId))
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to delete task')
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      await api.post(`/api/projects/${id}/members`, { userId: parseInt(memberUserId) })
      success('Staff member added to project team.')
      setMemberUserId('')
      setShowMemberForm(false)
      fetchAll()
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to add member'
      setError(errMsg)
      toastError(errMsg)
    } finally {
      setSaving(false)
    }
  }

  const tasksByStatus = (status) => tasks.filter(t => t.status === status)

  if (loading) return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6 animate-pulse">
        <div className="h-6 w-48 bg-gray-800 rounded-lg"></div>
        <div className="h-4 w-96 bg-gray-850 rounded-lg"></div>
        <div className="pt-4">
          <SkeletonLoader type="kanban" count={3} />
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2.5xl font-extrabold text-white tracking-tight">{project?.name}</h1>
            <p className="text-gray-400 text-sm mt-0.5">{project?.description || 'No description provided.'}</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <>
                <button onClick={() => setShowMemberForm(!showMemberForm)}
                  className="text-sm font-semibold border border-gray-800 text-gray-300 px-4 py-2.5 rounded-xl hover:border-indigo-600 hover:bg-gray-900 transition active:scale-95">
                  + Add Member
                </button>
                <button onClick={() => setShowTaskForm(!showTaskForm)}
                  className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95">
                  + New Task
                </button>
              </>
            )}
          </div>
        </div>

        {error && <div className="bg-red-950/50 border border-red-900 text-red-300 px-4 py-2.5 rounded-xl mb-4 text-sm">{error}</div>}

        {/* Add Member Form */}
        {showMemberForm && isAdmin && (
          <form onSubmit={handleAddMember} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row gap-4 items-end animate-fade-in shadow-xl shadow-black/10">
            <div className="flex-1 w-full">
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">User ID to Add</label>
              <input required type="number" value={memberUserId} onChange={e => setMemberUserId(e.target.value)}
                placeholder="e.g. 2"
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500 transition" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button type="submit" disabled={saving} className="flex-1 sm:flex-initial bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition shadow-lg shadow-indigo-600/10">
                Add Staff
              </button>
              <button type="button" onClick={() => setShowMemberForm(false)} className="text-gray-400 hover:text-white text-sm font-semibold px-4 py-2.5 hover:bg-gray-800 rounded-xl transition">Cancel</button>
            </div>
          </form>
        )}

        {/* Create Task Form */}
        {showTaskForm && isAdmin && (
          <form onSubmit={handleCreateTask} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8 space-y-4 animate-fade-in shadow-xl shadow-black/10">
            <h3 className="text-white font-bold text-lg">Create New Task</h3>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-400">Task Title</label>
              <input required placeholder="Brief title of work"
                className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-400">Task Description</label>
              <textarea placeholder="Outline task scope and targets..." rows={3}
                className="w-full bg-gray-800/80 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-indigo-500 resize-none transition"
                value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Assign To</label>
                <select className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                  value={taskForm.assignedToId} onChange={e => setTaskForm({ ...taskForm, assignedToId: e.target.value })}>
                  <option value="">Unassigned</option>
                  {project?.members?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Due Date</label>
                <input type="date" className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                  value={taskForm.dueDate} onChange={e => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Priority</label>
                <select className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 border border-gray-700 focus:outline-none focus:border-indigo-500 transition"
                  value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50 transition shadow-lg shadow-indigo-600/10">
                {saving ? 'Creating…' : 'Create Task'}
              </button>
              <button type="button" onClick={() => setShowTaskForm(false)} className="text-gray-400 hover:text-white text-sm font-semibold px-4 py-2.5 hover:bg-gray-800 rounded-xl transition">Cancel</button>
            </div>
          </form>
        )}

        {/* Kanban Board with Horizontal Swipe for Mobile */}
        <div className="flex flex-row overflow-x-auto md:grid md:grid-cols-3 gap-5 pb-5 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          {STATUSES.map(status => (
            <div key={status} className={`rounded-2xl border p-4 flex-1 min-w-[310px] md:min-w-0 flex flex-col ${STATUS_COLORS[status]}`}>
              <div className="flex items-center justify-between mb-4 border-b border-gray-800/40 pb-2">
                <span className="font-extrabold text-white text-sm tracking-tight">{STATUS_LABELS[status]}</span>
                <span className="text-[10px] font-bold bg-gray-900 border border-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{tasksByStatus(status).length}</span>
              </div>
              
              <div className="space-y-3.5 flex-1 min-h-[300px]">
                {tasksByStatus(status).map(task => (
                  <div 
                    key={task.id} 
                    className={`bg-gray-900 rounded-xl p-4 border border-gray-850 shadow-md hover:border-gray-700/60 hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between min-h-[140px] group ${STATUS_LEFT_BORDER[task.status]}`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-white text-sm font-semibold leading-snug">{task.title}</p>
                        {isAdmin && (
                          <button 
                            onClick={() => handleDeleteTask(task.id, task.title)} 
                            className="text-gray-500 hover:text-red-400 hover:bg-red-950/20 p-1 rounded-md transition shrink-0 opacity-0 group-hover:opacity-100 duration-200"
                            title="Delete Task"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                      {task.description && <p className="text-gray-400 text-xs mt-1.5 leading-relaxed line-clamp-2">{task.description}</p>}
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-850/40 space-y-3">
                      {/* Metas: Due Date & Priority */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        {task.dueDate ? (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                            new Date(task.dueDate) < new Date() && task.status !== 'Done' 
                              ? 'bg-red-950/30 text-red-400 border-red-900/20' 
                              : 'bg-gray-850 text-gray-400 border-gray-800/40'
                          }`}>
                            📅 {new Date(task.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </span>
                        ) : (
                          <span className="text-[9px] text-gray-600">No deadline</span>
                        )}
                        
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full tracking-wider ${PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.Medium}`}>
                          {task.priority || 'Medium'}
                        </span>
                      </div>
                      
                      {/* Assignee & Move status */}
                      <div className="flex items-center justify-between pt-1 gap-2">
                        {task.assignedTo ? (
                          <div className="flex items-center gap-1.5 bg-gray-850 px-2 py-0.5 rounded-full border border-gray-800/40 max-w-[140px]">
                            <div className="w-4 h-4 rounded-full bg-indigo-950 flex items-center justify-center text-[8px] text-indigo-300 font-bold shrink-0">
                              {task.assignedTo.name[0].toUpperCase()}
                            </div>
                            <span className="text-[10px] text-gray-300 font-medium truncate">{task.assignedTo.name}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-500 italic">Unassigned</span>
                        )}
                        
                        {/* Status change dropdown */}
                        <select
                          className="text-[10px] rounded-lg bg-gray-850 border border-gray-800 text-gray-300 px-2 py-1 focus:outline-none focus:border-indigo-600 transition"
                          value={task.status}
                          onChange={e => handleStatusChange(task.id, e.target.value)}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
                
                {tasksByStatus(status).length === 0 && (
                  <div className="h-full flex items-center justify-center py-10">
                    <EmptyState
                      title=""
                      description={`No tasks in ${STATUS_LABELS[status]}`}
                      icon="task"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Team Members List */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl shadow-black/10">
          <h3 className="text-white font-extrabold text-lg tracking-tight mb-3">Project Team Members</h3>
          <div className="flex flex-wrap gap-2.5">
            {project?.members?.map(m => {
              const initials = m.name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()
              return (
                <div key={m.id} className="flex items-center gap-2 bg-gray-850/80 px-3.5 py-2 rounded-xl border border-gray-800/40">
                  <div className="w-6.5 h-6.5 rounded-full bg-indigo-950 flex items-center justify-center text-[10px] text-indigo-300 font-bold">{initials}</div>
                  <div className="text-left">
                    <p className="text-xs font-semibold text-gray-250 leading-tight">{m.name}</p>
                    <span className={`text-[9px] font-bold ${m.role === 'Admin' ? 'text-yellow-400' : 'text-blue-400'}`}>{m.role}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

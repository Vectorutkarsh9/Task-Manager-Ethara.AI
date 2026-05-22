import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Member' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { success, error: toastError } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/signup', form)
      login(data)
      success(`Welcome to TaskManager, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Signup failed'
      setError(errMsg)
      toastError(errMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">TaskManager</h1>
          <p className="text-gray-400 mt-1">Ethara.AI Internal Tool</p>
        </div>
        <div className="bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-800">
          <h2 className="text-xl font-semibold text-white mb-6">Create account</h2>
          {error && <div className="bg-red-900/40 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your name' },
              { label: 'Email', key: 'email', type: 'email', placeholder: 'you@ethara.ai' },
              { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm text-gray-400 mb-1">{label}</label>
                <input
                  type={type} required
                  className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500"
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm text-gray-400 mb-1">Role</label>
              <select
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500"
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

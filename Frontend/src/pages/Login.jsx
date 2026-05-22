import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
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
      const { data } = await api.post('/api/auth/login', form)
      login(data)
      success(`Welcome back, ${data.name}!`)
      navigate('/dashboard')
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed'
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
          <h2 className="text-xl font-semibold text-white mb-6">Sign in</h2>
          {error && <div className="bg-red-900/40 text-red-300 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email" required
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@ethara.ai"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input
                type="password" required
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2.5 border border-gray-700 focus:outline-none focus:border-indigo-500"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-gray-500 text-sm mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:underline">Sign up</Link>
          </p>
          <div className="mt-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-400">
            <p className="font-medium text-gray-300 mb-1">Demo credentials:</p>
            <p>Admin: admin@ethara.ai / Admin@123</p>
            <p>Member: alice@ethara.ai / Member@123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => { 
    logout()
    navigate('/login') 
  }

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-semibold px-3.5 py-2 rounded-xl transition-all duration-300 ${
        location.pathname.startsWith(to)
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      }`}
    >
      {label}
    </Link>
  )

  const getInitials = (name) => {
    if (!name) return '?'
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }

  const getAvatarColor = (name) => {
    if (!name) return 'from-indigo-600 to-violet-600'
    const gradients = [
      'from-indigo-500 to-violet-600',
      'from-emerald-500 to-teal-600',
      'from-amber-500 to-orange-600',
      'from-pink-500 to-rose-600',
      'from-purple-500 to-indigo-600',
      'from-cyan-500 to-blue-600',
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    return gradients[Math.abs(hash) % gradients.length]
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800/80 px-6 py-3.5 flex items-center justify-between relative z-30">
      <div className="flex items-center gap-8">
        <Link to="/" className="text-white font-extrabold text-xl tracking-tight flex items-center gap-2 hover:opacity-90 transition">
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">⚡ TaskManager</span>
        </Link>
        <div className="flex items-center gap-2">
          {navLink('/dashboard', 'Dashboard')}
          {navLink('/projects', 'Projects')}
        </div>
      </div>

      <div className="flex items-center gap-4 relative" ref={dropdownRef}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-gray-800/60 transition duration-300 focus:outline-none"
        >
          {/* Initials Avatar Circle */}
          <div className={`w-9.5 h-9.5 rounded-full bg-gradient-to-br ${getAvatarColor(user?.name)} flex items-center justify-center text-sm text-white font-bold shadow-md shadow-indigo-600/10 hover:brightness-110 transition`}>
            {getInitials(user?.name)}
          </div>
          <div className="hidden md:block text-left pr-1.5">
            <p className="text-xs font-semibold text-gray-300 leading-tight">{user?.name}</p>
            <p className="text-[10px] text-gray-500 leading-tight">{user?.role}</p>
          </div>
        </button>

        {/* Beautiful Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-gray-900 border border-gray-800 shadow-2xl p-2 animate-fade-in z-50">
            <div className="px-3.5 py-3 border-b border-gray-800/60 mb-2">
              <p className="text-sm font-bold text-white leading-tight">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{user?.email}</p>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold ${isAdmin ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'}`}>
                {user?.role}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-950/30 transition duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

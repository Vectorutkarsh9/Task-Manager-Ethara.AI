import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('tm_user')
    return stored ? JSON.parse(stored) : null
  })

  const login = (userData) => {
    localStorage.setItem('tm_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('tm_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'Admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

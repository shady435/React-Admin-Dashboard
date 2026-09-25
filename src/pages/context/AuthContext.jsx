import { createContext, useContext, useEffect, useState } from 'react'
import api from '../../api/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const fakeAdminUser = {
      id: "1",
      name: "Shady Emad",
      email: email || "admin@example.com",
      role: "admin"
    };
    const fakeToken = "fake-jwt-token-12345";

    localStorage.setItem('token', fakeToken)
    localStorage.setItem('user', JSON.stringify(fakeAdminUser))
    setUser(fakeAdminUser)
    
    return fakeAdminUser
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}
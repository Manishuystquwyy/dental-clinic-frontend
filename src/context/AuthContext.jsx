import React, { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

function loadUserFromStorage() {
  const stored = localStorage.getItem('gayatri_user')
  return stored ? JSON.parse(stored) : null
}

function saveUserToStorage(user) {
  if (user) {
    localStorage.setItem('gayatri_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('gayatri_user')
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = loadUserFromStorage()
    setUser(stored)
    setLoading(false)
  }, [])

  function signup(email, password, role, name) {
    const newUser = { id: 'user_' + Date.now(), email, role, name }
    setUser(newUser)
    saveUserToStorage(newUser)
    return newUser
  }

  function login(email, password, role) {
    const user = { id: 'user_' + Date.now(), email, role, name: email.split('@')[0] }
    setUser(user)
    saveUserToStorage(user)
    return user
  }

  function logout() {
    setUser(null)
    saveUserToStorage(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

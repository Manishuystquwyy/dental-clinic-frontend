import React, { createContext, useState, useEffect } from 'react'
import { googleLogin as googleLoginApi, login as loginApi, register as registerApi, me as meApi } from '../api/auth'

// eslint-disable-next-line react-refresh/only-export-components -- Existing shared context API.
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

function saveToken(token) {
  if (token) {
    localStorage.setItem('gayatri_token', token)
  } else {
    localStorage.removeItem('gayatri_token')
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = loadUserFromStorage()
    const token = localStorage.getItem('gayatri_token')
    if (!stored || !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Finish the initial authentication check when no session is stored.
      setUser(null)
      setLoading(false)
      return
    }
    meApi()
      .then((current) => {
        if (current) {
          setUser(current)
          saveUserToStorage(current)
        } else {
          setUser(null)
          saveUserToStorage(null)
          saveToken(null)
        }
      })
      .catch(() => {
        setUser(null)
        saveUserToStorage(null)
        saveToken(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function signup(payload) {
    const response = await registerApi(payload)
    saveToken(response.token)
    setUser(response.user)
    saveUserToStorage(response.user)
    return response.user
  }

  async function login(email, password) {
    const response = await loginApi({ email, password })
    saveToken(response.token)
    setUser(response.user)
    saveUserToStorage(response.user)
    return response.user
  }

  async function loginWithGoogle(credential, profile) {
    const response = await googleLoginApi(credential, profile)
    if (!response.registrationRequired) {
      saveToken(response.token)
      setUser(response.user)
      saveUserToStorage(response.user)
    }
    return response
  }

  function logout() {
    setUser(null)
    saveUserToStorage(null)
    saveToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components -- Existing shared authentication hook API.
export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

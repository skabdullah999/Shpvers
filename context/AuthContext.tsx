"use client"

import type React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { type User, getCurrentUser, signIn, signUp, signOut } from "../lib/api"

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    async function loadUser() {
      try {
        const user = await getCurrentUser()
        setUser(user)
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    const { user, error } = await signIn(email, password)
    if (user) setUser(user)
    return { error }
  }

  const handleSignUp = async (email: string, password: string, fullName: string) => {
    const { user, error } = await signUp(email, password, fullName)
    if (user) setUser(user)
    return { error }
  }

  const handleSignOut = async () => {
    await signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

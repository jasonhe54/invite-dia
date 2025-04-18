"use client";
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner";

// Create the auth context
const AuthContext = createContext(undefined)

// Auth provider component
export function AuthProvider({
  children
}) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Initialize auth state by checking with the server
  useEffect(() => {
    const initAuth = async () => {
      await refreshAuth()
      setIsLoading(false)
    }

    initAuth()
  }, [])

  // Function to refresh auth state from the server
  const refreshAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // Important for cookies
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to refresh auth:", error)
      setUser(null)
    }
  }

  // Login function
  const login = async (email, password) => {
    setIsLoading(true)

    try {
      // Call the API route that will handle authentication
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Important for cookies
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Login failed")
      }

      // Get user data from the response
      const data = await response.json()
      setUser(data.user)

      toast.success("You have been logged in successfully.")
      return true
    } catch (error) {
      console.error("Login error:", error)
      toast.error(error instanceof Error ? error.message : "Login failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (name, email, password) => {
    setIsLoading(true)

    try {
      // Call the API route that will handle registration
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
        credentials: "include", // Important for cookies
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Registration failed")
      }

      toast.success("Your account has been created successfully.")
      return true
    } catch (error) {
      console.error("Registration error:", error)
      toast.error(error instanceof Error ? error.message : "Registration failed")
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Call the API route that will clear cookies
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Important for cookies
      })

      setUser(null)
      toast.success("You have been logged out successfully.")
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  // Auth context value
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

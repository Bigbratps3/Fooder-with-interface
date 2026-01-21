"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { User } from "./types"

interface UserContextType {
  user: User | null
  isLoading: boolean
  updateUser: (user: User) => void
  addFavorite: (mealId: string) => void
  removeFavorite: (mealId: string) => void
  updateDietaryRestrictions: (restrictions: string[]) => void
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

const DEFAULT_USER: User = {
  name: "",
  dietaryRestrictions: [],
  favorites: [],
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("fooder-user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const saveUser = (userData: User) => {
    localStorage.setItem("fooder-user", JSON.stringify(userData))
    setUser(userData)
  }

  const updateUser = (userData: User) => {
    saveUser(userData)
  }

  const addFavorite = (mealId: string) => {
    if (!user) return
    const updated = {
      ...user,
      favorites: [...user.favorites, mealId],
    }
    saveUser(updated)
  }

  const removeFavorite = (mealId: string) => {
    if (!user) return
    const updated = {
      ...user,
      favorites: user.favorites.filter((id) => id !== mealId),
    }
    saveUser(updated)
  }

  const updateDietaryRestrictions = (restrictions: string[]) => {
    if (!user) return
    const updated = {
      ...user,
      dietaryRestrictions: restrictions,
    }
    saveUser(updated)
  }

  const logout = () => {
    localStorage.removeItem("fooder-user")
    setUser(null)
  }

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        updateUser,
        addFavorite,
        removeFavorite,
        updateDietaryRestrictions,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}

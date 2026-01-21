"use client"

import { useUser } from "@/lib/user-context"
import { BottomNav } from "@/components/bottom-nav"
import { DIETARY_OPTIONS } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, LogOut, User, Settings } from "lucide-react"
import { useState } from "react"
import { redirect } from "next/navigation"

export default function ProfilePage() {
  const { user, isLoading, updateUser, updateDietaryRestrictions, logout } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl">Ładowanie...</div>
      </div>
    )
  }

  if (!user) {
    redirect("/")
  }

  const handleEditName = () => {
    setEditedName(user.name)
    setIsEditing(true)
  }

  const handleSaveName = () => {
    if (editedName.trim()) {
      updateUser({ ...user, name: editedName.trim() })
    }
    setIsEditing(false)
  }

  const toggleRestriction = (restriction: string) => {
    const newRestrictions = user.dietaryRestrictions.includes(restriction)
      ? user.dietaryRestrictions.filter((r) => r !== restriction)
      : [...user.dietaryRestrictions, restriction]
    updateDietaryRestrictions(newRestrictions)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-center">
          <Settings className="w-5 h-5 text-primary mr-2" />
          <h1 className="text-xl font-bold text-foreground">Profil</h1>
        </div>
      </header>

      <div className="pt-20 px-4 max-w-md mx-auto">
        {/* User Info */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="bg-input border-border text-foreground"
                    autoFocus
                  />
                  <Button
                    onClick={handleSaveName}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Zapisz
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                  <button onClick={handleEditName} className="text-sm text-primary hover:underline">
                    Edytuj imię
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{user.favorites.length} ulubionych</span>
            <span>{user.dietaryRestrictions.length} filtrów</span>
          </div>
        </div>

        {/* Dietary Restrictions */}
        <div className="bg-card rounded-2xl p-6 border border-border mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Preferencje dietetyczne</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Wybrane opcje będą filtrować dania pokazywane w aplikacji. Zobaczysz tylko dania pasujące do Twoich
            preferencji.
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DIETARY_OPTIONS.map((option) => {
              const isSelected = user.dietaryRestrictions.includes(option)
              return (
                <button
                  key={option}
                  onClick={() => toggleRestriction(option)}
                  className={`p-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-border text-foreground hover:border-primary"
                  }`}
                >
                  {isSelected && <Check className="w-4 h-4" />}
                  <span className={isSelected ? "" : "ml-6"}>{option}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Wyloguj się
        </Button>
      </div>

      <BottomNav />
    </main>
  )
}

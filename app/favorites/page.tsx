"use client"

import { useUser } from "@/lib/user-context"
import { mealsData } from "@/lib/meals-data"
import { BottomNav } from "@/components/bottom-nav"
import { RecipeModal } from "@/components/recipe-modal"
import { Heart, Trash2 } from "lucide-react"
import { useState } from "react"
import type { Meal } from "@/lib/types"
import Image from "next/image"
import { redirect } from "next/navigation"

export default function FavoritesPage() {
  const { user, isLoading, removeFavorite } = useUser()
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)

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

  const favoriteMeals = mealsData.filter((meal) => user.favorites.includes(meal.id))

  const categoryLabel = {
    breakfast: "Śniadanie",
    lunch: "Obiad",
    dinner: "Kolacja",
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-center">
          <Heart className="w-5 h-5 text-primary mr-2" />
          <h1 className="text-xl font-bold text-foreground">Ulubione</h1>
        </div>
      </header>

      <div className="pt-20 px-4 max-w-md mx-auto">
        {favoriteMeals.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Brak ulubionych</h2>
            <p className="text-muted-foreground">Przesuń w prawo na stronie głównej, aby dodać dania do ulubionych</p>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteMeals.map((meal) => (
              <div key={meal.id} className="bg-card rounded-2xl overflow-hidden border border-border flex">
                <button onClick={() => setSelectedMeal(meal)} className="flex-1 flex text-left">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image src={meal.image || "/placeholder.svg"} alt={meal.name} fill className="object-cover" />
                  </div>
                  <div className="p-3 flex-1">
                    <span className="text-xs text-primary font-medium">{categoryLabel[meal.category]}</span>
                    <h3 className="font-semibold text-foreground">{meal.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{meal.description}</p>
                  </div>
                </button>
                <button
                  onClick={() => removeFavorite(meal.id)}
                  className="px-4 flex items-center text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <RecipeModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
      <BottomNav />
    </main>
  )
}

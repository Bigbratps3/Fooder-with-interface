"use client"

import { useState, useMemo, useCallback } from "react"
import { useUser } from "@/lib/user-context"
import { mealsData } from "@/lib/meals-data"
import { MealCard } from "@/components/meal-card"
import { RecipeModal } from "@/components/recipe-modal"
import type { Meal } from "@/lib/types"
import { RefreshCw, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"

type MealCategory = "all" | "breakfast" | "lunch" | "dinner"

export function SwipeCards() {
  const { user, addFavorite } = useUser()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null)
  const [swipedIds, setSwipedIds] = useState<Set<string>>(new Set())
  const [category, setCategory] = useState<MealCategory>("all")

  const filteredMeals = useMemo(() => {
    let meals = mealsData

    // Filter by category
    if (category !== "all") {
      meals = meals.filter((meal) => meal.category === category)
    }

    // Filter by dietary restrictions
    if (user?.dietaryRestrictions && user.dietaryRestrictions.length > 0) {
      meals = meals.filter((meal) => user.dietaryRestrictions.every((restriction) => meal.tags.includes(restriction)))
    }

    // Filter out already swiped meals
    meals = meals.filter((meal) => !swipedIds.has(meal.id))

    return meals
  }, [user?.dietaryRestrictions, swipedIds, category])

  const currentMeal = filteredMeals[0]

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (!currentMeal) return

      if (direction === "right") {
        addFavorite(currentMeal.id)
      }

      setSwipedIds((prev) => new Set(prev).add(currentMeal.id))
      setCurrentIndex((prev) => prev + 1)
    },
    [currentMeal, addFavorite],
  )

  const resetCards = () => {
    setSwipedIds(new Set())
    setCurrentIndex(0)
  }

  const categories: { value: MealCategory; label: string }[] = [
    { value: "all", label: "Wszystkie" },
    { value: "breakfast", label: "Śniadanie" },
    { value: "lunch", label: "Obiad" },
    { value: "dinner", label: "Kolacja" },
  ]

  return (
    <div className="flex flex-col items-center">
      {/* Category Filter */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => {
              setCategory(cat.value)
              setSwipedIds(new Set())
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat.value ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="relative w-full h-[500px] flex items-center justify-center">
        {currentMeal ? (
          <MealCard meal={currentMeal} onSwipe={handleSwipe} onTap={() => setSelectedMeal(currentMeal)} />
        ) : (
          <div className="text-center p-8 bg-card rounded-2xl">
            <Utensils className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">Brak więcej dań</h3>
            <p className="text-muted-foreground mb-4">Przejrzałeś wszystkie dostępne propozycje w tej kategorii</p>
            <Button onClick={resetCards} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <RefreshCw className="w-4 h-4 mr-2" />
              Zacznij od nowa
            </Button>
          </div>
        )}
      </div>

      {/* Swipe Hints */}
      {currentMeal && (
        <div className="flex justify-between w-full max-w-xs mt-4 text-sm text-muted-foreground">
          <span>← Pomiń</span>
          <span>Kliknij = przepis</span>
          <span>Lubię →</span>
        </div>
      )}

      {/* Recipe Modal */}
      <RecipeModal meal={selectedMeal} onClose={() => setSelectedMeal(null)} />
    </div>
  )
}

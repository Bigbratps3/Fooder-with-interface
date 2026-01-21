"use client"

import type { Meal } from "@/lib/types"
import { X, Clock, Users, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface RecipeModalProps {
  meal: Meal | null
  onClose: () => void
}

export function RecipeModal({ meal, onClose }: RecipeModalProps) {
  if (!meal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card w-full max-w-md max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-border">
        {/* Header Image */}
        <div className="relative h-48">
          <Image src={meal.image || "/placeholder.svg"} alt={meal.name} fill className="object-cover" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-full"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">{meal.name}</h2>
          <p className="text-muted-foreground mb-4">{meal.description}</p>

          {/* Quick Info */}
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4 text-primary" />
              <span>Przygotowanie: {meal.recipe.prepTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ChefHat className="w-4 h-4 text-primary" />
              <span>Gotowanie: {meal.recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary" />
              <span>{meal.recipe.servings} porcji</span>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Składniki</h3>
            <ul className="space-y-2">
              {meal.recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center gap-3 text-foreground">
                  <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-3">Przygotowanie</h3>
            <ol className="space-y-3">
              {meal.recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3 text-foreground">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          <Button onClick={onClose} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Zamknij
          </Button>
        </div>
      </div>
    </div>
  )
}

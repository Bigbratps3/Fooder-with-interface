export interface Meal {
  id: string
  name: string
  description: string
  image: string
  category: "breakfast" | "lunch" | "dinner"
  tags: string[]
  recipe: {
    ingredients: string[]
    instructions: string[]
    prepTime: string
    cookTime: string
    servings: number
  }
}

export interface User {
  name: string
  dietaryRestrictions: string[]
  favorites: string[]
}

export const DIETARY_OPTIONS = [
  "Wegetariańskie",
  "Wegańskie",
  "Bezglutenowe",
  "Bez laktozy",
  "Bez orzechów",
  "Keto",
  "Niskokaloryczne",
  "Wysokobiałkowe",
] as const

"use client"

import { useState } from "react"
import { useUser } from "@/lib/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DIETARY_OPTIONS } from "@/lib/types"
import { Check, ChefHat } from "lucide-react"

export function LoginPrompt() {
  const { updateUser } = useUser()
  const [step, setStep] = useState(1)
  const [name, setName] = useState("")
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>([])

  const toggleRestriction = (restriction: string) => {
    setSelectedRestrictions((prev) =>
      prev.includes(restriction) ? prev.filter((r) => r !== restriction) : [...prev, restriction],
    )
  }

  const handleSubmit = () => {
    updateUser({
      name,
      dietaryRestrictions: selectedRestrictions,
      favorites: [],
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <ChefHat className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            <span className="text-primary">Food</span>er
          </h1>
          <p className="text-muted-foreground">Odkryj swoje ulubione dania</p>
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Jak masz na imię?</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Twoje imię"
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Dalej
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Wybierz swoje preferencje dietetyczne (opcjonalne)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {DIETARY_OPTIONS.map((option) => {
                  const isSelected = selectedRestrictions.includes(option)
                  return (
                    <button
                      key={option}
                      onClick={() => toggleRestriction(option)}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all flex items-center gap-2 ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-card border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4" />}
                      <span className={isSelected ? "" : "ml-6"}>{option}</span>
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 border-border text-foreground hover:bg-muted"
              >
                Wstecz
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                Rozpocznij
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useRef } from "react"
import type { Meal } from "@/lib/types"
import { Heart, X } from "lucide-react"
import Image from "next/image"

interface MealCardProps {
  meal: Meal
  onSwipe: (direction: "left" | "right") => void
  onTap: () => void
}

export function MealCard({ meal, onSwipe, onTap }: MealCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [wasDragged, setWasDragged] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true)
    setWasDragged(false)
    setStartPos({ x: clientX, y: clientY })
  }

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return
    const deltaX = clientX - startPos.x
    const deltaY = clientY - startPos.y
    setPosition({ x: deltaX, y: deltaY })
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      setWasDragged(true)
    }
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 100
    if (position.x > threshold) {
      onSwipe("right")
    } else if (position.x < -threshold) {
      onSwipe("left")
    }
    setPosition({ x: 0, y: 0 })
  }

  const handleClick = () => {
    if (!wasDragged && Math.abs(position.x) < 10 && Math.abs(position.y) < 10) {
      onTap()
    }
  }

  const rotation = position.x * 0.1
  const opacity = Math.max(0, 1 - Math.abs(position.x) / 300)

  const categoryLabel = {
    breakfast: "Śniadanie",
    lunch: "Obiad",
    dinner: "Kolacja",
  }[meal.category]

  return (
    <div
      ref={cardRef}
      className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing touch-none select-none"
      style={{
        transform: `translateX(${position.x}px) translateY(${position.y}px) rotate(${rotation}deg)`,
        opacity,
        transition: isDragging ? "none" : "all 0.3s ease-out",
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        handleStart(e.clientX, e.clientY)
      }}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
      onClick={handleClick}
    >
      {/* Swipe Indicators */}
      <div
        className="absolute top-8 left-8 z-10 bg-destructive text-destructive-foreground px-4 py-2 rounded-lg font-bold text-xl rotate-[-20deg] border-2 border-destructive-foreground pointer-events-none"
        style={{ opacity: Math.max(0, -position.x / 100) }}
      >
        <X className="w-8 h-8" />
      </div>
      <div
        className="absolute top-8 right-8 z-10 bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xl rotate-[20deg] border-2 border-white pointer-events-none"
        style={{ opacity: Math.max(0, position.x / 100) }}
      >
        <Heart className="w-8 h-8" />
      </div>

      <div className="bg-card rounded-3xl overflow-hidden shadow-2xl border border-border pointer-events-none">
        <div className="relative h-72">
          <Image
            src={meal.image || "/placeholder.svg"}
            alt={meal.name}
            fill
            className="object-cover pointer-events-none select-none"
            draggable={false}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              {categoryLabel}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">{meal.name}</h2>
          <p className="text-muted-foreground leading-relaxed">{meal.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            {meal.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

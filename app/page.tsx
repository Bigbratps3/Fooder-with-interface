"use client"

import { useUser } from "@/lib/user-context"
import { BottomNav } from "@/components/bottom-nav"
import { SwipeCards } from "@/components/swipe-cards"
import { LoginPrompt } from "@/components/login-prompt"

export default function HomePage() {
  const { user, isLoading } = useUser()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary text-xl">Ładowanie...</div>
      </div>
    )
  }

  if (!user) {
    return <LoginPrompt />
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-center">
          <h1 className="text-2xl font-bold text-foreground">
            <span className="text-primary">Food</span>er
          </h1>
        </div>
      </header>
      <div className="pt-20 px-4 max-w-md mx-auto">
        <SwipeCards />
      </div>
      <BottomNav />
    </main>
  )
}

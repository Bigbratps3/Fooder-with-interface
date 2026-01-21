"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Heart, User } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  const links = [
    { href: "/", icon: Home, label: "Odkrywaj" },
    { href: "/favorites", icon: Heart, label: "Ulubione" },
    { href: "/profile", icon: User, label: "Profil" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

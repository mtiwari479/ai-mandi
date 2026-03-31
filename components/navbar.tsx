"use client"

import Link from "next/link"
import { Bot, Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { name: "Dashboard", href: "/", active: true },
  { name: "Agents", href: "/agents", active: false },
  { name: "Pricing", href: "/pricing", active: false },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
              <Bot className="h-5 w-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">AI Mandi</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                  item.active
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary border border-border text-muted-foreground text-sm cursor-pointer hover:border-accent/50 transition-colors">
            <Search className="h-4 w-4" />
            <span>Search agents...</span>
            <kbd className="ml-4 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-secondary">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Avatar className="h-9 w-9 border-2 border-border">
            <AvatarFallback className="bg-accent text-accent-foreground text-sm font-medium">AM</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

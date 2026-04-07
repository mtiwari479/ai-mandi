"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { name: "Dashboard", href: "/", active: true },
  { name: "Agents", href: "/agents", active: false },
  { name: "Pricing", href: "/pricing", active: false },
];

export function Navbar({
  search,
  setSearch,
}: {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LEFT */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg overflow-hidden">
              <Image
                src="/prism.png"
                alt="Logo"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>

            <span className="text-lg font-semibold tracking-tight">
              Myrefrence<span className="text-red-500">.</span>
            </span>
          </Link>

          {/* NAV */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  item.active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* SEARCH */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted w-[220px] md:w-[280px] focus-within:ring-2 focus-within:ring-ring transition">
            <Search className="h-4 w-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-foreground"
            />

            <span className="text-xs text-muted-foreground border border-border px-2 py-0.5 rounded-md">
              ⌘
            </span>
          </div>

          {/* MOBILE SEARCH */}
          <button className="sm:hidden p-2 rounded-md hover:bg-muted transition">
            <Search className="h-5 w-5 text-muted-foreground" />
          </button>

          {/* THEME TOGGLE */}
          <ThemeToggle />

          {/* NOTIFICATION */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* AVATAR */}
          <Avatar className="h-9 w-9 border-2 border-border">
            <AvatarFallback>AM</AvatarFallback>
          </Avatar>

        </div>
      </div>
    </header>
  );
}
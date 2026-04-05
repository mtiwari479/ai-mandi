"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Zap,
  Crown,
  Bug,
  Search,
  FileUser,
  CalendarCheck,
  MessagesSquare
} from "lucide-react"

const iconMap = {
  bug: Bug,
  search: Search,
  fileUser: FileUser,
  calendarCheck: CalendarCheck,
  messagesSquare: MessagesSquare,
} as const

type IconName = keyof typeof iconMap

interface AgentCardProps {
  name: string
  description: string
  iconName: IconName
  category: string
  usageCount?: string
  href?: string;
  status: "active" | "inactive" | "premium"
}

export function AgentCard({
  name,
  description,
  iconName,
  category,
  usageCount,
  status,
  href,
}: AgentCardProps) {
  const Icon = iconMap[iconName]

  return (

    <Card className="group relative overflow-hidden border-border bg-card transition-all duration-300 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5 cursor-pointer">

      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon className="h-6 w-6" />
          </div>

          {status === "active" && (
            <Badge className="border-0 bg-green-100 text-green-600">
              🔥 Live
            </Badge>
          )}

          {status === "premium" && (
            <Badge className="border-0 bg-amber-500/20 text-amber-400">
              <Crown className="mr-1 h-3 w-3" />
              Pro
            </Badge>
          )}

          {status === "inactive" && (
            <Badge variant="outline" className="border-border text-muted-foreground">
              Coming Soon
            </Badge>
          )}
        </div>

        <h3 className="mb-2 text-lg font-semibold text-card-foreground">{name}</h3>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground line-clamp-2">{description}</p>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {category}
          </span>

          {usageCount && (
            <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
              {usageCount}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center gap-2 border-t border-border bg-secondary/30 px-6 py-4">

        <Link href={href || "#"} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            Try Now
          </Button>
        </Link>

        <Button size="sm" className="flex-1 bg-accent text-accent-foreground">
          Buy
        </Button>
      </CardFooter>

    </Card>

  )
}

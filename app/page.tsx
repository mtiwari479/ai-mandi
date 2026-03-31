import { Navbar } from "@/components/navbar"
import { AgentCard } from "@/components/agent-card"
import { Sparkles } from "lucide-react"

const agents = [
  {
    name: "Defect AI",
    description: "Automatically detect and analyze software defects with intelligent root cause suggestions and bug tracking integration.",
    iconName: "bug" as const,
    category: "Quality Assurance",
    usageCount: "2.4K uses",
    status: "active" as const,
  },
  {
    name: "RCA Pro",
    description: "Advanced root cause analysis powered by AI. Identify issues faster with automated log parsing and correlation analysis.",
    iconName: "search" as const,
    category: "Analytics",
    usageCount: "1.8K uses",
    status: "premium" as const,
  },
  {
    name: "Resume AI",
    description: "Parse, analyze, and score resumes instantly. Extract key information and match candidates to job requirements.",
    iconName: "fileUser" as const,
    category: "HR & Recruitment",
    usageCount: "5.2K uses",
    status: "active" as const,
  },
  {
    name: "PlanMate",
    description: "Intelligent project planning assistant. Generate timelines, allocate resources, and predict potential roadblocks.",
    iconName: "calendarCheck" as const,
    category: "Project Management",
    usageCount: "980 uses",
    status: "inactive" as const,
  },
  {
    name: "E-mail AutoReply",
    description: "Smart email and message automation. Draft contextual responses and manage communications efficiently.",
    iconName: "messagesSquare" as const,
    category: "Communication",
    usageCount: "3.1K uses",
    status: "active" as const,
  },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Agent Marketplace</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            Discover and deploy powerful AI agents to automate your workflows. Browse our collection of production-ready intelligent assistants.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-2xl font-bold text-foreground">24</p>
            <p className="text-sm text-muted-foreground">Total Agents</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-2xl font-bold text-accent">5</p>
            <p className="text-sm text-muted-foreground">Active Agents</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-2xl font-bold text-foreground">1.2K</p>
            <p className="text-sm text-muted-foreground">API Calls Today</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <p className="text-2xl font-bold text-foreground">0.8s</p>
            <p className="text-sm text-muted-foreground">Avg Response</p>
          </div>
        </div>

        {/* Section Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-1">Featured Agents</h2>
          <p className="text-sm text-muted-foreground">
            Browse and activate AI agents for your workspace
          </p>
        </div>

        {/* Agent Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <AgentCard 
              key={agent.name} 
              name={agent.name}
              description={agent.description}
              iconName={agent.iconName}
              category={agent.category}
              usageCount={agent.usageCount}
              status={agent.status}
            />
          ))}
        </div>
      </main>
    </div>
  )
}

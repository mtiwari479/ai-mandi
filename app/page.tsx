"use client";

import { Navbar } from "@/components/navbar";
import { AgentCard } from "@/components/agent-card";
import { Sparkles, Clock } from "lucide-react";

const agents = [
  {
    name: "8D/CAPA Man",
    description:
      "OEM-grade 8D report generator with deep root cause analysis, fishbone logic & corrective actions.",
    href: "/rca",
    iconName: "search" as const,
    category: "Core Quality Tool",
    usageCount: "🔥 Live",
    status: "active" as const,
    highlight: true,
  },
  {
    name: "Defect AI",
    description: "Automated defect detection and RCA suggestions.",
    iconName: "bug" as const,
    category: "Quality Assurance",
    usageCount: "Coming Soon",
    status: "inactive" as const,
  },
  {
    name: "Resume AI",
    description: "AI-powered resume analysis and matching.",
    iconName: "fileUser" as const,
    category: "HR",
    usageCount: "Coming Soon",
    status: "inactive" as const,
  },
  {
    name: "SwitchBuddy",
    description: "Career decision support assistant.",
    iconName: "calendarCheck" as const,
    category: "Career Planning",
    usageCount: "Coming Soon",
    status: "inactive" as const,
  },
];

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20">
              <Sparkles className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              AI Quality Platform
            </h1>
          </div>

          <p className="text-muted-foreground max-w-2xl text-lg">
            Start with powerful 8D root cause analysis. More AI tools coming soon.
          </p>
        </div>

        {/* HERO CARD */}
        <div className="mb-10 rounded-2xl border bg-gradient-to-r from-accent/20 to-purple-500/10 p-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                🚀 8D/CAPA Man is Live
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Generate OEM-level 8D reports instantly with AI.
              </p>
            </div>

            <a
              href="/rca"
              className="px-6 py-2 rounded-lg bg-accent text-white font-medium hover:opacity-90 transition"
            >
              Launch →
            </a>
          </div>
        </div>

        {/* SECTION */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">Available Agents</h2>
          <p className="text-sm text-muted-foreground">
            Currently available and upcoming tools
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className={
                agent.highlight
                  ? "ring-2 ring-accent rounded-xl"
                  : "opacity-70"
              }
            >
              <AgentCard {...agent} />
              
              {/* Coming Soon Badge */}
              {agent.status === "inactive" && (
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2 px-2">
                  <Clock size={14} />
                  Coming Soon
                </div>
              )}
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
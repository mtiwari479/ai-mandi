"use client";

import { Navbar } from "@/components/navbar";
import { AgentCard } from "@/components/agent-card";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { Footer } from "@/components/footer";
import { useState } from "react";

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
    name: "SwitchBuddy",
    description:
      "AI-powered career switch advisor with salary, growth & risk analysis.",
    iconName: "calendarCheck" as const,
    category: "Career Planning",
    usageCount: "🔥 Live",
    status: "active" as const,
    href: "/switchbuddy",
    highlight: true,
    isNew: true,
  },
  {
    name: "Travel Planner",
    description:
      "AI-powered multimodal route generator using trains, buses & taxis with real APIs.",
    iconName: "bug" as const,
    category: "Travel & Logistics",
    usageCount: "🔥 Live",
    status: "active" as const,
    href: "/travel-planner",
    highlight: true,
    isNew: true,
  },
];

export default function Page() {
  const [search, setSearch] = useState("");

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(search.toLowerCase()) ||
    agent.description.toLowerCase().includes(search.toLowerCase()) ||
    agent.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar search={search} setSearch={setSearch} />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
              <Sparkles className="h-6 w-6 text-foreground" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">
              AI Agent Marketplace
            </h1>
          </div>

          <p className="text-muted-foreground max-w-2xl text-lg">
            Start with powerful 8D root cause analysis. More AI tools coming soon.
          </p>
        </div>

        {/* HERO CARD */}
        <div className="mb-10 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition p-6 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-start gap-4">
            <div className="relative flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              <span className="absolute h-2 w-2 rounded-full bg-green-500 animate-ping opacity-75"></span>
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Featured Agent: <span className="text-green-500">8D/CAPA Man</span>
              </h2>

              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Generate OEM-level 8D reports instantly with AI.
              </p>
            </div>
          </div>

          {/* RIGHT BUTTON */}
          <a
            href="/rca"
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-green-500/30 text-green-500 text-sm font-medium hover:bg-green-500/10 transition"
          >
            Launch
            <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
        </div>

        {/* SECTION */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            Available Agents
          </h2>

          <p className="text-sm text-muted-foreground">
            Currently available and upcoming tools
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAgents.map((agent) => (
            <div
              key={agent.name}
              className={`rounded-xl transition ${
                agent.highlight
                  ? "border border-border bg-card shadow-sm"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              <AgentCard {...agent} />
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </div>
  );
}
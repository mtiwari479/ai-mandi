"use client";

import { Navbar } from "@/components/navbar";
import { AgentCard } from "@/components/agent-card";
import { Sparkles, Clock } from "lucide-react";
import { Footer } from "@/components/footer";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { is } from "date-fns/locale";

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
    highlight: true, // ✅ IMPORTANT
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
const highlightText = (text: string, query: string) => {
  if (!query) return text;

  const parts = text.split(new RegExp(`(${query})`, "gi"));

  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={i} className="bg-yellow-200 text-black rounded px-0.5">
        {part}
      </span>
    ) : (
      part
    )
  );
};
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-cyan-50">
      <Navbar search={search} setSearch={setSearch}/>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20">
              <Sparkles className="h-6 w-6 text-accent" />
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
        <div className="mb-10 rounded-2xl border border-border bg-white shadow-sm hover:shadow-md transition p-6 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-start gap-4">

            {/* Icon instead of weak dot */}
            <div className="relative flex items-center justify-center">
              <span className="h-2 w-2 rounded-full bg-accent"></span>
              <span className="absolute h-2 w-2 rounded-full bg-accent animate-ping opacity-75"></span>
            </div>

            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Featured Agent: <span className="text-accent">8D/CAPA Man</span>
              </h2>

              <p className="text-sm text-muted-foreground mt-1 max-w-md">
                Generate OEM-level 8D reports instantly with AI.
              </p>
            </div>

          </div>

          {/* RIGHT BUTTON */}
          <a
            href="/rca"
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-accent/30 text-accent text-sm font-medium hover:bg-accent/10 transition"
          >
            Launch
            <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition" />
          </a>
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
          {filteredAgents.map((agent) => (
            <div
              key={agent.name}
              className={`rounded-xl transition ${agent.highlight
                ? "border border-accent/40 bg-white shadow-sm"
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

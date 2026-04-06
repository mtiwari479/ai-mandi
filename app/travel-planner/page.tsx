"use client";

import { useState } from "react";
import {
  TrainFront,
  Bus,
  ArrowRight,
  Clock3,
  IndianRupee,
  MapPin,
  CalendarDays,
} from "lucide-react";

type Segment = {
  mode: "train" | "bus";
  transport_id: string | null;
  name_or_operator: string | null;
  from: string;
  to: string;
  departure: string | null;
  arrival: string | null;
  availability: string[] | string | null;
  estimated_cost: string | null;
};

type RouteItem = {
  category: "ECONOMY" | "MEDIUM" | "PREMIUM" | string;
  total_duration: string;
  estimated_cost: string | null;
  why_selected: string;
  segments: Segment[];
};

type PlannerResponse = {
  query?: {
    source: string;
    destination: string;
    date: string;
    start: string;
  };
  routes?: RouteItem[];
  notes?: string;
  explanation?: string;
  generated_with?: {
    distance_km?: number | null;
    distance_text?: string | null;
    train_count?: number;
    bus_count?: number;
    disclaimer?: string;
  };
  error?: string;
};

function getCategoryStyles(category: string) {
  if (category === "ECONOMY") return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (category === "MEDIUM") return "bg-amber-50 text-amber-700 border-amber-200";
  if (category === "PREMIUM") return "bg-sky-50 text-sky-700 border-sky-200";
  return "bg-slate-50 text-slate-700 border-slate-200";
}

function ModeIcon({ mode }: { mode: "train" | "bus" }) {
  return mode === "train" ? (
    <TrainFront className="h-5 w-5" />
  ) : (
    <Bus className="h-5 w-5" />
  );
}

export default function TravelPlanner() {
  const [form, setForm] = useState({
    source: "",
    destination: "",
    date: "",
    startTime: "06:00",
  });

  const [output, setOutput] = useState<PlannerResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOutput(null);

    try {
      const res = await fetch("/api/travel-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      setOutput(json);
    } catch (err) {
      console.error(err);
      setOutput({ error: "Request failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Multimodal Travel Planner</h1>
        <p className="mt-2 text-sm text-slate-600">
          Compare train and bus routes with segment breakdowns and transfer details.
        </p>
      </div>

      <form onSubmit={submit} className="mb-8 grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-2">
        <input
          type="text"
          placeholder="Source city"
          value={form.source}
          onChange={(e) => setForm({ ...form, source: e.target.value })}
          className="rounded-xl border px-4 py-3 outline-none focus:border-teal-500"
          required
        />
        <input
          type="text"
          placeholder="Destination city"
          value={form.destination}
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
          className="rounded-xl border px-4 py-3 outline-none focus:border-teal-500"
          required
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="rounded-xl border px-4 py-3 outline-none focus:border-teal-500"
          required
        />
        <input
          type="time"
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          className="rounded-xl border px-4 py-3 outline-none focus:border-teal-500"
          required
        />
        <button
          disabled={loading}
          className="md:col-span-2 rounded-xl bg-teal-600 px-4 py-3 font-medium text-white transition hover:bg-teal-700 disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate Routes"}
        </button>
      </form>

      {output?.error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
          {output.error}
        </div>
      )}

      {output && !output.error && (
        <div className="space-y-6">
          {output.query && (
            <div className="grid gap-3 rounded-2xl border bg-slate-50 p-4 md:grid-cols-4">
              <div>
                <div className="text-xs uppercase text-slate-500">From</div>
                <div className="font-semibold">{output.query.source}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-500">To</div>
                <div className="font-semibold">{output.query.destination}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-500">Date</div>
                <div className="font-semibold">{output.query.date}</div>
              </div>
              <div>
                <div className="text-xs uppercase text-slate-500">Start</div>
                <div className="font-semibold">{output.query.start}</div>
              </div>
            </div>
          )}

          {output.routes && output.routes.length > 0 ? (
            output.routes.map((route, routeIndex) => (
              <article key={routeIndex} className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                <div className="border-b bg-slate-50 p-5">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${getCategoryStyles(route.category)}`}>
                        {route.category}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-slate-600">
                        <Clock3 className="h-4 w-4" />
                        {route.total_duration}
                      </span>
                      {route.estimated_cost && (
                        <span className="flex items-center gap-1 text-sm text-slate-600">
                          <IndianRupee className="h-4 w-4" />
                          {route.estimated_cost}
                        </span>
                      )}
                    </div>
                    <p className="max-w-2xl text-sm text-slate-600">{route.why_selected}</p>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  {route.segments.map((segment, segmentIndex) => (
                    <div key={segmentIndex}>
                      {segmentIndex > 0 && (
                        <div className="mb-4 ml-6 rounded-xl border border-dashed border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-700">
                          Layover / transfer before next segment
                        </div>
                      )}

                      <div className="rounded-2xl border p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-teal-100 p-2 text-teal-700">
                              <ModeIcon mode={segment.mode} />
                            </div>
                            <div>
                              <div className="font-semibold capitalize">
                                {segment.mode} {segment.transport_id ? `• ${segment.transport_id}` : ""}
                              </div>
                              <div className="text-sm text-slate-500">
                                {segment.name_or_operator || "Transport details"}
                              </div>
                            </div>
                          </div>

                          {segment.estimated_cost && (
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <IndianRupee className="h-4 w-4" />
                              {segment.estimated_cost}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-xs uppercase text-slate-500">Departure</div>
                            <div className="mt-1 font-semibold">{segment.from}</div>
                            <div className="text-sm text-slate-600">{segment.departure || "Time unavailable"}</div>
                          </div>

                          <div className="flex justify-center text-slate-400">
                            <ArrowRight className="h-5 w-5" />
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <div className="text-xs uppercase text-slate-500">Arrival</div>
                            <div className="mt-1 font-semibold">{segment.to}</div>
                            <div className="text-sm text-slate-600">{segment.arrival || "Time unavailable"}</div>
                          </div>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div className="rounded-xl border p-3">
                            <div className="mb-1 flex items-center gap-2 text-xs uppercase text-slate-500">
                              <MapPin className="h-4 w-4" />
                              Availability
                            </div>
                            <div className="text-sm text-slate-700">
                              {Array.isArray(segment.availability)
                                ? segment.availability.join(", ")
                                : segment.availability || "Not provided"}
                            </div>
                          </div>

                          <div className="rounded-xl border p-3">
                            <div className="mb-1 flex items-center gap-2 text-xs uppercase text-slate-500">
                              <CalendarDays className="h-4 w-4" />
                              Segment details
                            </div>
                            <div className="text-sm text-slate-700">
                              {segment.from} to {segment.to}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border bg-slate-50 p-6">
              <h2 className="text-lg font-semibold">No routes found</h2>
              <p className="mt-2 text-sm text-slate-600">{output.notes}</p>
              <p className="mt-1 text-sm text-slate-500">{output.explanation}</p>
            </div>
          )}

          {output.generated_with && (
            <div className="rounded-2xl border bg-white p-4 text-sm text-slate-600">
              <div>Distance: {output.generated_with.distance_text || "Unavailable"}</div>
              <div>Train options: {output.generated_with.train_count ?? 0}</div>
              <div>Bus options: {output.generated_with.bus_count ?? 0}</div>
              <div className="mt-2 text-xs text-slate-500">
                {output.generated_with.disclaimer}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

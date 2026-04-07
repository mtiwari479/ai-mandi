"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function RCA() {
  const [input, setInput] = useState("");
  const [department, setDepartment] = useState("");
  const [part, setPart] = useState("");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!input.trim()) {
      alert("Please enter a problem");
      return;
    }

    setLoading(true);
    setReport(null);

    try {
      const res = await fetch("/api/rca", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem: input, department, part }),
      });

      const data = await res.json();

      if (!data?.result) {
        alert("No data received");
        return;
      }

      const parsed = JSON.parse(data.result);
      setReport(parsed);
    } catch (err) {
      console.error(err);
      alert("Error generating report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-10">
      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            8D / CAPA Report
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            OEM Standard Root Cause Analysis Sheet
          </p>
        </div>

        {/* FORM */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-4">

          <textarea
            placeholder="Enter Problem Statement..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-background border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring outline-none"
          />

          <input
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-background border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground"
          />

          <input
            placeholder="Part Name"
            value={part}
            onChange={(e) => setPart(e.target.value)}
            className="w-full bg-background border border-border rounded-xl p-3 text-foreground placeholder:text-muted-foreground"
          />

          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 rounded-xl font-medium bg-accent text-accent-foreground hover:opacity-90"
          >
            {loading ? "Generating..." : "Generate OEM 8D Report"}
          </Button>

          {loading && (
            <p className="text-sm text-muted-foreground">⏳ AI analyzing...</p>
          )}
        </div>

        {/* REPORT */}
        {report && (
          <div className="mt-10 space-y-6">

            <Section title="D1: Team">
              {report.d1_team?.join(", ") || "N/A"}
            </Section>

            <Section title="D2: Problem Description">
              <Table data={report.d2_problem} />
            </Section>

            <Section title="D3: Containment Actions">
              <List data={report.d3_containment?.sorting} />
            </Section>

            <Section title="D4: Root Cause Analysis">
              <Table data={report.d4_root_cause?.fishbone} />
              <h4 className="mt-4 font-medium text-foreground">5 Why Analysis</h4>
              <List data={report.d4_root_cause?.occurrence_why?.chain} />
            </Section>

            <Section title="D5: Corrective Actions">
              <D5Table data={report.d5_corrective?.actions} />
            </Section>

            <Section title="D6: Validation">
              <D6Charts data={report.d6_validation} />
            </Section>

            <Section title="D7: Preventive Action">
              <D7Table data={report.d7_preventive} />
            </Section>

            <Section title="D8: Closure">
              <Table data={report.d8_closure} />
            </Section>

          </div>
        )}
      </div>
    </div>
  );
}

/* SECTION */
function Section({ title, children }: any) {
  return (
    <div className="bg-card border border-border rounded-xl shadow-md">
      <div className="px-4 py-2 border-b border-border text-sm font-semibold text-muted-foreground">
        {title}
      </div>
      <div className="p-4 text-foreground">{children}</div>
    </div>
  );
}

/* TABLE */
function Table({ data }: any) {
  if (!data) return <p className="text-muted-foreground">N/A</p>;

  return (
    <table className="w-full text-sm">
      <tbody>
        {Object.entries(data).map(([key, value]: any) => (
          <tr key={key} className="border-b border-border">
            <td className="p-3 text-muted-foreground w-1/3 capitalize">
              {key.replaceAll("_", " ")}
            </td>
            <td className="p-3 text-foreground">
              {Array.isArray(value)
                ? value.join(", ")
                : value || "N/A"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* LIST */
function List({ data }: any) {
  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">N/A</p>;
  }

  return (
    <ul className="list-disc ml-6 text-muted-foreground space-y-1">
      {data.map((item: string, i: number) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/* D5 TABLE */
function D5Table({ data }: any) {
  if (!data) return null;

  return (
    <table className="w-full text-sm border border-border rounded-lg">
      <thead className="bg-muted">
        <tr>
          <th className="p-2 text-left">Action</th>
          <th className="p-2 text-left">Owner</th>
          <th className="p-2 text-left">Target</th>
          <th className="p-2 text-left">Validation</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item: any, i: number) => (
          <tr key={i} className="border-t border-border">
            <td className="p-2">{item.action}</td>
            <td className="p-2">{item.responsibility}</td>
            <td className="p-2">{item.target_date}</td>
            <td className="p-2">{item.validation}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* D7 TABLE */
function D7Table({ data }: any) {
  if (!data) return null;

  return (
    <div className="text-muted-foreground">
      Preventive actions implemented.
    </div>
  );
}

/* CHARTS */
function D6Charts({ data }: any) {
  const trendData = data?.trend || [];
  const comparisonData = data?.comparison || [];

  return (
    <div className="space-y-6 mt-4">

      <div className="h-64 bg-card border border-border rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="defect" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="h-64 bg-card border border-border rounded-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
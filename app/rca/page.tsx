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
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-cyan-50 py-10">
      <div className="max-w-5xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">
            8D / CAPA Report
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            OEM Standard Root Cause Analysis Sheet
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white/70 backdrop-blur-xl border border-gray-200 
        rounded-2xl p-6 shadow-xl space-y-4">

          <textarea
            placeholder="Enter Problem Statement..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl p-3
            text-gray-900 placeholder:text-gray-400
            focus:ring-2 focus:ring-blue-400 outline-none transition"
          />

          <input
            placeholder="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl p-3
            text-gray-900 placeholder:text-gray-400
            focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            placeholder="Part Name"
            value={part}
            onChange={(e) => setPart(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl p-3
            text-gray-900 placeholder:text-gray-400
            focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full py-3 rounded-xl text-white font-medium
            bg-gradient-to-r from-blue-500 to-cyan-500
            hover:opacity-90 transition shadow-md"
          >
            {loading ? "Generating..." : "Generate OEM 8D Report"}
          </Button>

          {loading && (
            <p className="text-sm text-gray-500">⏳ AI analyzing...</p>
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

              <h4 className="mt-4 font-medium text-gray-700">5 Why Analysis</h4>
              <List data={report.d4_root_cause?.occurrence_why?.chain} />

              <p className="mt-2 text-sm text-gray-800">
                <b>Root Cause:</b>{" "}
                {report.d4_root_cause?.occurrence_why?.root_cause || "N/A"}
              </p>
            </Section>

            <Section title="D5: Develop Permanent Corrective Action/Solution">
            <D5Table data={report.d5_corrective?.actions} />
            </Section>

            <Section title="D6: Validation">

              {/* Only show normal fields */}
              <Table
                data={{
                  summary: report.d6_validation?.summary || "Validation completed",
                  result: report.d6_validation?.result || "Improvement observed"
                }}
              />

              <D6Charts data={report.d6_validation} />

            </Section>

            <Section title="D7: Implement Preventive Action">
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-md">
      <div className="px-4 py-2 border-b border-gray-200 text-sm font-semibold text-gray-500">
        {title}
      </div>
      <div className="p-4 text-gray-800">{children}</div>
    </div>
  );
}

/* TABLE */
function Table({ data }: any) {
  if (!data) return <p className="text-gray-500">N/A</p>;

  return (
    <table className="w-full text-sm">
      <tbody>
        {Object.entries(data).map(([key, value]: any) => (
          <tr key={key} className="border-b border-gray-200">
            <td className="p-3 text-gray-500 w-1/3 capitalize">
              {key.replaceAll("_", " ")}
            </td>
            <td className="p-3 text-gray-800">
              {Array.isArray(value) ? (
                <ul className="list-disc ml-4 space-y-1">
                  {value.map((v: string, i: number) => (
                    <li key={i}>{v}</li>
                  ))}
                </ul>
              ) : (
                value || "N/A"
              )}
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
    return <p className="text-gray-500">N/A</p>;
  }

  return (
    <ul className="list-disc ml-6 text-gray-700 space-y-1">
      {data.map((item: string, i: number) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/* D7 TABLE */
function D7Table({ data }: any) {
  if (!data) return <p className="text-gray-500">N/A</p>;

  return (
    <div className="space-y-6">

      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Document Updates</h4>
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <tbody>
            {Object.entries(data.document_updates || {}).map(([key, value]: any) => (
              <tr key={key} className="border-b border-gray-200">
                <td className="p-3 text-gray-600 w-2/3">{formatLabel(key)}</td>
                <td className="p-3"><StatusBadge value={value} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h4 className="font-semibold text-gray-700 mb-2">Process Updates</h4>
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <tbody>
            {Object.entries(data.process_updates || {}).map(([key, value]: any) => (
              <tr key={key} className="border-b border-gray-200">
                <td className="p-3 text-gray-600 w-2/3">{formatLabel(key)}</td>
                <td className="p-3"><StatusBadge value={value} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

function D5Table({ data }: any) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">N/A</p>;
  }

  return (
    <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="p-2 text-left">Action</th>
          <th className="p-2 text-left">Owner</th>
          <th className="p-2 text-left">Target</th>
          <th className="p-2 text-left">Validation</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item: any, i: number) => (
          <tr key={i} className="border-t">
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

/* STATUS BADGE */
function StatusBadge({ value }: any) {
  const isYes = value?.toLowerCase() === "yes";

  return (
    <span className={`px-3 py-1 rounded-md text-xs font-medium
      ${isYes ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
      {value || "N/A"}
    </span>
  );
}

/* LABEL FORMAT */
function formatLabel(key: string) {
  return key
    .replaceAll("_", " ")
    .replace("dfmea", "DFMEA (Design FMEA)")
    .replace("pfmea", "PFMEA (Process FMEA)")
    .replace("pfd", "PFD (Process Flow Diagram)")
    .replace("dvp", "DVP (Design Validation Plan)")
    .replace("paa", "PAA Approval")
    .replace("control_plan", "Control Plan / AOS / SOP")
    .replace("inspection_checks", "Inspection / EOLT / PDI / Poka-Yoke")
    .replace("audit_checks", "Audit / Quality Gate Checks");
}
function D6Charts({ data }: any) {
  if (!data) return null;

  const trendData = data.trend || [
    { name: "Week 1", defect: 5 },
    { name: "Week 2", defect: 4 },
    { name: "Week 3", defect: 2 },
    { name: "Week 4", defect: 1 },
  ];

  const comparisonData = data.comparison || [
    { name: "Before", value: 5 },
    { name: "After", value: 1 },
  ];

  return (
    <div className="space-y-8 mt-6">

      {/* TREND */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Defect Trend
        </h4>

        <div className="h-64 bg-white rounded-xl border p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="defect" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* COMPARISON */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 mb-2">
          Before vs After
        </h4>

        <div className="h-64 bg-white rounded-xl border p-4">
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

    </div>
  );
}
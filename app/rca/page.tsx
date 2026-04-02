"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

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
        alert("No data received from server");
        return;
      }

      try {
        const parsed = JSON.parse(data.result);
        setReport(parsed);
      } catch (err) {
        console.error("JSON parse error:", data.result);
        alert("Invalid response from server");
      }
    } catch (err) {
      console.error("Frontend error:", err);
      alert("Error generating report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <div className="border-2 border-black p-4 mb-6 bg-white">
        <h1 className="text-2xl font-bold text-center">
          8D / CAPA REPORT
        </h1>
        <p className="text-center text-sm text-gray-600">
          OEM Standard Root Cause Analysis Sheet
        </p>
      </div>

      {/* INPUT */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        <textarea
          placeholder="Enter Problem Statement..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-3 rounded"
        />

        <input
          placeholder="Department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          placeholder="Part Name"
          value={part}
          onChange={(e) => setPart(e.target.value)}
          className="border p-2 rounded"
        />

        <Button onClick={handleAnalyze} disabled={loading}>
          {loading ? "Generating..." : "Generate OEM 8D Report"}
        </Button>
      </div>

      {loading && (
        <p className="text-sm text-gray-500 mb-4">⏳ AI analyzing...</p>
      )}

      {/* REPORT */}
      {report && (
        <div className="bg-white border-2 border-black p-4 space-y-6">

          {/* D1 */}
          <Section title="D1: Team">
            {report.d1_team?.length
              ? report.d1_team.join(", ")
              : "N/A"}
          </Section>

          {/* D2 */}
          <Section title="D2: Problem Description">
            <Table data={report.d2_problem} />
          </Section>

          {/* D3 */}
          <Section title="D3: Containment Actions">
            <List data={report.d3_containment?.sorting} />
          </Section>

          {/* D4 */}
          <Section title="D4: Root Cause Analysis">
            <h4 className="font-semibold mt-2">Fishbone</h4>
            <Table data={report.d4_root_cause?.fishbone} />

            <h4 className="font-semibold mt-4">5 Why (Occurrence)</h4>
            <List data={report.d4_root_cause?.occurrence_why?.chain} />

            <p className="mt-2">
              <b>Root Cause:</b>{" "}
              {report.d4_root_cause?.occurrence_why?.root_cause || "N/A"}
            </p>
          </Section>

          {/* D5 */}
          <Section title="D5: Corrective Actions">
            <List data={report.d5_corrective?.occurrence} />
          </Section>

          {/* D6 */}
          <Section title="D6: Validation">
            <Table data={report.d6_validation} />
          </Section>

          {/* D7 */}
          <Section title="D7: Preventive Actions">
            <List data={report.d7_preventive} />
          </Section>

          {/* D8 */}
          <Section title="D8: Closure">
            <Table data={report.d8_closure} />
          </Section>

        </div>
      )}
    </div>
  );
}

/* 🔥 SECTION */
function Section({ title, children }: any) {
  return (
    <div className="border border-black">
      <div className="bg-gray-200 font-bold p-2 border-b border-black">
        {title}
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

/* 🔥 TABLE */
function Table({ data }: any) {
  if (!data) return <p className="text-gray-500">N/A</p>;

  return (
    <table className="w-full border border-black text-sm">
      <tbody>
        {Object.entries(data).map(([key, value]: any) => (
          <tr key={key}>
            <td className="border border-black p-2 font-semibold bg-gray-100 w-1/3 uppercase">
              {key.replaceAll("_", " ")}
            </td>
            <td className="border border-black p-2">
              {Array.isArray(value) ? (
                <ul className="list-disc ml-4">
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

/* 🔥 LIST */
function List({ data }: any) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">N/A</p>;
  }

  return (
    <ul className="list-disc ml-6">
      {data.map((item: string, i: number) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
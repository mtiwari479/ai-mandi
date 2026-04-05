"use client";

import { useState } from "react";


const industries = [
  "Technology", "Finance", "Healthcare", "Manufacturing", "Retail",
  "Education", "Consulting", "Media", "Government", "Startup"
];

const departments = [
  "Engineering", "Product", "Sales", "Marketing", "HR",
  "Finance", "Operations", "Legal", "Design", "Customer Support"
];

interface FormData {
  companyName: string;
  industry: string;
  department: string;
  designation: string;
  currentSalary: string;
  offeredSalary: string;
  currentLocation: string;
  targetLocation: string;
  yearsExperience: string;
  currentCompany: string;
}

interface Result {
  score: number;
  verdict: "JOIN" | "DON'T JOIN";
  summary: string;
  salaryAnalysis: string;
  companyInsights: string;
  locationFactor: string;
  careerGrowth: string;
  hrCulture: string;
  finalAdvice: string;
}

export default function SwitchBuddyPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    companyName: "",
    industry: "",
    department: "",
    designation: "",
    currentSalary: "",
    offeredSalary: "",
    currentLocation: "",
    targetLocation: "",
    yearsExperience: "",
    currentCompany: "",
  });

  const update = (field: keyof FormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const analyze = async () => {
    setLoading(true);
    setError("");
    try {
      const prompt = `You are SwitchBuddy, an expert career advisor AI. A professional is evaluating whether to join a new company. Analyze deeply and provide a structured recommendation.

CANDIDATE DETAILS:
- Current Company: ${form.currentCompany}
- Target Company: ${form.companyName}
- Industry: ${form.industry}
- Department: ${form.department}
- Designation/Position: ${form.designation}
- Years of Experience: ${form.yearsExperience}
- Current Salary: ₹${form.currentSalary} LPA
- Offered Salary: ₹${form.offeredSalary} LPA
- Current Location: ${form.currentLocation}
- Target Location: ${form.targetLocation}

Do deep research on ${form.companyName} in ${form.industry} industry. Consider:
1. Company reputation, growth trajectory, funding/stability
2. HR policies, work culture, employee reviews (Glassdoor-style insights)
3. Salary benchmarks for ${form.designation} in ${form.industry}
4. Location cost of living comparison: ${form.currentLocation} vs ${form.targetLocation}
5. Career growth opportunities for ${form.department} professionals
6. Work-life balance, benefits, facilities typically offered

Respond ONLY in this exact JSON format:
{
  "score": <number 0-100>,
  "verdict": "<JOIN or DON'T JOIN>",
  "summary": "<2 sentence overall summary>",
  "salaryAnalysis": "<analysis of salary offer vs market rate>",
  "companyInsights": "<company reputation, stability, culture insights>",
  "locationFactor": "<location change impact, cost of living>",
  "careerGrowth": "<career growth potential in this role>",
  "hrCulture": "<HR policies, work culture, benefits>",
  "finalAdvice": "<2-3 sentence personalized final advice>"
}`;

      const res = await fetch("/api/switchbuddy", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ form }),
});

if (!res.ok) {
  const errData = await res.json();
  throw new Error(errData.error || "API error");
}

const parsed: Result = await res.json();
      setResult(parsed);
      setStep(3);
    } catch (e: any) {
      setError(e.message || "Something went wrong. Check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 70) return "#00b894";
    if (score >= 40) return "#fdcb6e";
    return "#e17055";
  };

  const resetForm = () => {
    setStep(1);
    setResult(null);
    setError("");
    setForm({
      companyName: "",
      industry: "",
      department: "",
      designation: "",
      currentSalary: "",
      offeredSalary: "",
      currentLocation: "",
      targetLocation: "",
      yearsExperience: "",
      currentCompany: "",
    });
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white";
  const labelClass =
    "block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide";

  const salaryDelta =
    form.currentSalary && form.offeredSalary
      ? (
          ((parseFloat(form.offeredSalary) - parseFloat(form.currentSalary)) /
            parseFloat(form.currentSalary)) *
          100
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-cyan-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-3xl">🔄</span>
            <h1 className="text-3xl font-bold text-gray-900">SwitchBuddy</h1>
          </div>
          <p className="text-gray-500 text-sm">
            AI-powered career switch advisor — Should you join or not?
          </p>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-3 mt-5">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s
                      ? "bg-teal-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > s ? "✓" : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-10 h-0.5 transition-all ${
                      step > s ? "bg-teal-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-12 mt-1.5">
            <span className="text-xs text-gray-400">Current Job</span>
            <span className="text-xs text-gray-400">New Offer</span>
            <span className="text-xs text-gray-400">Result</span>
          </div>
        </div>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              📋 Your Current Situation
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Current Company</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Infosys"
                  value={form.currentCompany}
                  onChange={(e) => update("currentCompany", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Industry</label>
                <select
                  className={inputClass}
                  value={form.industry}
                  onChange={(e) => update("industry", e.target.value)}
                >
                  <option value="">Select industry</option>
                  {industries.map((i) => (
                    <option key={i}>{i}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Department</label>
                <select
                  className={inputClass}
                  value={form.department}
                  onChange={(e) => update("department", e.target.value)}
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Designation / Position</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Senior Engineer"
                  value={form.designation}
                  onChange={(e) => update("designation", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Years of Experience</label>
                <input
                  className={inputClass}
                  placeholder="e.g. 4"
                  type="number"
                  min="0"
                  value={form.yearsExperience}
                  onChange={(e) => update("yearsExperience", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Current Salary (LPA)</label>
                <input
                  className={inputClass}
                  placeholder="e.g. 12"
                  type="number"
                  min="0"
                  value={form.currentSalary}
                  onChange={(e) => update("currentSalary", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Current Location</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Pune, Maharashtra"
                  value={form.currentLocation}
                  onChange={(e) => update("currentLocation", e.target.value)}
                />
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={
                !form.currentCompany ||
                !form.industry ||
                !form.department ||
                !form.designation ||
                !form.currentSalary
              }
              className="mt-6 w-full py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next → Enter Offer Details
            </button>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              🏢 The New Offer
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelClass}>Company You're Considering</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Google, Razorpay, Tata Consultancy"
                  value={form.companyName}
                  onChange={(e) => update("companyName", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Offered Salary (LPA)</label>
                <input
                  className={inputClass}
                  placeholder="e.g. 18"
                  type="number"
                  min="0"
                  value={form.offeredSalary}
                  onChange={(e) => update("offeredSalary", e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>New Location</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Bangalore, Karnataka"
                  value={form.targetLocation}
                  onChange={(e) => update("targetLocation", e.target.value)}
                />
              </div>
            </div>

            {/* Live salary delta */}
            {salaryDelta !== null && (
              <div className="mt-4 p-3 rounded-xl bg-gray-50 border border-gray-100 text-sm text-center">
                Salary change:{" "}
                <span
                  className={`font-bold ${
                    parseFloat(salaryDelta) >= 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {parseFloat(salaryDelta) >= 0 ? "+" : ""}
                  {salaryDelta}%
                </span>{" "}
                &nbsp;(₹{form.currentSalary} → ₹{form.offeredSalary} LPA)
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600 text-center">
                ⚠️ {error}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
              >
                ← Back
              </button>
              <button
                onClick={analyze}
                disabled={!form.companyName || !form.offeredSalary || loading}
                className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-semibold text-sm hover:bg-teal-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "🚀 Analyze Now"
                )}
              </button>
            </div>

            {loading && (
              <p className="mt-4 text-center text-xs text-gray-400 animate-pulse">
                🔍 Researching {form.companyName}, salary benchmarks, HR policies...
              </p>
            )}
          </div>
        )}

        {/* ── STEP 3 — Result ── */}
        {step === 3 && result && (
          <div className="space-y-4">

            {/* Score card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                SwitchBuddy Score
              </p>
              <div
                className="text-6xl font-black mb-2"
                style={{ color: scoreColor(result.score) }}
              >
                {result.score}
                <span className="text-2xl text-gray-300">/100</span>
              </div>

              <div
                className="inline-block px-8 py-2 rounded-full text-white font-bold text-lg mb-4"
                style={{ backgroundColor: scoreColor(result.score) }}
              >
                {result.verdict === "JOIN" ? "✅ JOIN" : "❌ DON'T JOIN"}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                {result.summary}
              </p>

              {/* Score bar */}
              <div className="mt-5 w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${result.score}%`,
                    backgroundColor: scoreColor(result.score),
                    transition: "width 1s ease",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-300 mt-1">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            {/* Detail cards */}
            {[
              { icon: "💰", title: "Salary Analysis", content: result.salaryAnalysis },
              { icon: "🏢", title: "Company Insights", content: result.companyInsights },
              { icon: "📍", title: "Location Factor", content: result.locationFactor },
              { icon: "📈", title: "Career Growth", content: result.careerGrowth },
              { icon: "👥", title: "HR & Culture", content: result.hrCulture },
            ].map(({ icon, title, content }) => (
              <div
                key={title}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  {icon} {title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
              </div>
            ))}

            {/* Final advice */}
            <div
              className="rounded-2xl p-5 text-white"
              style={{ backgroundColor: scoreColor(result.score) }}
            >
              <h3 className="font-semibold mb-2 text-sm">🎯 Final Advice</h3>
              <p className="text-sm leading-relaxed opacity-90">{result.finalAdvice}</p>
            </div>

            {/* Reset */}
            <button
              onClick={resetForm}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
            >
              🔄 Analyze Another Company
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
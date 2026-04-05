import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { form } = body;

  const prompt = `You are SwitchBuddy, an elite AI career advisor with access to deep company intelligence. A professional is deciding whether to switch companies. Perform an exhaustive analysis comparing both companies and provide a data-driven recommendation.

═══════════════════════════════════════
CANDIDATE PROFILE
═══════════════════════════════════════
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

═══════════════════════════════════════
DEEP RESEARCH INSTRUCTIONS
═══════════════════════════════════════

1. COMPANY COMPARISON (${form.currentCompany} vs ${form.companyName}):
   - Company size, founding year, revenue, valuation/funding stage
   - Market position and competitive standing in ${form.industry}
   - Recent news, layoffs, expansions, product launches
   - Stock performance or funding rounds (if applicable)
   - Leadership quality and management reputation
   - Brand reputation in the industry

2. EMPLOYEE REVIEWS & CULTURE (both companies):
   - Overall Glassdoor/AmbitionBox-style rating (estimate based on known data)
   - Work-life balance rating
   - Management & leadership reviews
   - Common employee complaints and praises
   - Attrition rate and employee retention
   - Diversity and inclusion policies
   - Remote/hybrid work flexibility

3. SALARY & COMPENSATION DEEP DIVE:
   - Market benchmark salary for ${form.designation} in ${form.industry} with ${form.yearsExperience} years experience
   - Is ₹${form.offeredSalary} LPA above/below/at market rate?
   - Typical bonus, ESOPs, stock options at ${form.companyName}
   - Benefits comparison: health insurance, PF, gratuity, perks
   - Total compensation package estimate

4. LOCATION & LIFESTYLE ANALYSIS (${form.currentLocation} vs ${form.targetLocation}):
   - Cost of living difference percentage
   - Housing costs, commute, quality of life
   - Tech/industry ecosystem strength
   - Net effective salary after cost adjustment

5. CAREER GROWTH POTENTIAL:
   - Promotion timeline and growth trajectory at ${form.companyName}
   - Learning opportunities, training, certifications
   - Brand value on resume — will ${form.companyName} boost your profile?
   - Internal mobility and lateral growth options
   - Exit opportunities this role opens up

6. HR POLICIES & FACILITIES:
   - Notice period norms
   - Leave policies (annual, sick, maternity/paternity)
   - Office facilities and amenities
   - Learning & development budget
   - Performance review process

7. RISK ASSESSMENT:
   - Job security at ${form.companyName} (layoff risk, funding runway)
   - Probation period risks
   - Joining bonus clawback clauses to watch out for
   - Industry outlook for ${form.industry} in next 2-3 years

Respond ONLY in this exact JSON format with no extra text:
{
  "score": <number 0-100>,
  "verdict": "<JOIN or DON'T JOIN>",
  "summary": "<3 sentence executive summary of your recommendation>",
  
  "companyComparison": {
    "currentCompany": {
      "rating": "<X/5 estimated>",
      "strengths": "<key strengths>",
      "weaknesses": "<key weaknesses>",
      "marketPosition": "<market standing>"
    },
    "targetCompany": {
      "rating": "<X/5 estimated>",
      "strengths": "<key strengths>",
      "weaknesses": "<key weaknesses>",
      "marketPosition": "<market standing>"
    }
  },

  "employeeReviews": {
    "currentCompany": {
      "overallRating": "<X/5>",
      "workLifeBalance": "<X/5>",
      "management": "<X/5>",
      "topPraise": "<what employees love>",
      "topComplaint": "<what employees dislike>"
    },
    "targetCompany": {
      "overallRating": "<X/5>",
      "workLifeBalance": "<X/5>",
      "management": "<X/5>",
      "topPraise": "<what employees love>",
      "topComplaint": "<what employees dislike>"
    }
  },

  "salaryAnalysis": "<detailed salary benchmark, market rate comparison, total comp breakdown>",
  "locationFactor": "<cost of living impact, effective salary after adjustment, lifestyle change>",
  "careerGrowth": "<growth trajectory, resume value, exit opportunities>",
  "hrPolicies": "<leave policy, WFH flexibility, notice period, perks & benefits>",
  "riskAssessment": "<job security, industry outlook, probation risks, red flags if any>",
  "finalAdvice": "<3-4 sentence personalized, direct final advice with specific action recommendation>"
}`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json(
      { error: err.error?.message || "API error" },
      { status: 500 }
    );
  }

  const data = await res.json();
  const result = JSON.parse(data.choices[0].message.content);
  return NextResponse.json(result);
}
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { problem, industry, department, part } = await req.json();

  if (!problem) {
    return NextResponse.json(
      { error: "Problem description required" },
      { status: 400 }
    );
  }

  try {
    const aiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",

        // ✅ CORRECT JSON FORMAT ENFORCER
        text: {
          format: {
            type: "json_object",
          },
        },

        input: [
          {
            role: "system",
            content: `
You are a senior OEM quality engineer.

STRICT RULES:
- Return ONLY valid JSON
- No explanation
- No markdown
- No extra text
- Fill all fields logically like real OEM 8D report

STRUCTURE:
{
  "d1_team": [],
  "d2_problem": {
    "description": "",
    "where": "",
    "when": "",
    "how_many": ""
  },
  "d3_containment": {
    "sorting": [],
    "ica_field": [],
    "ica_process": [],
    "ica_detection": [],
    "cutoff": ""
  },
  "d4_root_cause": {
    "fishbone": {
      "man": [],
      "machine": [],
      "method": [],
      "material": []
    },
    "occurrence_why": {
      "chain": [],
      "root_cause": ""
    },
    "non_detection_why": {
      "chain": [],
      "root_cause": ""
    }
  },
  "d5_corrective": {
    "occurrence": [],
    "detection": []
  },
  "d6_validation": {
    "before": "",
    "after": "",
    "result": "",
    "cutoff": ""
  },
  "d7_preventive": [],
  "d8_closure": {
    "summary": "",
    "status": "",
    "approved_by": "",
    "date": "",
    "recognition": []
  }
}
            `,
          },
          {
            role: "user",
            content: `Problem: ${problem}
Industry: ${industry || "Automotive"}
Department: ${department || "Not specified"}
Part: ${part || "Not specified"}`,
          },
        ],
      }),
    });

    const data = await aiResponse.json();

    // ❌ API ERROR HANDLE
    if (!aiResponse.ok) {
      const msg = data?.error?.message || "OpenAI API failed";
      console.error("API ERROR:", msg);
      return NextResponse.json(
        { result: JSON.stringify({ error: msg }) },
        { status: 500 }
      );
    }

    // ✅ CORRECT PARSING (VERY IMPORTANT)
    const content = data?.output?.[0]?.content?.[0]?.text;

    if (!content) {
      console.error("Empty response:", data);
      return NextResponse.json({
        result: JSON.stringify({ error: "Empty AI response" }),
      });
    }

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch (err) {
      console.error("JSON PARSE FAIL:", content);

      // fallback safe response
      parsed = {
        error: "Invalid JSON from AI",
        raw: content,
      };
    }

    return NextResponse.json({
      result: JSON.stringify(parsed),
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return NextResponse.json(
      {
        result: JSON.stringify({
          error: "Internal server error",
          details: (err as Error).message,
        }),
      },
      { status: 500 }
    );
  }
}
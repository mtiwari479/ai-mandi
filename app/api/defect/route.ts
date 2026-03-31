import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { defect } = body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer YOUR_OPENAI_API_KEY`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a quality engineer expert.",
        },
        {
          role: "user",
          content: `Analyze this defect and give:
          - Root cause
          - Corrective action
          - QC tool used

          Defect: ${defect}`,
        },
      ],
    }),
  });

  const data = await response.json();

  return NextResponse.json({
    result: data.choices[0].message.content,
  });
}
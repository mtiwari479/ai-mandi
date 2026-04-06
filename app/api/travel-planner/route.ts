import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { Client as GoogleClient, TravelMode } from "@googlemaps/google-maps-services-js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const gmaps = new GoogleClient({});

type TrainRoute = {
  mode: "train";
  transport_id: string | null;
  name: string | null;
  from: string;
  to: string;
  departure: string | null;
  arrival: string | null;
  duration: string | null;
  availability: string[] | null;
  classes: string[];
  route: string[] | null;
};

type BusRoute = {
  mode: "bus";
  transport_id: string | null;
  operator: string | null;
  bus_type: string | null;
  from: string;
  to: string;
  departure: string | null;
  arrival: string | null;
  duration: string | null;
  availability: string | number | null;
  estimated_cost: string | null;
  boarding_point: string | null;
  dropping_point: string | null;
};

async function getDistance(source: string, destination: string) {
  if (!process.env.GOOGLE_MAPS_API_KEY) return null;

  const res = await gmaps.distancematrix({
    params: {
      origins: [source],
      destinations: [destination],
      mode: TravelMode.driving,
      key: process.env.GOOGLE_MAPS_API_KEY,
    },
  });

  const el = res.data.rows?.[0]?.elements?.[0];
  if (!el || el.status !== "OK") return null;

  return {
    text: `${el.distance.text}, ${el.duration.text}`,
    km: el.distance.value / 1000,
    minutes: el.duration.value / 60,
  };
}

async function getTrains(from: string, to: string, date: string): Promise<TrainRoute[]> {
  if (!process.env.RAILLIVE_KEY) return [];

  const url = `https://railway.live.track/v1/trainBetween?from=${encodeURIComponent(
    from
  )}&to=${encodeURIComponent(to)}&date=${encodeURIComponent(date)}`;

  const resp = await fetch(url, {
    headers: { "x-api-key": process.env.RAILLIVE_KEY },
    cache: "no-store",
  });

  if (!resp.ok) {
    throw new Error(`Train API failed with ${resp.status}`);
  }

  const data = await resp.json();

  return (data?.trains || []).slice(0, 10).map((t: any) => ({
    mode: "train",
    transport_id: t.train_number ?? null,
    name: t.train_name ?? null,
    from,
    to,
    departure: t.from_std ?? null,
    arrival: t.to_sta ?? null,
    duration: t.duration ?? null,
    availability: Array.isArray(t.availability)
      ? t.availability.map((a: any) =>
          [a.class, a.status].filter(Boolean).join(": ")
        )
      : null,
    classes: Array.isArray(t.running_classes) ? t.running_classes : [],
    route: Array.isArray(t.route)
      ? t.route
          .map((stop: any) => stop.station_name || stop.station_code)
          .filter(Boolean)
      : null,
  }));
}

// Replace this later with a real bus provider.
// Empty array is better than invented bus data.
async function getBuses(_from: string, _to: string, _date: string): Promise<BusRoute[]> {
  return [];
}

export async function POST(req: NextRequest) {
  try {
    const { source, destination, date, startTime } = await req.json();

    if (!source || !destination || !date || !startTime) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    let distance = null;
    let trains: TrainRoute[] = [];
    let buses: BusRoute[] = [];

    try {
      distance = await getDistance(source, destination);
    } catch (err) {
      console.error("Distance API error:", err);
    }

    try {
      trains = await getTrains(source, destination, date);
    } catch (err) {
      console.error("Train API error:", err);
    }

    try {
      buses = await getBuses(source, destination, date);
    } catch (err) {
      console.error("Bus API error:", err);
    }

    const filteredTrains = trains.filter((train) => {
      if (!train.departure) return true;
      return train.departure >= startTime;
    });

    const filteredBuses = buses.filter((bus) => {
      if (!bus.departure) return true;
      return bus.departure >= startTime;
    });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: "Missing OPENAI_API_KEY",
          query: {
            source,
            destination,
            date,
            start: startTime,
          },
          routes: [],
          notes: "Planner model is unavailable because OPENAI_API_KEY is missing.",
          explanation: "Live data was fetched, but route shaping could not run.",
          generated_with: {
            distance_km: distance?.km ?? null,
            distance_text: distance?.text ?? null,
            train_count: filteredTrains.length,
            bus_count: filteredBuses.length,
            disclaimer:
              "Only train and bus data are allowed. Verify availability and timings before booking.",
          },
        },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a Multimodal Travel Planning AI.

Your job is to generate optimal travel routes between two locations using:
- Trains
- Buses

You must format the output for a UI that renders route cards.

Rules:
1. Always prioritize TRAIN routes first.
2. Only include routes with valid seat availability when availability data is present.
3. If no direct train exists, break the journey into segments only if those segments are supported by the provided live data.
4. Allowed transport combinations:
   - Train -> Train
   - Train -> Bus
   - Bus -> Train
5. Do NOT use taxi, cab, car, charter cab, auto, flight, or unsupported modes.
6. Next departure must be AFTER previous arrival plus a reasonable transfer buffer:
   - Train -> Train: 60 min
   - Train -> Bus: 45 min
   - Bus -> Train: 45 min
7. Avoid long unnecessary waits over 6 hours unless unavoidable.
8. Do not use more than 3 segments.
9. Never invent train numbers, bus IDs, route stops, availability, times, or costs.
10. Use only the supplied live data.
11. If insufficient data exists, return fewer routes or an empty routes array.

Return strict JSON in exactly this shape:
{
  "query": {
    "source": string,
    "destination": string,
    "date": string,
    "start": string
  },
  "routes": [
    {
      "category": "ECONOMY" | "MEDIUM" | "PREMIUM",
      "total_duration": string,
      "estimated_cost": string,
      "why_selected": string,
      "segments": [
        {
          "mode": "train" | "bus",
          "transport_id": string | null,
          "name_or_operator": string | null,
          "from": string,
          "to": string,
          "departure": string | null,
          "arrival": string | null,
          "availability": string[] | string | null,
          "estimated_cost": string | null
        }
      ]
    }
  ],
  "notes": string,
  "explanation": string
}

Requirements for shaping:
- For train segments, map the train name into "name_or_operator".
- For bus segments, map the operator into "name_or_operator".
- estimated_cost may be null if the source data does not provide it.
- If there is only one strong route, return one route instead of fabricating three.
- If no route is feasible, return an empty routes array.`;

    const userPrompt = JSON.stringify(
      {
        query: {
          source,
          destination,
          date,
          start: startTime,
        },
        distance,
        available_trains: filteredTrains,
        available_buses: filteredBuses,
      },
      null,
      2
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    const parsed = content ? JSON.parse(content) : null;

    const plan =
      parsed && typeof parsed === "object"
        ? parsed
        : {
            query: {
              source,
              destination,
              date,
              start: startTime,
            },
            routes: [],
            notes: "No planner output returned.",
            explanation: "The planner did not produce a valid structured response.",
          };

    plan.query = {
      source,
      destination,
      date,
      start: startTime,
    };

    if (!Array.isArray(plan.routes)) {
      plan.routes = [];
    }

    plan.generated_with = {
      distance_km: distance?.km ?? null,
      distance_text: distance?.text ?? null,
      train_count: filteredTrains.length,
      bus_count: filteredBuses.length,
      disclaimer:
        "Only train and bus data are allowed. Verify train numbers, availability, routes, boarding points, and timings before booking.",
    };

    return NextResponse.json(plan);
  } catch (error) {
    console.error("Travel planner error:", error);
    return NextResponse.json(
      { error: "Server failed while generating travel plan" },
      { status: 500 }
    );
  }
}

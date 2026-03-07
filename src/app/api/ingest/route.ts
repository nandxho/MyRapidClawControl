import { NextRequest, NextResponse } from "next/server";

type IngestPayload = {
  source?: string;
  type?: "run" | "definition" | "batch";
  data?: unknown;
  timestamp?: string;
};

export async function POST(request: NextRequest) {
  const token = request.headers.get("x-ingest-token");
  const expected = process.env.INGEST_AUTH_TOKEN;

  if (!expected) {
    return NextResponse.json({ error: "INGEST_AUTH_TOKEN not configured" }, { status: 500 });
  }

  if (!token || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as IngestPayload;

  if (!body?.type || !body?.source) {
    return NextResponse.json({ error: "Invalid payload: source and type are required" }, { status: 400 });
  }

  // Cloud-ready scope: no local filesystem dependency in production path.
  // Persist to Convex/DB in next iteration.
  return NextResponse.json({
    ok: true,
    accepted: true,
    mode: process.env.SOURCE_MODE ?? "ingest",
    received: {
      source: body.source,
      type: body.type,
      timestamp: body.timestamp ?? new Date().toISOString(),
    },
  });
}

import { NextResponse } from "next/server";

const START_TIME = Date.now();

export async function GET() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  const workspacePath = process.env.WORKSPACE_PATH;

  const uptime = Math.floor((Date.now() - START_TIME) / 1000);

  const services = {
    nextjs: "healthy",
    convex: convexUrl ? "configured" : "not_configured",
    workspace: workspacePath ? "configured" : "not_configured",
  };

  const allHealthy = Object.values(services).every(
    (s) => s === "healthy" || s === "configured"
  );

  return NextResponse.json(
    {
      status: allHealthy ? "healthy" : "degraded",
      version: "0.1.0",
      uptime,
      timestamp: new Date().toISOString(),
      services,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

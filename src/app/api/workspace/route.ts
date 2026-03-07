import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const workspacePath = process.env.WORKSPACE_PATH ?? "";

  if (!workspacePath) {
    return NextResponse.json(
      { error: "WORKSPACE_PATH not configured" },
      { status: 404 }
    );
  }

  const exists = fs.existsSync(workspacePath);

  return NextResponse.json({
    path: workspacePath,
    exists,
    isDirectory: exists ? fs.statSync(workspacePath).isDirectory() : false,
    basename: path.basename(workspacePath),
  });
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { path?: string };

  if (!body.path || typeof body.path !== "string") {
    return NextResponse.json({ error: "Missing or invalid 'path' field" }, { status: 400 });
  }

  // Sanitize: ensure the path is absolute
  if (!path.isAbsolute(body.path)) {
    return NextResponse.json({ error: "Path must be absolute" }, { status: 400 });
  }

  // In a real app, you'd persist this to env or a config file.
  // Here we respond with the validated path.
  const exists = fs.existsSync(body.path);

  return NextResponse.json({
    path: body.path,
    exists,
    isDirectory: exists ? fs.statSync(body.path).isDirectory() : false,
    basename: path.basename(body.path),
    note: "To persist, set WORKSPACE_PATH in your .env.local file.",
  });
}

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { runAgents, type TaskKey } from "@/lib/agents";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  let body: { task?: string; brief?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const task = body.task as TaskKey;
  if (!task || !["web", "image", "video", "social", "market"].includes(task)) {
    return NextResponse.json(
      { error: "task must be web, image, video, social, or market." },
      { status: 400 },
    );
  }

  const result = await runAgents(task, body.brief || "");
  return NextResponse.json({ ok: true, user: session.email, result });
}

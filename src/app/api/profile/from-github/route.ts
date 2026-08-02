import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { downloadGithubStudentProfile } from "@/lib/githubProfileImport";

/**
 * Downloads public GitHub profile data into Profile Builder shape.
 * Same intake path as the roster import script, for the signed-in student.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (session.role !== "student") {
    return NextResponse.json({ error: "Student accounts only." }, { status: 403 });
  }

  let body: { github?: string } = {};
  try {
    body = await request.json();
  } catch {
    // optional body — fall back to session github
  }

  const handle = body.github || session.github;
  if (!handle) {
    return NextResponse.json(
      { error: "No GitHub handle on this account. Sign up again with your GitHub handle." },
      { status: 400 },
    );
  }

  try {
    const imported = await downloadGithubStudentProfile(handle);
    return NextResponse.json({
      ok: true,
      handle: imported.handle,
      name: imported.name,
      fromRoster: imported.fromRoster,
      source: imported.source,
      profile: imported.profile,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "GitHub import failed." },
      { status: 400 },
    );
  }
}

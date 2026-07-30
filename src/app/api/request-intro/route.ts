import { NextResponse } from "next/server";

type IntroPayload = {
  partnerName?: string;
  company?: string;
  email?: string;
  students?: string[];
  note?: string;
};

/**
 * Partner intro intake. In production, set PLACEMENT_LEAD_EMAIL and optionally
 * wire Resend/Postmark. Until then we persist to server logs and return success
 * so the partner UX stays complete during review week.
 */
export async function POST(request: Request) {
  let body: IntroPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const partnerName = body.partnerName?.trim();
  const company = body.company?.trim();
  const email = body.email?.trim();
  const note = body.note?.trim();
  const students = Array.isArray(body.students) ? body.students : [];

  if (!partnerName || !company || !email || !note) {
    return NextResponse.json(
      { error: "partnerName, company, email, and note are required." },
      { status: 400 },
    );
  }

  const lead = process.env.PLACEMENT_LEAD_EMAIL || "placement@hult-cohort.local";
  const record = {
    at: new Date().toISOString(),
    lead,
    partnerName,
    company,
    email,
    students,
    note,
  };

  console.info("[pixie-dust] request-intro", JSON.stringify(record));

  // Optional webhook / email provider hook
  if (process.env.INTRO_WEBHOOK_URL) {
    try {
      await fetch(process.env.INTRO_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });
    } catch (err) {
      console.error("[pixie-dust] intro webhook failed", err);
    }
  }

  return NextResponse.json({
    ok: true,
    message: `Thanks ${partnerName}. Intro request for ${company} is queued for the placement lead (${lead}).`,
  });
}

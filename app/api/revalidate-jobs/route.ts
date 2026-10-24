import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Hit on a schedule by Vercel Cron to force the job board to re-scrape,
// so new roles appear and expired ones drop even with no visitor traffic.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");

  // When CRON_SECRET is set, require it (Vercel Cron sends it automatically).
  if (secret && auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  revalidatePath("/jobs");
  return NextResponse.json({ ok: true, revalidated: "/jobs", at: new Date().toISOString() });
}

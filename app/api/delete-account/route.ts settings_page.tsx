import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Identify the currently signed-in user from their session cookies.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json(
      { error: "Server is not configured for account deletion." },
      { status: 500 }
    );
  }

  // Admin client: bypasses RLS, can delete auth users.
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const uid = user.id;

  // Best-effort cleanup of user-owned rows. Errors are ignored so a missing
  // table or already-cascaded row doesn't block the deletion.
  await admin.from("messages").delete().eq("sender_id", uid);
  await admin
    .from("conversations")
    .delete()
    .or("user_a.eq." + uid + ",user_b.eq." + uid);
  await admin
    .from("contact_requests")
    .delete()
    .or("from_user.eq." + uid + ",to_user.eq." + uid);
  await admin.from("applications").delete().eq("applicant_id", uid);
  await admin.from("job_posts").delete().eq("posted_by", uid);
  await admin.from("companies").delete().eq("owner_id", uid);
  // Engineer profile + its sub-tables (these cascade from profiles if the
  // foreign keys were created with ON DELETE CASCADE).
  await admin.from("profiles").delete().eq("id", uid);

  // Finally remove the auth identity so they can no longer log in.
  const { error } = await admin.auth.admin.deleteUser(uid);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

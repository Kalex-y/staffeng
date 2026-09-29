import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

type CookieToSet = { name: string; value: string; options?: Record<string, unknown> };

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "";

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll(cookiesToSet: CookieToSet[]) {
            try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch {}
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (next.includes("reset-password")) {
        return NextResponse.redirect(`${origin}/auth/reset-password`);
      }
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const wantsEmployer = next.includes("/employers");
        const { data: profile } = await supabase
          .from("profiles")
          .select("account_type, onboarding_completed")
          .eq("id", user.id)
          .maybeSingle();

        let isEmployer = profile?.account_type === "employer";
        if (wantsEmployer && !isEmployer) {
          await supabase.from("profiles").update({ account_type: "employer" }).eq("id", user.id);
          isEmployer = true;
        }

        if (isEmployer) {
          const { data: company } = await supabase
            .from("companies").select("id").eq("owner_id", user.id).maybeSingle();
          return NextResponse.redirect(`${origin}${company ? "/employers/dashboard" : "/employers/onboarding"}`);
        }
        return NextResponse.redirect(`${origin}${profile?.onboarding_completed ? "/dashboard" : "/onboarding"}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
}

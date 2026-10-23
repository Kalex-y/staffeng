"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

export default function HireCta({
  className,
  loggedOutLabel = "Create a company account →",
}: {
  className: string;
  loggedOutLabel?: string;
}) {
  const supabase = createClient();
  const [state, setState] = useState<"loading" | "out" | "signedIn">("loading");
  const [dashHref, setDashHref] = useState("/dashboard");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setState("out"); return; }
      const { data: p } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", user.id)
        .maybeSingle();
      setDashHref(p?.account_type === "employer" ? "/employers/dashboard" : "/dashboard");
      setState("signedIn");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "loading") {
    return <span className={className} aria-hidden="true">&nbsp;</span>;
  }
  if (state === "signedIn") {
    return <Link href={dashHref} className={className}>Go to your dashboard →</Link>;
  }
  return <Link href="/employers/signup" className={className}>{loggedOutLabel}</Link>;
}

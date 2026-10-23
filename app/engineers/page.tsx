import type { Metadata } from "next";
import EngineersClient from "./EngineersClient";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Browse Engineers",
  description: "Browse senior staff engineers available for contract and full-time work.",
};

export const revalidate = 300;

export default async function EngineersPage() {
  const supabase = await createServerSupabaseClient();

  const { data: profs } = await supabase
    .from("profiles")
    .select("id, username, full_name, headline, avatar_url, location, is_open_to_work")
    .eq("profile_visibility", "public")
    .neq("account_type", "employer")
    .order("created_at", { ascending: false });

  const base = profs ?? [];
  const ids = base.map((p) => p.id);

  const skillsByProfile: Record<string, string[]> = {};
  const prefsByProfile: Record<string, { workLocations: string[]; availability: string | null }> = {};

  if (ids.length > 0) {
    const [{ data: sk }, { data: wp }] = await Promise.all([
      supabase.from("skills").select("profile_id, name").in("profile_id", ids),
      supabase.from("work_preferences").select("profile_id, work_location, availability").in("profile_id", ids),
    ]);
    (sk ?? []).forEach((row: { profile_id: string; name: string }) => {
      if (!skillsByProfile[row.profile_id]) skillsByProfile[row.profile_id] = [];
      if (row.name) skillsByProfile[row.profile_id].push(row.name);
    });
    (wp ?? []).forEach((row: { profile_id: string; work_location: string[] | null; availability: string | null }) => {
      prefsByProfile[row.profile_id] = {
        workLocations: row.work_location ?? [],
        availability: row.availability ?? null,
      };
    });
  }

  const engineers = base.map((p) => ({
    ...p,
    skills: skillsByProfile[p.id] ?? [],
    workLocations: prefsByProfile[p.id]?.workLocations ?? [],
    availability: prefsByProfile[p.id]?.availability ?? null,
  }));

  return <EngineersClient initialEngineers={engineers} />;
}

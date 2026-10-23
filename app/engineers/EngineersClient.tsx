"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type EngineerProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  headline: string | null;
  avatar_url: string | null;
  location: string | null;
  is_open_to_work: boolean | null;
  skills: string[];
  workLocations: string[];
  availability: string | null;
};

const AVAILABILITY_LABELS: Record<string, string> = {
  immediately: "Available now",
  one_month: "In 1 month",
  three_months: "In 3 months",
  open: "Open to chat",
  not_looking: "Not looking",
};

const WORK_LOCATION_OPTIONS: [string, string][] = [
  ["remote", "Remote"],
  ["hybrid", "Hybrid"],
  ["onsite", "On-site"],
];

const AVAILABILITY_OPTIONS = ["immediately", "one_month", "three_months", "open"];

const SENIORITY_OPTIONS = ["Principal", "Senior Staff", "Staff"];

export default function EngineersClient({ initialEngineers }: { initialEngineers?: EngineerProfile[] }) {
  const supabase = createClient();

  const [loading, setLoading] = useState(!initialEngineers);
  const [engineers, setEngineers] = useState<EngineerProfile[]>(initialEngineers ?? []);

  const [query, setQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedWorkLocations, setSelectedWorkLocations] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string>("");
  const [selectedSeniority, setSelectedSeniority] = useState<string[]>([]);

  useEffect(() => {
    // Server already provided the list (crawlable); no client fetch needed.
    if (initialEngineers) return;
    (async () => {
      setLoading(true);

      const { data: profs } = await supabase
        .from("profiles")
        .select("id, username, full_name, headline, avatar_url, location, is_open_to_work")
        .eq("profile_visibility", "public")
        .neq("account_type", "employer")
        .order("created_at", { ascending: false });

      const base = (profs ?? []) as Omit<EngineerProfile, "skills" | "workLocations" | "availability">[];
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

      setEngineers(
        base.map((p) => ({
          ...p,
          skills: skillsByProfile[p.id] ?? [],
          workLocations: prefsByProfile[p.id]?.workLocations ?? [],
          availability: prefsByProfile[p.id]?.availability ?? null,
        }))
      );
      setLoading(false);
    })();
  }, [supabase]);

  // Skills that actually exist in the data, for the filter list.
  const allSkills = useMemo(() => {
    const set = new Set<string>();
    engineers.forEach((e) => e.skills.forEach((s) => set.add(s)));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [engineers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return engineers.filter((e) => {
      const matchesQuery =
        q === "" ||
        (e.full_name ?? "").toLowerCase().includes(q) ||
        (e.headline ?? "").toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q) ||
        (e.username ?? "").toLowerCase().includes(q);

      const matchesSkills =
        selectedSkills.length === 0 || selectedSkills.every((s) => e.skills.includes(s));

      const matchesWorkLocation =
        selectedWorkLocations.length === 0 ||
        selectedWorkLocations.some((w) => e.workLocations.includes(w));

      const matchesAvailability =
        selectedAvailability === "" || e.availability === selectedAvailability;

      const headline = (e.headline ?? "").toLowerCase();
      const matchesSeniority =
        selectedSeniority.length === 0 ||
        selectedSeniority.some((s) => headline.includes(s.toLowerCase()));

      return matchesQuery && matchesSkills && matchesWorkLocation && matchesAvailability && matchesSeniority;
    });
  }, [engineers, query, selectedSkills, selectedWorkLocations, selectedAvailability, selectedSeniority]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const hasFilters =
    query !== "" ||
    selectedSkills.length > 0 ||
    selectedWorkLocations.length > 0 ||
    selectedAvailability !== "" ||
    selectedSeniority.length > 0;

  const clearFilters = () => {
    setQuery("");
    setSelectedSkills([]);
    setSelectedWorkLocations([]);
    setSelectedAvailability("");
    setSelectedSeniority([]);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse engineers</h1>
        <p className="text-gray-500 mt-2">
          Senior staff engineers open to contract and full-time work.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading engineers…</div>
      ) : engineers.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-3">👋</div>
          <p className="font-medium text-gray-700">No engineers here yet</p>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Engineers who create a profile and make it public will appear here.
          </p>
          <Link
            href="/join"
            className="inline-block mt-5 rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-indigo-700"
          >
            Create your profile
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Name, headline, location…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Seniority</label>
                <div className="flex flex-wrap gap-2">
                  {SENIORITY_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => toggle(selectedSeniority, setSelectedSeniority, s)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        selectedSeniority.includes(s)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-200 text-gray-600 hover:border-indigo-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work location</label>
                <div className="flex flex-wrap gap-2">
                  {WORK_LOCATION_OPTIONS.map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => toggle(selectedWorkLocations, setSelectedWorkLocations, val)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        selectedWorkLocations.includes(val)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "border-gray-200 text-gray-600 hover:border-indigo-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <div className="space-y-2">
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <label key={opt} className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        checked={selectedAvailability === opt}
                        onChange={() => setSelectedAvailability(selectedAvailability === opt ? "" : opt)}
                        className="text-indigo-600"
                      />
                      <span className="text-sm text-gray-600">{AVAILABILITY_LABELS[opt]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {allSkills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {allSkills.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => toggle(selectedSkills, setSelectedSkills, skill)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          selectedSkills.includes(skill)
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "border-gray-200 text-gray-600 hover:border-indigo-300"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium text-gray-600">No engineers match your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-5">
                  Showing {filtered.length} engineer{filtered.length !== 1 ? "s" : ""}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((eng) => {
                    const name = eng.full_name || eng.username || "Engineer";
                    const initials = name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                    return (
                      <Link
                        key={eng.id}
                        href={eng.username ? `/profile/${eng.username}` : "#"}
                        className="block rounded-xl border border-gray-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 shrink-0 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-medium">
                            {eng.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={eng.avatar_url} alt={name} className="h-full w-full object-cover" />
                            ) : (
                              initials
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900 leading-snug line-clamp-2">{name}</p>
                            {eng.location && (
                              <p className="text-xs text-gray-500 truncate">{eng.location}</p>
                            )}
                          </div>
                        </div>
                        {eng.is_open_to_work && (
                          <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            Open to work
                          </span>
                        )}
                        {eng.headline && (
                          <p className="text-sm text-gray-600 mt-3 line-clamp-2">{eng.headline}</p>
                        )}
                        {eng.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {eng.skills.slice(0, 3).map((s) => (
                              <span key={s} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                                {s}
                              </span>
                            ))}
                            {eng.skills.length > 3 && (
                              <span className="text-[11px] text-slate-400">+{eng.skills.length - 3}</span>
                            )}
                          </div>
                        )}
                        <span className="inline-block mt-4 text-sm font-medium text-indigo-600">
                          View profile →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

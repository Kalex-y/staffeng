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
};

export default function EngineersClient() {
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [engineers, setEngineers] = useState<EngineerProfile[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      // Public, non-employer profiles the engineer has chosen to make visible.
      const { data } = await supabase
        .from("profiles")
        .select("id, username, full_name, headline, avatar_url, location")
        .eq("visibility", "public")
        .neq("account_type", "employer")
        .order("created_at", { ascending: false });

      setEngineers((data ?? []) as EngineerProfile[]);
      setLoading(false);
    })();
  }, [supabase]);

  const filtered = useMemo(() => {
    if (query.trim() === "") return engineers;
    const q = query.toLowerCase();
    return engineers.filter(
      (e) =>
        (e.full_name ?? "").toLowerCase().includes(q) ||
        (e.headline ?? "").toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q) ||
        (e.username ?? "").toLowerCase().includes(q)
    );
  }, [engineers, query]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse engineers</h1>
        <p className="text-gray-500 mt-2">
          Senior staff engineers open to contract and full-time work.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8 max-w-md">
        <input
          type="text"
          placeholder="Search by name, headline, or location…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading engineers…</div>
      ) : engineers.length === 0 ? (
        // No engineers have joined / made themselves visible yet.
        <div className="text-center py-20">
          <div className="text-4xl mb-3">👋</div>
          <p className="font-medium text-gray-700">No engineers here yet</p>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Engineers who create a profile and make it public will appear here.
            Are you a senior engineer?
          </p>
          <Link
            href="/auth/signup"
            className="inline-block mt-5 rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-indigo-700"
          >
            Create your profile
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">🔍</div>
          <p className="font-medium text-gray-600">No engineers match your search</p>
          <button
            onClick={() => setQuery("")}
            className="mt-4 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Clear search
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
              return (
                <Link
                  key={eng.id}
                  href={eng.username ? `/profile/${eng.username}` : "#"}
                  className="block rounded-xl border border-gray-200 bg-white p-6 hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-medium">
                      {eng.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={eng.avatar_url}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {name}
                      </p>
                      {eng.location && (
                        <p className="text-xs text-gray-500 truncate">
                          {eng.location}
                        </p>
                      )}
                    </div>
                  </div>
                  {eng.headline && (
                    <p className="text-sm text-gray-600 mt-4 line-clamp-3">
                      {eng.headline}
                    </p>
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
  );
}

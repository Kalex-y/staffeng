"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type EngineerRow = {
  id: string;
  username: string | null;
  full_name: string | null;
  headline: string | null;
  location: string | null;
  avatar_url: string | null;
  is_open_to_work: boolean;
  skills: { name: string }[];
  work_preferences: { work_location: string[]; availability: string }[];
};

export default function EmployerEngineersPage() {
  const supabase = createClient();
  const [engineers, setEngineers] = useState<EngineerRow[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [openOnly, setOpenOnly] = useState(true);

  const [contactTarget, setContactTarget] = useState<EngineerRow | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: company } = await supabase.from("companies").select("id").eq("owner_id", user.id).maybeSingle();
        setCompanyId(company?.id ?? null);
      }
      const { data } = await supabase
        .from("profiles")
        .select("id, username, full_name, headline, location, avatar_url, is_open_to_work, skills(name), work_preferences(work_location, availability)")
        .eq("profile_visibility", "public")
        .neq("account_type", "employer");
      setEngineers((data as EngineerRow[]) ?? []);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => engineers.filter((e) => {
    if (openOnly && !e.is_open_to_work) return false;
    if (remoteOnly && !(e.work_preferences?.[0]?.work_location ?? []).includes("remote")) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const hit = (e.full_name ?? "").toLowerCase().includes(q)
        || (e.headline ?? "").toLowerCase().includes(q)
        || (e.location ?? "").toLowerCase().includes(q)
        || e.skills.some((s) => s.name.toLowerCase().includes(q));
      if (!hit) return false;
    }
    return true;
  }), [engineers, search, remoteOnly, openOnly]);

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/employers/dashboard" className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1B2D4F] text-white text-sm font-bold">SE</span>
            <span className="text-slate-400 text-sm">← Dashboard</span>
          </Link>
          <Link href="/employers/jobs/new" className="text-sm font-semibold bg-[#1B2D4F] text-white px-4 py-2 rounded-lg hover:bg-[#142240] transition-colors">Post a role</Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#0F172A]" style={{ fontFamily: "var(--font-fraunces)" }}>Find engineers</h1>
          <p className="text-slate-500 mt-1">Search vetted Staff & Principal Engineers and reach out directly.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, skill, headline…" className="flex-1 min-w-[240px] max-w-md border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          <button onClick={() => setRemoteOnly(v => !v)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${remoteOnly ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-200"}`}>Remote</button>
          <button onClick={() => setOpenOnly(v => !v)} className={`px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${openOnly ? "bg-[#1B2D4F] text-white border-[#1B2D4F]" : "bg-white text-slate-600 border-slate-200"}`}>Open to work</button>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm">Loading engineers…</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="font-semibold text-slate-900">No engineers found</p>
            <p className="text-slate-500 text-sm mt-1">Try clearing filters, or check back as more engineers join.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((e) => {
              const initials = (e.full_name ?? "??").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={e.id} className="bg-white rounded-2xl border border-slate-200 p-5" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#1B2D4F] flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                      {e.avatar_url ? <img src={e.avatar_url} alt="" className="w-full h-full object-cover" /> : initials}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-[15px] leading-snug">{e.full_name}</p>
                      <p className="text-slate-500 text-[13px] leading-snug">{e.headline ?? "Engineer"}</p>
                    </div>
                  </div>
                  {e.is_open_to_work && <span className="inline-block mt-3 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100">Open to work</span>}
                  {e.location && <p className="text-slate-400 text-xs mt-2">{e.location}</p>}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {e.skills.slice(0, 4).map((s) => <span key={s.name} className="bg-slate-100 text-slate-600 text-[11px] font-medium px-2.5 py-1 rounded-md">{s.name}</span>)}
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                    <Link href={`/profile/${e.username}`} target="_blank" className="flex-1 text-center text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg py-2 hover:border-slate-300 transition-colors">View profile</Link>
                    <button onClick={() => setContactTarget(e)} className="flex-1 text-center text-xs font-semibold text-white bg-[#1B2D4F] rounded-lg py-2 hover:bg-[#142240] transition-colors">Contact</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {contactTarget && userId && (
        <ContactModal
          engineer={contactTarget}
          fromUser={userId}
          companyId={companyId}
          onClose={() => setContactTarget(null)}
        />
      )}
    </div>
  );
}

function ContactModal({ engineer, fromUser, companyId, onClose }: {
  engineer: EngineerRow; fromUser: string; companyId: string | null; onClose: () => void;
}) {
  const supabase = createClient();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [engagement, setEngagement] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null);
    const { error } = await supabase.from("contact_requests").insert({
      from_user: fromUser, to_user: engineer.id, company_id: companyId,
      subject: subject || null, message, engagement_type: engagement || null, budget: budget || null,
    });
    if (error) { setError(error.message); setLoading(false); } else { setDone(true); setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 text-[15px]">Contact {engineer.full_name}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        {done ? (
          <div className="px-6 py-12 text-center">
            <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12L9.5 16.5L19 7" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="font-semibold text-slate-900 text-lg mb-2">Request sent</h3>
            <p className="text-slate-500 text-sm">{engineer.full_name} will see it in their inbox and can accept to start a conversation.</p>
            <button onClick={onClose} className="mt-6 bg-[#1B2D4F] text-white font-semibold text-sm px-6 py-2.5 rounded-lg">Done</button>
          </div>
        ) : (
          <form onSubmit={send} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject</label>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Staff Engineer role — Platform team" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Engagement</label>
                <select value={engagement} onChange={(e) => setEngagement(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select…</option>
                  <option value="fulltime">Full-time</option>
                  <option value="contract">Contract</option>
                  <option value="fractional">Fractional</option>
                  <option value="advisory">Advisory</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Budget</label>
                <input value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. $200k or $250/hr" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Message *</label>
              <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={4} placeholder="Tell them about the role and why you're reaching out…" className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            {error && <div className="bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm text-red-700">{error}</div>}
            <button type="submit" disabled={loading} className="w-full bg-[#1B2D4F] hover:bg-[#142240] disabled:opacity-60 text-white font-semibold text-sm py-3 rounded-lg">
              {loading ? "Sending…" : "Send request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

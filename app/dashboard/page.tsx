import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Profile, WorkPreferences, Experience, Skill } from "@/lib/types";
import { AVAILABILITY_LABELS, WORK_LOCATION_LABELS } from "@/lib/types";

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const { data: prefs } = await supabase
    .from("work_preferences")
    .select("*")
    .eq("profile_id", user.id)
    .single<WorkPreferences>();

  const { data: experiences } = await supabase
    .from("experiences")
    .select("*")
    .eq("profile_id", user.id)
    .order("start_date", { ascending: false })
    .returns<Experience[]>();

  const { data: skills } = await supabase
    .from("skills")
    .select("*")
    .eq("profile_id", user.id)
    .returns<Skill[]>();

  if (!profile) redirect("/onboarding");
  if (!profile.onboarding_completed) redirect("/onboarding");

  // Profile completeness
  const checks = [
    !!profile.full_name,
    !!profile.headline,
    !!profile.bio,
    !!profile.avatar_url,
    (experiences?.length ?? 0) > 0,
    (skills?.length ?? 0) > 0,
    !!profile.resume_url,
    !!prefs,
  ];
  const completeness = Math.round((checks.filter(Boolean).length / checks.length) * 100);

  const initials = (profile.full_name ?? "??")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
      {/* Top nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1B2D4F] text-white text-sm font-bold">SE</span>
            <span className="text-[#1B2D4F] font-semibold text-lg hidden sm:block">
              staff<span className="text-[#2563EB]">eng</span><span className="text-slate-300">.co</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/jobs" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">Browse jobs</Link>
            <Link href={`/profile/${profile.username}`} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:block">View profile</Link>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-[#1B2D4F] flex items-center justify-center text-white text-sm font-bold">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name ?? ""} className="w-full h-full object-cover" />
              ) : initials}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left column ── */}
          <div className="lg:col-span-1 space-y-5">
            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
              <div className="h-16 bg-gradient-to-r from-[#1B2D4F] to-[#2563EB]" />
              <div className="px-5 pb-5">
                <div className="-mt-8 mb-3">
                  <div className="w-16 h-16 rounded-2xl border-4 border-white overflow-hidden bg-[#1B2D4F] flex items-center justify-center text-white font-bold text-lg">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : initials}
                  </div>
                </div>
                <h2 className="font-bold text-slate-900 text-lg leading-tight">{profile.full_name}</h2>
                {profile.headline && <p className="text-slate-500 text-sm mt-0.5 leading-snug">{profile.headline}</p>}
                {profile.location && (
                  <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1C4.12 1 3 2.12 3 3.5C3 5.4 5.5 10 5.5 10S8 5.4 8 3.5C8 2.12 6.88 1 5.5 1Z" stroke="currentColor" strokeWidth="1.1"/><circle cx="5.5" cy="3.5" r="0.9" stroke="currentColor" strokeWidth="1"/></svg>
                    {profile.location}
                  </p>
                )}

                {profile.is_open_to_work && (
                  <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Open to work
                  </div>
                )}

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    href="/onboarding"
                    className="text-center bg-[#1B2D4F] hover:bg-[#142240] text-white text-xs font-semibold py-2 rounded-xl transition-colors"
                  >
                    Edit profile
                  </Link>
                  <Link
                    href={`/profile/${profile.username}`}
                    className="text-center border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold py-2 rounded-xl transition-colors"
                  >
                    View profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Profile completeness */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 text-sm">Profile strength</h3>
                <span className="text-sm font-bold text-[#1B2D4F]">{completeness}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${completeness}%`,
                    background: completeness >= 80 ? "#16A34A" : completeness >= 50 ? "#2563EB" : "#F59E0B",
                  }}
                />
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { done: !!profile.full_name && !!profile.headline, label: "Add headline" },
                  { done: !!profile.bio, label: "Write your bio" },
                  { done: !!profile.avatar_url, label: "Upload photo" },
                  { done: (experiences?.length ?? 0) > 0, label: "Add experience" },
                  { done: (skills?.length ?? 0) > 0, label: "Add skills" },
                  { done: !!profile.resume_url, label: "Upload resume" },
                  { done: !!prefs, label: "Set work preferences" },
                ].map(item => (
                  <div key={item.label} className={`flex items-center gap-2 text-xs ${item.done ? "text-slate-400" : "text-slate-600"}`}>
                    {item.done ? (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#DCFCE7"/><path d="M4 7L6 9L10 5" stroke="#16A34A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" fill="#F1F5F9"/><path d="M7 4.5V7.5" stroke="#94A3B8" strokeWidth="1.2" strokeLinecap="round"/><circle cx="7" cy="9.5" r="0.6" fill="#94A3B8"/></svg>
                    )}
                    <span className={item.done ? "line-through" : ""}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences summary */}
            {prefs && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 text-sm">Work preferences</h3>
                  <Link href="/onboarding" className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</Link>
                </div>
                <div className="space-y-2.5 text-xs text-slate-600">
                  {prefs.work_location.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {prefs.work_location.map(l => (
                        <span key={l} className="bg-slate-100 px-2.5 py-1 rounded-lg">{WORK_LOCATION_LABELS[l] ?? l}</span>
                      ))}
                    </div>
                  )}
                  {prefs.employment_type.length > 0 && (
                    <div className="flex gap-1 flex-wrap">
                      {prefs.employment_type.map(l => (
                        <span key={l} className="bg-slate-100 px-2.5 py-1 rounded-lg capitalize">{l.replace("_", "-")}</span>
                      ))}
                    </div>
                  )}
                  <p className="text-slate-500">{AVAILABILITY_LABELS[prefs.availability]}</p>
                  {prefs.on_call && <p className="text-emerald-600">✓ Available for on-call</p>}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Welcome banner */}
            <div className="bg-[#1B2D4F] rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #2563EB, transparent 60%)" }} />
              <div className="relative">
                <h1 className="text-xl font-bold mb-1" style={{ fontFamily: "var(--font-fraunces)" }}>
                  Welcome back, {profile.full_name?.split(" ")[0]} 👋
                </h1>
                <p className="text-white/60 text-sm">
                  {completeness < 100
                    ? `Your profile is ${completeness}% complete. Finish it to get discovered by top companies.`
                    : "Your profile is complete. You're visible to companies on StaffEng."}
                </p>
                {completeness < 100 && (
                  <Link href="/onboarding" className="inline-flex items-center gap-1.5 mt-4 text-xs font-semibold bg-white text-[#1B2D4F] px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">
                    Complete profile →
                  </Link>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { href: "/onboarding", icon: "✏️", label: "Edit profile" },
                { href: `/profile/${profile.username}`, icon: "👁️", label: "Preview profile" },
                { href: "/jobs", icon: "💼", label: "Browse jobs" },
              ].map(action => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="bg-white rounded-2xl border border-slate-200 p-4 text-center hover:border-slate-300 hover:shadow-card-hover transition-all"
                  style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <p className="text-xs font-semibold text-slate-700 mt-2">{action.label}</p>
                </Link>
              ))}
            </div>

            {/* Experience */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-slate-900">Experience</h2>
                <Link href="/onboarding" className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add</Link>
              </div>
              {(experiences?.length ?? 0) === 0 ? (
                <p className="text-slate-400 text-sm">No experience added yet.</p>
              ) : (
                <div className="space-y-5">
                  {experiences!.map((exp) => (
                    <div key={exp.id} className="flex gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                        {exp.company[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{exp.title}</p>
                        <p className="text-slate-500 text-xs">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {exp.start_date} — {exp.is_current ? "Present" : exp.end_date}
                        </p>
                        {exp.description && (
                          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">Skills</h2>
                <Link href="/onboarding" className="text-xs text-blue-600 hover:text-blue-800 font-medium">+ Add</Link>
              </div>
              {(skills?.length ?? 0) === 0 ? (
                <p className="text-slate-400 text-sm">No skills added yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills!.map(skill => (
                    <span key={skill.id} className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1.5 rounded-lg">
                      {skill.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Resume */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Resume</h2>
                <Link href="/onboarding" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                  {profile.resume_url ? "Replace" : "Upload"}
                </Link>
              </div>
              {profile.resume_url ? (
                <div className="mt-3 flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4 2h9l5 5v11a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="#2563EB" strokeWidth="1.5"/>
                    <path d="M13 2v5h5" stroke="#2563EB" strokeWidth="1.5"/>
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{profile.resume_filename ?? "Resume.pdf"}</p>
                    <p className="text-xs text-slate-400">Uploaded</p>
                  </div>
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#2563EB] hover:text-blue-800">
                    View →
                  </a>
                </div>
              ) : (
                <p className="text-slate-400 text-sm mt-2">No resume uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

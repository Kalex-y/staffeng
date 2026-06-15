import { notFound } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Profile, WorkPreferences, Experience, Education, Skill, Achievement } from "@/lib/types";
import { AVAILABILITY_LABELS, WORK_LOCATION_LABELS, EMPLOYMENT_TYPE_LABELS, CONTRACT_TYPE_LABELS } from "@/lib/types";

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const supabase = await createServerSupabaseClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", params.username)
    .single<Profile>();

  if (!profile) notFound();
  if (profile.profile_visibility === "private") {
    return (
      <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#94A3B8" strokeWidth="1.5"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </div>
          <h2 className="font-bold text-slate-900 text-lg mb-1">Private profile</h2>
          <p className="text-slate-500 text-sm">This engineer has set their profile to private.</p>
          <Link href="/engineers" className="inline-block mt-6 text-sm font-semibold text-[#2563EB]">Browse engineers →</Link>
        </div>
      </div>
    );
  }

  const [{ data: prefs }, { data: experiences }, { data: education }, { data: skills }, { data: achievements }] = await Promise.all([
    supabase.from("work_preferences").select("*").eq("profile_id", profile.id).single<WorkPreferences>(),
    supabase.from("experiences").select("*").eq("profile_id", profile.id).order("start_date", { ascending: false }).returns<Experience[]>(),
    supabase.from("education").select("*").eq("profile_id", profile.id).returns<Education[]>(),
    supabase.from("skills").select("*").eq("profile_id", profile.id).returns<Skill[]>(),
    supabase.from("achievements").select("*").eq("profile_id", profile.id).returns<Achievement[]>(),
  ]);

  const initials = (profile.full_name ?? "??").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#1B2D4F] text-white text-xs font-bold">SE</span>
            <span className="text-[#1B2D4F] font-semibold hidden sm:block">staffeng.co</span>
          </Link>
          <Link href="/engineers" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            ← Browse engineers
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* ── Left sidebar ── */}
          <div className="lg:col-span-1 space-y-5">
            {/* Profile card */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
              <div className="h-20 bg-gradient-to-r from-[#1B2D4F] to-[#2563EB]" />
              <div className="px-5 pb-6">
                <div className="-mt-10 mb-3">
                  <div className="w-20 h-20 rounded-2xl border-4 border-white overflow-hidden bg-[#1B2D4F] flex items-center justify-center text-white font-bold text-xl shadow-sm">
                    {profile.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.full_name ?? ""} className="w-full h-full object-cover" />
                    ) : initials}
                  </div>
                </div>

                {profile.is_open_to_work && (
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-emerald-100 mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Open to work
                  </div>
                )}

                <h1 className="font-bold text-slate-900 text-xl leading-tight">{profile.full_name}</h1>
                {profile.headline && <p className="text-slate-500 text-sm mt-1 leading-snug">{profile.headline}</p>}

                {profile.location && (
                  <p className="text-slate-400 text-xs mt-2 flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1C4.12 1 3 2.12 3 3.5C3 5.4 5.5 10 5.5 10S8 5.4 8 3.5C8 2.12 6.88 1 5.5 1Z" stroke="currentColor" strokeWidth="1.1"/><circle cx="5.5" cy="3.5" r="0.9" stroke="currentColor" strokeWidth="1"/></svg>
                    {profile.location}
                  </p>
                )}

                {/* Social links */}
                <div className="flex items-center gap-2 mt-4">
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#475569"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                  )}
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="#475569"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center justify-center transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Work preferences */}
            {prefs && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                <h2 className="font-semibold text-slate-900 text-sm mb-4">Work preferences</h2>
                <div className="space-y-4 text-xs">
                  {prefs.work_location.length > 0 && (
                    <div>
                      <p className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold mb-1.5">Location</p>
                      <div className="flex flex-wrap gap-1.5">
                        {prefs.work_location.map(l => (
                          <span key={l} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">{WORK_LOCATION_LABELS[l] ?? l}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {prefs.employment_type.length > 0 && (
                    <div>
                      <p className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold mb-1.5">Type</p>
                      <div className="flex flex-wrap gap-1.5">
                        {prefs.employment_type.map(l => (
                          <span key={l} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">{EMPLOYMENT_TYPE_LABELS[l] ?? l}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {prefs.contract_type.length > 0 && (
                    <div>
                      <p className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold mb-1.5">Contract</p>
                      <div className="flex flex-wrap gap-1.5">
                        {prefs.contract_type.map(l => (
                          <span key={l} className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg font-medium">{CONTRACT_TYPE_LABELS[l] ?? l}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-slate-400 uppercase tracking-wider text-[10px] font-semibold mb-1">Availability</p>
                    <p className="text-slate-700 font-medium">{AVAILABILITY_LABELS[prefs.availability]}</p>
                  </div>
                  {prefs.on_call && (
                    <p className="text-emerald-600 font-medium flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Available for on-call
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Resume */}
            {profile.resume_url && (
              <a
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white rounded-2xl border border-slate-200 p-4 hover:border-slate-300 transition-all group"
                style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}
              >
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3.5 2h8l4.5 4.5v10a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 012 16.5V3.5A1.5 1.5 0 013.5 2z" stroke="#2563EB" strokeWidth="1.3"/><path d="M11.5 2v4.5H16" stroke="#2563EB" strokeWidth="1.3"/></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">Download Resume</p>
                  <p className="text-slate-400 text-xs truncate">{profile.resume_filename ?? "Resume.pdf"}</p>
                </div>
                <svg className="text-slate-300 group-hover:text-[#2563EB] transition-colors" width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M5 3.5H10.5V9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            )}
          </div>

          {/* ── Main content ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* Bio */}
            {profile.bio && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                <h2 className="font-semibold text-slate-900 mb-3">About</h2>
                <p className="text-slate-600 leading-relaxed text-[15px]">{profile.bio}</p>
              </div>
            )}

            {/* Experience */}
            {(experiences?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                <h2 className="font-semibold text-slate-900 mb-5">Experience</h2>
                <div className="space-y-6">
                  {experiences!.map((exp, i) => (
                    <div key={exp.id} className={`flex gap-4 ${i < experiences!.length - 1 ? "pb-6 border-b border-slate-100" : ""}`}>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 flex-shrink-0">
                        {exp.company[0]}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{exp.title}</p>
                        <p className="text-slate-600 text-sm">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                        <p className="text-slate-400 text-xs mt-0.5">
                          {new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          {" — "}
                          {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                        </p>
                        {exp.description && (
                          <p className="text-slate-500 text-sm mt-2 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {(skills?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                <h2 className="font-semibold text-slate-900 mb-4">Skills & expertise</h2>
                <div className="flex flex-wrap gap-2">
                  {skills!.map(skill => (
                    <span key={skill.id} className="bg-slate-100 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-xl">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {(achievements?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                <h2 className="font-semibold text-slate-900 mb-5">Achievements</h2>
                <div className="space-y-5">
                  {achievements!.map((achv, i) => (
                    <div key={achv.id} className={`${i < achievements!.length - 1 ? "pb-5 border-b border-slate-100" : ""}`}>
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-semibold text-slate-900 text-sm">{achv.title}</h3>
                        {achv.date && (
                          <span className="text-xs text-slate-400 flex-shrink-0">
                            {new Date(achv.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </span>
                        )}
                      </div>
                      {achv.description && <p className="text-slate-500 text-sm mt-1 leading-relaxed">{achv.description}</p>}
                      {achv.url && (
                        <a href={achv.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                          {achv.url} →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {(education?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                <h2 className="font-semibold text-slate-900 mb-5">Education</h2>
                <div className="space-y-4">
                  {education!.map(edu => (
                    <div key={edu.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 flex-shrink-0">
                        {edu.institution[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{edu.institution}</p>
                        {edu.degree && <p className="text-slate-600 text-sm">{edu.degree}{edu.field_of_study ? ` · ${edu.field_of_study}` : ""}</p>}
                        {edu.start_year && <p className="text-slate-400 text-xs mt-0.5">{edu.start_year} — {edu.end_year ?? "Present"}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// ─── Types ───────────────────────────────────────────────────────────────────

type ExperienceEntry = {
  company: string; title: string; location: string;
  start_date: string; end_date: string; is_current: boolean; description: string;
};
type EducationEntry = {
  institution: string; degree: string; field_of_study: string;
  start_year: string; end_year: string;
};
type AchievementEntry = { title: string; description: string; date: string; url: string; };

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i < current ? "bg-[#1B2D4F] w-8" : i === current ? "bg-[#2563EB] w-8" : "bg-slate-200 w-4"}`} />
      ))}
      <span className="ml-2 text-xs text-slate-400 font-medium">{current + 1} / {total}</span>
    </div>
  );
}

// ─── Checkbox pill ────────────────────────────────────────────────────────────

function Pill({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
        selected
          ? "bg-[#1B2D4F] text-white border-[#1B2D4F]"
          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
    >
      {selected && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {label}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
const textareaCls = inputCls + " resize-none";

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Step 1 — Identity
  const [fullName, setFullName]       = useState("");
  const [headline, setHeadline]       = useState("");
  const [location, setLocation]       = useState("");
  const [bio, setBio]                 = useState("");
  const [avatarFile, setAvatarFile]   = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [websiteUrl, setWebsiteUrl]   = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl]     = useState("");

  // Step 2 — Experience
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([]);
  const [newExp, setNewExp] = useState<ExperienceEntry>({
    company: "", title: "", location: "", start_date: "", end_date: "", is_current: false, description: "",
  });
  const [addingExp, setAddingExp] = useState(false);

  // Step 3 — Skills
  const [skills, setSkills]           = useState<string[]>([]);
  const [skillInput, setSkillInput]   = useState("");

  // Step 4 — Achievements
  const [achievements, setAchievements] = useState<AchievementEntry[]>([]);
  const [newAchv, setNewAchv] = useState<AchievementEntry>({ title: "", description: "", date: "", url: "" });
  const [addingAchv, setAddingAchv] = useState(false);

  // Step 5 — Preferences
  const [workLocation, setWorkLocation]   = useState<string[]>([]);
  const [employmentType, setEmploymentType] = useState<string[]>([]);
  const [contractType, setContractType]   = useState<string[]>([]);
  const [onCall, setOnCall]               = useState(false);
  const [availability, setAvailability]   = useState("open");
  const [resumeFile, setResumeFile]       = useState<File | null>(null);
  const [resumeName, setResumeName]       = useState("");
  const [visibility, setVisibility]       = useState<"public" | "private">("public");
  const [isOpenToWork, setIsOpenToWork]   = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/auth/login"); return; }
      setUser(user);
      setFullName(user.user_metadata?.full_name ?? "");
      if (user.user_metadata?.avatar_url) setAvatarPreview(user.user_metadata.avatar_url);
    });
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResumeFile(file);
    setResumeName(file.name);
  };

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) setSkills([...skills, s]);
    setSkillInput("");
  };

  const addExperience = () => {
    if (!newExp.company || !newExp.title || !newExp.start_date) return;
    setExperiences([...experiences, newExp]);
    setNewExp({ company: "", title: "", location: "", start_date: "", end_date: "", is_current: false, description: "" });
    setAddingExp(false);
  };

  const addAchievement = () => {
    if (!newAchv.title) return;
    setAchievements([...achievements, newAchv]);
    setNewAchv({ title: "", description: "", date: "", url: "" });
    setAddingAchv(false);
  };

  const toggle = (arr: string[], setArr: (v: string[]) => void, val: string) => {
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);

    try {
      // Upload avatar
      let avatarUrl = avatarPreview;
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const { data } = await supabase.storage
          .from("avatars")
          .upload(`${user.id}/avatar.${ext}`, avatarFile, { upsert: true });
        if (data) {
          const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
          avatarUrl = urlData.publicUrl;
        }
      }

      // Upload resume
      let resumeUrl = null;
      let resumeFilename = null;
      if (resumeFile) {
        const ext = resumeFile.name.split(".").pop();
        const { data } = await supabase.storage
          .from("resumes")
          .upload(`${user.id}/resume.${ext}`, resumeFile, { upsert: true });
        if (data) {
          const { data: urlData } = await supabase.storage.from("resumes").createSignedUrl(data.path, 60 * 60 * 24 * 365);
          resumeUrl = urlData?.signedUrl ?? null;
          resumeFilename = resumeFile.name;
        }
      }

      // Upsert profile
      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: fullName,
        headline,
        location,
        bio,
        avatar_url: avatarUrl,
        website_url: websiteUrl || null,
        linkedin_url: linkedinUrl || null,
        github_url: githubUrl || null,
        profile_visibility: visibility,
        is_open_to_work: isOpenToWork,
        resume_url: resumeUrl,
        resume_filename: resumeFilename,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      });

      // Work preferences
      await supabase.from("work_preferences").upsert({
        profile_id: user.id,
        work_location: workLocation,
        employment_type: employmentType,
        contract_type: contractType,
        on_call: onCall,
        availability,
        updated_at: new Date().toISOString(),
      });

      // Experience
      if (experiences.length > 0) {
        await supabase.from("experiences").delete().eq("profile_id", user.id);
        await supabase.from("experiences").insert(
          experiences.map(e => ({ ...e, profile_id: user.id }))
        );
      }

      // Skills
      if (skills.length > 0) {
        await supabase.from("skills").delete().eq("profile_id", user.id);
        await supabase.from("skills").insert(
          skills.map(name => ({ profile_id: user.id, name }))
        );
      }

      // Achievements
      if (achievements.length > 0) {
        await supabase.from("achievements").delete().eq("profile_id", user.id);
        await supabase.from("achievements").insert(
          achievements.map(a => ({ ...a, profile_id: user.id, date: a.date || null, url: a.url || null }))
        );
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const steps = [
    "Your identity",
    "Experience",
    "Skills",
    "Achievements",
    "Preferences",
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#1B2D4F] text-white text-xs font-bold">SE</span>
            <span className="text-slate-400 text-sm">Profile setup</span>
          </div>
          <StepIndicator current={step} total={steps.length} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Step header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-2">
            Step {step + 1} — {steps[step]}
          </p>
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-fraunces)" }}>
            {step === 0 && "Let's build your profile"}
            {step === 1 && "Your work experience"}
            {step === 2 && "Skills & expertise"}
            {step === 3 && "Notable achievements"}
            {step === 4 && "Preferences & availability"}
          </h1>
          <p className="text-slate-500 mt-2 text-[15px]">
            {step === 0 && "This is what companies and other engineers will see first."}
            {step === 1 && "Add your most relevant roles. You can always edit this later."}
            {step === 2 && "What do you know best? Add skills and technologies."}
            {step === 3 && "Open source, publications, side projects, awards — anything noteworthy."}
            {step === 4 && "Tell companies how and when you want to work."}
          </p>
        </div>

        {/* ── Step 1: Identity ── */}
        {step === 0 && (
          <div className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border-2 border-slate-200 hover:border-blue-400"
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="11" r="5" stroke="#94A3B8" strokeWidth="1.5"/>
                    <path d="M4 24c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm font-semibold text-[#2563EB] hover:text-blue-800 transition-colors"
                >
                  Upload photo
                </button>
                <p className="text-[11px] text-slate-400 mt-0.5">JPG or PNG, max 5MB</p>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>

            <Field label="Full name *">
              <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Smith" className={inputCls} required />
            </Field>

            <Field label="Professional headline" hint="e.g. Staff Engineer · Distributed Systems · Ex-Stripe">
              <input type="text" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Staff Engineer · Platform Infrastructure" className={inputCls} />
            </Field>

            <Field label="Location">
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="San Francisco, CA — or Remote" className={inputCls} />
            </Field>

            <Field label="About" hint="Write a short bio — what you build, what you care about, what you're looking for.">
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="I'm a Staff Engineer specialising in distributed systems..." rows={4} className={textareaCls} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Website">
                <input type="url" value={websiteUrl} onChange={e => setWebsiteUrl(e.target.value)} placeholder="https://yoursite.com" className={inputCls} />
              </Field>
              <Field label="LinkedIn">
                <input type="url" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} placeholder="linkedin.com/in/…" className={inputCls} />
              </Field>
              <Field label="GitHub">
                <input type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} placeholder="github.com/…" className={inputCls} />
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 2: Experience ── */}
        {step === 1 && (
          <div className="space-y-4">
            {experiences.map((exp, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{exp.title}</p>
                    <p className="text-slate-500 text-sm">{exp.company}{exp.location ? ` · ${exp.location}` : ""}</p>
                    <p className="text-slate-400 text-xs mt-1">{exp.start_date} — {exp.is_current ? "Present" : exp.end_date}</p>
                  </div>
                  <button onClick={() => setExperiences(experiences.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
                {exp.description && <p className="text-slate-500 text-sm mt-2 leading-relaxed">{exp.description}</p>}
              </div>
            ))}

            {addingExp ? (
              <div className="bg-white rounded-2xl border border-blue-200 p-6 space-y-4" style={{ boxShadow: "0 0 0 3px rgba(37,99,235,0.08)" }}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Job title *">
                    <input value={newExp.title} onChange={e => setNewExp({ ...newExp, title: e.target.value })} placeholder="Staff Engineer" className={inputCls} />
                  </Field>
                  <Field label="Company *">
                    <input value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} placeholder="Acme Inc." className={inputCls} />
                  </Field>
                </div>
                <Field label="Location">
                  <input value={newExp.location} onChange={e => setNewExp({ ...newExp, location: e.target.value })} placeholder="San Francisco, CA" className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Start date *">
                    <input type="month" value={newExp.start_date} onChange={e => setNewExp({ ...newExp, start_date: e.target.value })} className={inputCls} />
                  </Field>
                  {!newExp.is_current && (
                    <Field label="End date">
                      <input type="month" value={newExp.end_date} onChange={e => setNewExp({ ...newExp, end_date: e.target.value })} className={inputCls} />
                    </Field>
                  )}
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={newExp.is_current} onChange={e => setNewExp({ ...newExp, is_current: e.target.checked })} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-slate-700">I currently work here</span>
                </label>
                <Field label="Description">
                  <textarea value={newExp.description} onChange={e => setNewExp({ ...newExp, description: e.target.value })} placeholder="What did you build? What was your impact?" rows={3} className={textareaCls} />
                </Field>
                <div className="flex gap-3">
                  <button onClick={addExperience} className="bg-[#1B2D4F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#142240] transition-colors">
                    Add experience
                  </button>
                  <button onClick={() => setAddingExp(false)} className="text-sm font-medium text-slate-500 hover:text-slate-700 px-4 py-2.5">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingExp(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl py-4 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Add experience
              </button>
            )}
          </div>
        )}

        {/* ── Step 3: Skills ── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                placeholder="e.g. Distributed Systems, Go, LLM Integration…"
                className={inputCls + " flex-1"}
              />
              <button onClick={addSkill} className="bg-[#1B2D4F] text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-[#142240] transition-colors whitespace-nowrap">
                Add skill
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium px-3 py-1.5 rounded-xl">
                    {skill}
                    <button onClick={() => setSkills(skills.filter(s => s !== skill))} className="text-slate-300 hover:text-red-400 transition-colors">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 2L8 8M2 8L8 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div>
              <p className="text-xs text-slate-400 mb-3">Common skills to add:</p>
              <div className="flex flex-wrap gap-2">
                {["TypeScript", "Python", "Go", "Rust", "Kubernetes", "AWS", "Distributed Systems", "Platform Engineering", "LLM Integration", "Agentic Systems", "ML Infrastructure", "System Design"].filter(s => !skills.includes(s)).map(s => (
                  <button key={s} onClick={() => setSkills([...skills, s])} className="text-xs text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Achievements ── */}
        {step === 3 && (
          <div className="space-y-4">
            {achievements.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{a.title}</p>
                    {a.date && <p className="text-slate-400 text-xs mt-0.5">{a.date}</p>}
                    {a.description && <p className="text-slate-500 text-sm mt-1 leading-relaxed">{a.description}</p>}
                    {a.url && <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 mt-1 inline-block hover:underline">{a.url}</a>}
                  </div>
                  <button onClick={() => setAchievements(achievements.filter((_, j) => j !== i))} className="text-slate-300 hover:text-red-400 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M4 12L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>
            ))}

            {addingAchv ? (
              <div className="bg-white rounded-2xl border border-blue-200 p-6 space-y-4" style={{ boxShadow: "0 0 0 3px rgba(37,99,235,0.08)" }}>
                <Field label="Title *">
                  <input value={newAchv.title} onChange={e => setNewAchv({ ...newAchv, title: e.target.value })} placeholder="e.g. Built Stripe's async payment engine" className={inputCls} />
                </Field>
                <Field label="Description">
                  <textarea value={newAchv.description} onChange={e => setNewAchv({ ...newAchv, description: e.target.value })} placeholder="What was the impact? Scale? Outcome?" rows={3} className={textareaCls} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date">
                    <input type="month" value={newAchv.date} onChange={e => setNewAchv({ ...newAchv, date: e.target.value })} className={inputCls} />
                  </Field>
                  <Field label="URL">
                    <input type="url" value={newAchv.url} onChange={e => setNewAchv({ ...newAchv, url: e.target.value })} placeholder="https://…" className={inputCls} />
                  </Field>
                </div>
                <div className="flex gap-3">
                  <button onClick={addAchievement} className="bg-[#1B2D4F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#142240] transition-colors">
                    Add achievement
                  </button>
                  <button onClick={() => setAddingAchv(false)} className="text-sm font-medium text-slate-500 hover:text-slate-700 px-4 py-2.5">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingAchv(true)}
                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl py-4 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Add achievement
              </button>
            )}
          </div>
        )}

        {/* ── Step 5: Preferences ── */}
        {step === 4 && (
          <div className="space-y-8">
            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Work location</p>
              <div className="flex flex-wrap gap-2">
                {[["remote", "Remote"], ["hybrid", "Hybrid"], ["onsite", "On-site"]].map(([val, label]) => (
                  <Pill key={val} label={label} selected={workLocation.includes(val)} onClick={() => toggle(workLocation, setWorkLocation, val)} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Employment type</p>
              <div className="flex flex-wrap gap-2">
                {[["full_time", "Full-time"], ["part_time", "Part-time"]].map(([val, label]) => (
                  <Pill key={val} label={label} selected={employmentType.includes(val)} onClick={() => toggle(employmentType, setEmploymentType, val)} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Contract type</p>
              <div className="flex flex-wrap gap-2">
                {[["permanent", "Permanent"], ["temporary", "Temporary"], ["contract", "Contract"], ["freelance", "Freelance"]].map(([val, label]) => (
                  <Pill key={val} label={label} selected={contractType.includes(val)} onClick={() => toggle(contractType, setContractType, val)} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">On-call availability</p>
              <div className="flex gap-2">
                <Pill label="Available for on-call" selected={onCall} onClick={() => setOnCall(true)} />
                <Pill label="Not available for on-call" selected={!onCall} onClick={() => setOnCall(false)} />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">When are you available?</p>
              <div className="flex flex-wrap gap-2">
                {[["immediately", "Immediately"], ["one_month", "In 1 month"], ["three_months", "In 3 months"], ["open", "Open to chat"], ["not_looking", "Not looking"]].map(([val, label]) => (
                  <Pill key={val} label={label} selected={availability === val} onClick={() => setAvailability(val)} />
                ))}
              </div>
            </div>

            {/* Open to work */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900 text-sm">Open to work</p>
                <p className="text-slate-500 text-xs mt-0.5">Show a badge on your profile that you&rsquo;re open to opportunities</p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpenToWork(!isOpenToWork)}
                className={`relative w-12 h-6 rounded-full transition-colors ${isOpenToWork ? "bg-emerald-500" : "bg-slate-200"}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${isOpenToWork ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>

            {/* Resume upload */}
            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Resume / CV</p>
              <div
                className="border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl p-8 text-center cursor-pointer transition-colors"
                onClick={() => resumeInputRef.current?.click()}
              >
                {resumeName ? (
                  <div className="flex items-center justify-center gap-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 2h9l5 5v11a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="#16A34A" strokeWidth="1.5"/>
                      <path d="M13 2v5h5" stroke="#16A34A" strokeWidth="1.5"/>
                    </svg>
                    <span className="font-medium text-slate-700 text-sm">{resumeName}</span>
                    <span className="text-emerald-600 text-xs font-medium">Uploaded</span>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto mb-3 text-slate-300" width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path d="M6 4h14l8 8v16a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M20 4v8h8" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M16 14v10M11 19l5-5 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <p className="font-medium text-slate-600 text-sm">Click to upload your resume</p>
                    <p className="text-slate-400 text-xs mt-1">PDF, max 10MB</p>
                  </>
                )}
              </div>
              <input ref={resumeInputRef} type="file" accept=".pdf" className="hidden" onChange={handleResumeChange} />
            </div>

            {/* Visibility */}
            <div>
              <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">Profile visibility</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: "public" as const, icon: "🌐", title: "Public", desc: "Anyone can find and view your profile" },
                  { val: "private" as const, icon: "🔒", title: "Private", desc: "Only visible to companies you share it with" },
                ].map(opt => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => setVisibility(opt.val)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all ${visibility === opt.val ? "border-[#1B2D4F] bg-white" : "border-slate-200 bg-white hover:border-slate-300"}`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <p className="font-semibold text-slate-900 text-sm mt-2">{opt.title}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="mt-10 flex items-center justify-between pt-6 border-t border-slate-200">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : router.push("/")}
            className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
          >
            ← {step === 0 ? "Back to home" : "Previous"}
          </button>

          <div className="flex items-center gap-3">
            {step < 4 && (
              <button onClick={() => setStep(step + 1)} className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Skip for now
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="bg-[#1B2D4F] hover:bg-[#142240] text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
              >
                Save & continue →
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={saving}
                className="bg-[#1B2D4F] hover:bg-[#142240] disabled:opacity-60 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Saving profile…
                  </>
                ) : "Complete profile →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

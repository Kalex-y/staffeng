"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const inputCls = "w-full border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";

export default function EmployerOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [size, setSize] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.push("/employers/signup"); return; }
      setUser(user);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      let logoUrl: string | null = null;
      if (logoFile) {
        const ext = logoFile.name.split(".").pop();
        const { data } = await supabase.storage.from("logos").upload(`${user.id}/logo.${ext}`, logoFile, { upsert: true });
        if (data) { logoUrl = supabase.storage.from("logos").getPublicUrl(data.path).data.publicUrl; }
      }

      const slugBase = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "company";
      const slug = `${slugBase}-${user.id.slice(0, 6)}`;

      await supabase.from("profiles").update({ account_type: "employer" }).eq("id", user.id);

      const { error: cErr } = await supabase.from("companies").insert({
        owner_id: user.id,
        name,
        slug,
        logo_url: logoUrl,
        website_url: website || null,
        industry: industry || null,
        company_size: size || null,
        location: location || null,
        description: description || null,
      });
      if (cErr) throw cErr;

      router.push("/employers/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center gap-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#1B2D4F] text-white text-xs font-bold">SE</span>
          <span className="text-slate-400 text-sm">Company setup</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900" style={{ fontFamily: "var(--font-fraunces)" }}>Tell us about your company</h1>
          <p className="text-slate-500 mt-2 text-[15px]">This is what engineers see when you post roles or reach out.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-5">
            <div onClick={() => logoRef.current?.click()} className="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center overflow-hidden cursor-pointer border-2 border-slate-200 hover:border-blue-400">
              {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-slate-400 text-xs">Logo</span>}
            </div>
            <div>
              <button type="button" onClick={() => logoRef.current?.click()} className="text-sm font-semibold text-[#2563EB] hover:text-blue-800">Upload logo</button>
              <p className="text-[11px] text-slate-400 mt-0.5">PNG or JPG</p>
            </div>
            <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company name *</label>
            <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Acme Inc." className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Website</label>
              <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://acme.com" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Industry</label>
              <input value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="AI / SaaS" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company size</label>
              <select value={size} onChange={(e) => setSize(e.target.value)} className={inputCls + " bg-white"}>
                <option value="">Select…</option>
                <option>1–10</option><option>11–50</option><option>51–200</option><option>201–500</option><option>500+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco / Remote" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">About the company</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="What you build, your mission, your team…" className={inputCls + " resize-none"} />
          </div>

          {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>}

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button type="submit" disabled={saving} className="bg-[#1B2D4F] hover:bg-[#142240] disabled:opacity-60 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-colors">
              {saving ? "Saving…" : "Create company →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

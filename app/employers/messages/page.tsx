"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

type Prof = { id: string; full_name: string | null; username: string | null; avatar_url: string | null; headline: string | null; linkedin_url: string | null; github_url: string | null; website_url: string | null };
type Req = {
  id: string; from_user: string; to_user: string; subject: string | null; message: string;
  engagement_type: string | null; budget: string | null; status: string; created_at: string;
  eng?: Prof;
};
type Msg = { id: string; sender_id: string; body: string; created_at: string };

export default function EmployerMessagesPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [reqs, setReqs] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatWith, setChatWith] = useState<Req | null>(null);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    setUserId(user.id);
    const { data } = await supabase
      .from("contact_requests")
      .select("*")
      .eq("from_user", user.id)
      .order("created_at", { ascending: false });
    let list = (data as Req[]) ?? [];
    const ids = [...new Set(list.map((r) => r.to_user))];
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, headline, linkedin_url, github_url, website_url")
        .in("id", ids);
      const map = new Map((profs ?? []).map((p) => [p.id, p as Prof]));
      list = list.map((r) => ({ ...r, eng: map.get(r.to_user) }));
    }
    setReqs(list); setLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen bg-[#F7F6F3]" style={{ fontFamily: "var(--font-jakarta)" }}>
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center gap-2">
          <Link href="/employers/dashboard" className="text-slate-400 text-sm">← Dashboard</Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-900 text-sm">Messages</span>
        </div>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-[#0F172A] mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>Messages</h1>
        {loading ? (
          <p className="text-slate-400 text-sm">Loading…</p>
        ) : reqs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <p className="font-semibold text-slate-900">No outreach yet</p>
            <p className="text-slate-500 text-sm mt-1 mb-4">Find engineers and send your first message.</p>
            <Link href="/employers/engineers" className="inline-block bg-[#1B2D4F] text-white text-sm font-semibold px-5 py-2.5 rounded-xl">Find engineers</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reqs.map((r) => {
              const eng = r.eng;
              const initials = (eng?.full_name ?? "??").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
              return (
                <div key={r.id} className="bg-white rounded-2xl border border-slate-200 p-5" style={{ boxShadow: "0 1px 3px 0 rgba(15,23,42,0.06)" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B2D4F] flex items-center justify-center text-white text-xs font-bold overflow-hidden">
                      {eng?.avatar_url ? <img src={eng.avatar_url} alt="" className="w-full h-full object-cover" /> : initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{eng?.full_name ?? "Engineer"}</p>
                          {eng?.headline && <p className="text-slate-500 text-xs">{eng.headline}</p>}
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.status === "accepted" ? "bg-emerald-50 text-emerald-700" : r.status === "declined" ? "bg-slate-100 text-slate-500" : "bg-amber-50 text-amber-700"}`}>{r.status}</span>
                      </div>
                      {r.subject && <p className="text-slate-700 text-sm font-medium mt-2">{r.subject}</p>}
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed">{r.message}</p>

                      {r.status === "accepted" && eng && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                          <p className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide mb-2">Contact unlocked</p>
                          <div className="flex flex-wrap gap-2 items-center">
                            {eng.username && <Link href={`/profile/${eng.username}`} target="_blank" className="text-xs font-semibold text-slate-700 border border-slate-200 rounded-lg px-3 py-1.5 hover:border-slate-300">View profile</Link>}
                            {eng.linkedin_url && <a href={eng.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-800">LinkedIn</a>}
                            {eng.github_url && <a href={eng.github_url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-800">GitHub</a>}
                            {eng.website_url && <a href={eng.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-slate-800">Website</a>}
                            <button onClick={() => setChatWith(r)} className="ml-auto bg-[#1B2D4F] hover:bg-[#142240] text-white text-xs font-semibold px-4 py-1.5 rounded-lg">Open chat</button>
                          </div>
                        </div>
                      )}
                      {r.status === "pending" && <p className="text-xs text-amber-600 mt-3">Waiting for {eng?.full_name?.split(" ")[0] ?? "the engineer"} to respond.</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {chatWith && userId && chatWith.eng && (
        <ChatPanel me={userId} other={chatWith.to_user} otherName={chatWith.eng.full_name ?? "Engineer"} onClose={() => setChatWith(null)} />
      )}
    </div>
  );
}

function ChatPanel({ me, other, otherName, onClose }: { me: string; other: string; otherName: string; onClose: () => void }) {
  const supabase = createClient();
  const [convoId, setConvoId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  const loadMsgs = useCallback(async (cid: string) => {
    const { data } = await supabase.from("messages").select("*").eq("conversation_id", cid).order("created_at", { ascending: true });
    setMsgs((data as Msg[]) ?? []);
  }, [supabase]);

  useEffect(() => {
    (async () => {
      const [a, b] = [me, other].sort();
      let { data } = await supabase.from("conversations").select("id").eq("user_a", a).eq("user_b", b).maybeSingle();
      if (!data) {
        const ins = await supabase.from("conversations").upsert({ user_a: a, user_b: b }, { onConflict: "user_a,user_b" }).select("id").maybeSingle();
        data = ins.data;
      }
      if (data) { setConvoId(data.id); loadMsgs(data.id); }
    })();
  }, [me, other, supabase, loadMsgs]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convoId || !text.trim()) return;
    await supabase.from("messages").insert({ conversation_id: convoId, sender_id: me, body: text.trim() });
    await supabase.from("conversations").update({ last_message_at: new Date().toISOString() }).eq("id", convoId);
    setText("");
    loadMsgs(convoId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-md h-[80vh] sm:h-[70vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="font-semibold text-slate-900 text-sm">{otherName}</p>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {msgs.length === 0 ? (
            <p className="text-slate-400 text-xs text-center mt-8">No messages yet. Say hello 👋</p>
          ) : msgs.map((m) => (
            <div key={m.id} className={`flex ${m.sender_id === me ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${m.sender_id === me ? "bg-[#1B2D4F] text-white" : "bg-slate-100 text-slate-800"}`}>{m.body}</div>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="p-3 border-t border-slate-100 flex gap-2">
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="bg-[#1B2D4F] text-white text-sm font-semibold px-4 rounded-xl">Send</button>
        </form>
      </div>
    </div>
  );
}

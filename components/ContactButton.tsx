"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

export default function ContactButton({
  toUserId,
}: {
  toUserId: string;
}) {
  const supabase = createClient();
  const [meId, setMeId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setMeId(user?.id ?? null);

      if (user && user.id !== toUserId) {
        const { data } = await supabase
          .from("contact_requests")
          .select("id")
          .eq("from_user", user.id)
          .eq("to_user", toUserId)
          .limit(1);
        if (data && data.length > 0) setAlreadySent(true);
      }
      setChecked(true);
    })();
  }, [supabase, toUserId]);

  // Avoid layout flash before we know the viewer.
  if (!checked) {
    return (
      <div className="mt-5 h-11 rounded-xl bg-slate-100 animate-pulse" />
    );
  }

  // Viewing your own profile.
  if (meId === toUserId) {
    return (
      <Link
        href="/dashboard"
        className="mt-5 block text-center w-full rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm py-3 hover:bg-slate-50 transition-colors"
      >
        Edit your profile
      </Link>
    );
  }

  // Logged out.
  if (!meId) {
    return (
      <Link
        href="/auth/login"
        className="mt-5 block text-center w-full rounded-xl bg-[#1B2D4F] text-white font-semibold text-sm py-3 hover:bg-[#142240] transition-colors"
      >
        Sign in to contact
      </Link>
    );
  }

  // Already requested, or just sent.
  if (sent || alreadySent) {
    return (
      <div className="mt-5 flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold text-sm py-3">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Contact request sent
      </div>
    );
  }

  async function send() {
    if (!meId) return;
    setSending(true);
    setError(null);
    const { error } = await supabase.from("contact_requests").insert({
      from_user: meId,
      to_user: toUserId,
      message: message.trim() || null,
      status: "pending",
    });
    if (error) {
      setError(error.message);
      setSending(false);
      return;
    }
    setSent(true);
    setSending(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-5 w-full rounded-xl bg-[#1B2D4F] text-white font-semibold text-sm py-3 hover:bg-[#142240] transition-colors"
      >
        Request contact
      </button>
    );
  }

  return (
    <div className="mt-5">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
        placeholder="Add a short note (optional) — what you're hiring for…"
        className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">{error}</p>
      )}
      <div className="flex gap-2 mt-2">
        <button
          onClick={send}
          disabled={sending}
          className="flex-1 rounded-xl bg-[#1B2D4F] text-white font-semibold text-sm py-2.5 hover:bg-[#142240] transition-colors disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send request"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-xl border border-slate-300 text-slate-600 font-medium text-sm px-4 py-2.5 hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

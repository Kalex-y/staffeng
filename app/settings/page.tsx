"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      setEmail(user.email ?? "");
      setLoading(false);
    })();
  }, [supabase, router]);

  async function handleDelete() {
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    setError(null);

    try {
      const res = await fetch("/api/delete-account", { method: "POST" });
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Something went wrong. Please try again.");
        setDeleting(false);
        return;
      }

      // Clear the local session and send them home.
      await supabase.auth.signOut();
      router.push("/?deleted=1");
    } catch {
      setError("Network error. Please try again.");
      setDeleting(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Account settings
          </h1>
          <Link
            href="/dashboard"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Account info */}
        <div className="rounded-xl bg-white border border-slate-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-3">
            Account
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm text-slate-700">{email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg border border-slate-300 text-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Danger zone */}
        <div className="rounded-xl bg-white border border-red-200 p-6">
          <h2 className="text-sm font-semibold text-red-700 mb-1">
            Delete account
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            This permanently deletes your account, profile, messages, and any
            roles or applications tied to it. This cannot be undone.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <label className="block text-sm text-slate-600 mb-2">
            Type <span className="font-semibold">DELETE</span> to confirm
          </label>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300"
          />
          <button
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || deleting}
            className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting…" : "Permanently delete my account"}
          </button>
        </div>
      </div>
    </div>
  );
}

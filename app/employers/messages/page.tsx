"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

type PartyProfile = {
  id: string;
  username: string | null;
  full_name: string | null;
  headline: string | null;
  avatar_url: string | null;
  contact_email: string | null;
  location: string | null;
};

type RequestRow = {
  id: string;
  from_user: string;
  to_user: string;
  status: string;
  message: string | null;
  created_at: string;
  conversation_id: string | null;
  // resolved client-side:
  direction: "sent" | "received";
  otherId: string;
  other: PartyProfile | null;
};

export default function EmployerMessagesPage() {
  const supabase = createClient();
  const router = useRouter();

  const [meId, setMeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [active, setActive] = useState<RequestRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }
    setMeId(user.id);

    // Requests in BOTH directions (RLS allows from_user or to_user = me)
    const { data: reqs, error: reqErr } = await supabase
      .from("contact_requests")
      .select(
        "id, from_user, to_user, status, message, created_at, conversation_id"
      )
      .or("from_user.eq." + user.id + ",to_user.eq." + user.id)
      .order("created_at", { ascending: false });

    if (reqErr) {
      setError(reqErr.message);
      setLoading(false);
      return;
    }

    const list = reqs ?? [];

    // Collect the "other party" ids to fetch their profiles in one query
    const otherIds = Array.from(
      new Set(
        list.map((r) => (r.from_user === user.id ? r.to_user : r.from_user))
      )
    );

    let profileMap: Record<string, PartyProfile> = {};
    if (otherIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select(
          "id, username, full_name, headline, avatar_url, contact_email, location"
        )
        .in("id", otherIds);

      profileMap = Object.fromEntries(
        (profs ?? []).map((p) => [p.id, p as PartyProfile])
      );
    }

    const resolved: RequestRow[] = list.map((r) => {
      const direction: "sent" | "received" =
        r.from_user === user.id ? "sent" : "received";
      const otherId = direction === "sent" ? r.to_user : r.from_user;
      return {
        ...r,
        direction,
        otherId,
        other: profileMap[otherId] ?? null,
      };
    });

    setRows(resolved);
    setLoading(false);
  }, [supabase, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function respond(row: RequestRow, status: "accepted" | "declined") {
    if (!meId) return;

    // Only the recipient can accept/decline
    if (row.to_user !== meId) return;

    let conversationId = row.conversation_id;

    if (status === "accepted" && !conversationId) {
      // Create (or reuse) a conversation between the two parties
      const { data: convo } = await supabase
        .from("conversations")
        .insert({
          user_a: row.from_user,
          user_b: row.to_user,
        })
        .select("id")
        .single();
      conversationId = convo?.id ?? null;
    }

    await supabase
      .from("contact_requests")
      .update({ status, conversation_id: conversationId })
      .eq("id", row.id);

    await load();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading messages…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Messages</h1>
            <p className="text-slate-500 text-sm mt-1">
              Contact requests and conversations with engineers.
            </p>
          </div>
          <Link
            href="/employers/dashboard"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            ← Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {rows.length === 0 ? (
          <div className="rounded-xl bg-white border border-slate-200 p-10 text-center">
            <p className="text-slate-600 font-medium">No messages yet.</p>
            <p className="text-slate-400 text-sm mt-1">
              When you contact an engineer — or one reaches out to you — it
              shows up here.
            </p>
            <Link
              href="/employers/engineers"
              className="inline-block mt-5 rounded-lg bg-indigo-600 text-white px-5 py-2.5 text-sm font-medium hover:bg-indigo-700"
            >
              Find engineers
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-[340px_1fr] gap-6">
            {/* List */}
            <div className="space-y-3">
              {rows.map((row) => {
                const name =
                  row.other?.full_name || row.other?.username || "Engineer";
                const isActive = active?.id === row.id;
                return (
                  <button
                    key={row.id}
                    onClick={() => setActive(row)}
                    className={`w-full text-left rounded-xl border p-4 transition ${
                      isActive
                        ? "bg-white border-indigo-300 ring-2 ring-indigo-100"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500 text-sm font-medium">
                        {row.other?.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={row.other.avatar_url}
                            alt={name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 truncate">
                          {name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {row.other?.headline || row.other?.location || "—"}
                        </p>
                      </div>
                      <StatusBadge status={row.status} />
                    </div>
                    <p className="mt-2 text-[11px] uppercase tracking-wide text-slate-400">
                      {row.direction === "sent" ? "You contacted them" : "They contacted you"}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Detail */}
            <div>
              {active ? (
                <RequestDetail
                  key={active.id}
                  row={active}
                  meId={meId!}
                  onRespond={respond}
                  supabase={supabase}
                />
              ) : (
                <div className="rounded-xl bg-white border border-slate-200 p-10 text-center text-slate-400">
                  Select a message to view it.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    accepted: "bg-green-50 text-green-700 border-green-200",
    declined: "bg-slate-100 text-slate-500 border-slate-200",
  };
  const cls = map[status] ?? "bg-slate-100 text-slate-500 border-slate-200";
  return (
    <span
      className={`text-[11px] px-2 py-0.5 rounded-full border capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

function RequestDetail({
  row,
  meId,
  onRespond,
  supabase,
}: {
  row: RequestRow;
  meId: string;
  onRespond: (row: RequestRow, status: "accepted" | "declined") => void;
  supabase: ReturnType<typeof createClient>;
}) {
  const name = row.other?.full_name || row.other?.username || "Engineer";
  const iAmRecipient = row.to_user === meId;
  const canAct = iAmRecipient && row.status === "pending";

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-6">
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-slate-500 font-medium">
          {row.other?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.other.avatar_url}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">{name}</h2>
            <StatusBadge status={row.status} />
          </div>
          <p className="text-sm text-slate-500">
            {row.other?.headline || row.other?.location || ""}
          </p>
          {row.other?.username && (
            <Link
              href={`/profile/${row.other.username}`}
              className="text-xs text-indigo-600 hover:text-indigo-700"
            >
              View profile →
            </Link>
          )}
        </div>
      </div>

      {row.message && (
        <div className="mt-5 rounded-lg bg-slate-50 border border-slate-200 p-4">
          <p className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
            {row.direction === "sent" ? "Your message" : "Their message"}
          </p>
          <p className="text-sm text-slate-700 whitespace-pre-wrap">
            {row.message}
          </p>
        </div>
      )}

      {canAct && (
        <div className="mt-5 flex gap-3">
          <button
            onClick={() => onRespond(row, "accepted")}
            className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700"
          >
            Accept & open chat
          </button>
          <button
            onClick={() => onRespond(row, "declined")}
            className="rounded-lg border border-slate-300 text-slate-600 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Decline
          </button>
        </div>
      )}

      {row.status === "accepted" && (
        <div className="mt-5">
          {row.other?.contact_email && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
              <p className="text-[11px] uppercase tracking-wide text-green-700 mb-1">
                Contact
              </p>
              <a
                href={`mailto:${row.other.contact_email}`}
                className="text-sm text-green-800 font-medium hover:underline"
              >
                {row.other.contact_email}
              </a>
            </div>
          )}
          {row.conversation_id ? (
            <ChatPanel
              conversationId={row.conversation_id}
              meId={meId}
              supabase={supabase}
            />
          ) : (
            <p className="text-sm text-slate-400">
              Chat will open here once a conversation is started.
            </p>
          )}
        </div>
      )}

      {row.status === "declined" && (
        <p className="mt-5 text-sm text-slate-400">
          This request was declined.
        </p>
      )}
    </div>
  );
}

type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

function ChatPanel({
  conversationId,
  meId,
  supabase,
}: {
  conversationId: string;
  meId: string;
  supabase: ReturnType<typeof createClient>;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const loadMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, body, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    setMessages((data ?? []) as ChatMessage[]);
  }, [supabase, conversationId]);

  useEffect(() => {
    loadMessages();
    const channel = supabase
      .channel("messages:" + conversationId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: "conversation_id=eq." + conversationId,
        },
        () => loadMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, conversationId, loadMessages]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setSending(true);
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: meId,
      body,
    });
    setText("");
    setSending(false);
    await loadMessages();
  }

  return (
    <div className="rounded-lg border border-slate-200">
      <div className="max-h-80 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-6">
            No messages yet. Say hello 👋
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === meId;
            return (
              <div
                key={m.id}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    mine
                      ? "bg-indigo-600 text-white rounded-br-sm"
                      : "bg-slate-100 text-slate-800 rounded-bl-sm"
                  }`}
                >
                  {m.body}
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="border-t border-slate-200 p-3 flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          placeholder="Type a message…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          className="rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

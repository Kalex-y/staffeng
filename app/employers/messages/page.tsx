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
    const { data: reqs, error: reqErr } =

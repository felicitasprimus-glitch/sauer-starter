"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ProfileAvatar() {
  const supabase = createClient();
  const [initial, setInitial] = useState("");
  const [url, setUrl] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const base = userData.user.email || "?";
    setInitial(base.trim().charAt(0).toUpperCase());

    const { data: profile } = await supabase
      .from("user_profiles")
      .select("display_name, avatar_path")
      .eq("id", userData.user.id)
      .single();

    if (profile) {
      if (profile.display_name) {
        setInitial(profile.display_name.trim().charAt(0).toUpperCase());
      }
      if (profile.avatar_path) {
        const { data } = await supabase.storage
          .from("photos")
          .createSignedUrl(profile.avatar_path, 3600);
        if (data?.signedUrl) setUrl(data.signedUrl);
      }
    }
  }

  return (
    <Link href="/mein-profil" aria-label="Mein Profil">
      {url ? (
        <img
          src={url}
          alt="Profil"
          className="h-10 w-10 rounded-full object-cover"
          style={{ border: "2px solid #ece0e6" }}
        />
      ) : (
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-altrosa font-display text-base font-bold text-brombeer">
          {initial || "?"}
        </div>
      )}
    </Link>
  );
}

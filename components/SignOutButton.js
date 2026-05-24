"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useLang } from "@/components/LanguageProvider";

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useLang();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button onClick={handleSignOut} className="btn-ghost text-sm">
      {t("prof.signOut")}
    </button>
  );
}

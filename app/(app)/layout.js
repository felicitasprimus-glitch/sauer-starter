import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import { LanguageProvider } from "@/components/LanguageProvider";

export default async function AppLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nicht angemeldet -> Startseite (legt automatisch anonymes Konto an)
  if (!user) {
    redirect("/");
  }

  // Profil holen
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin, access_expires_at")
    .eq("id", user.id)
    .single();

  // Wenn kein Profil existiert: dauerhaft anlegen (kein Ablauf) + Anzeigename
  if (!profile) {
    const isAdmin = user.email === "felicitas.primus@gmail.com";
    await supabase.from("user_profiles").insert({
      id: user.id,
      email: user.email || null,
      display_name: "Baeckerin " + Math.floor(1000 + Math.random() * 9000),
      is_admin: isAdmin,
      access_expires_at: null,
    });
    // durchlassen
  }
  // Kein Ablauf-Check mehr: Zugang bleibt dauerhaft bestehen.

  return (
    <LanguageProvider>
      <div className="mx-auto min-h-screen max-w-md bg-cream-50 px-4 pb-24 pt-6">
        {children}
        <BottomNav />
      </div>
    </LanguageProvider>
  );
}

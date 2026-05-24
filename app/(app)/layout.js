import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import { LanguageProvider } from "@/components/LanguageProvider";

export default async function AppLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nicht eingeloggt -> Login
  if (!user) {
    redirect("/login");
  }

  // Profil mit Ablauf-Datum holen
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin, access_expires_at")
    .eq("id", user.id)
    .single();

  // Wenn kein Profil existiert: erst mal anlegen mit 90 Tagen ab heute
  if (!profile) {
    const isAdmin = user.email === "felicitas.primus@gmail.com";
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    await supabase.from("user_profiles").insert({
      id: user.id,
      email: user.email,
      is_admin: isAdmin,
      access_expires_at: isAdmin ? null : expiresAt.toISOString(),
    });
    // Beim ersten Mal durchlassen
  } else if (!profile.is_admin && profile.access_expires_at) {
    // Ablauf pruefen (nur fuer Nicht-Admins)
    const expires = new Date(profile.access_expires_at);
    const now = new Date();
    if (expires < now) {
      redirect("/zugang-abgelaufen");
    }
  }

  return (
    <LanguageProvider>
      <div className="mx-auto min-h-screen max-w-md bg-cream-50 px-4 pb-24 pt-6">
        {children}
        <BottomNav />
      </div>
    </LanguageProvider>
  );
}

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/BottomNav";
import { LanguageProvider } from "@/components/LanguageProvider";

export default async function AppLayout({ children }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Nicht angemeldet -> zur Registrierung/Anmeldung
  if (!user) {
    redirect("/");
  }

  // Profil holen
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  // Falls kein Profil: mit dem Namen aus der Registrierung anlegen
  if (!profile) {
    const isAdmin = user.email === "felicitas.primus@gmail.com";
    const nm =
      (user.user_metadata && user.user_metadata.display_name) ||
      (user.email ? user.email.split("@")[0] : "Bäckerin");
    await supabase.from("user_profiles").insert({
      id: user.id,
      email: user.email || null,
      display_name: nm,
      is_admin: isAdmin,
      access_expires_at: null,
    });
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

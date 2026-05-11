import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const { email, password, masterPassword } = await request.json();

    if (!email || !password || !masterPassword) {
      return Response.json(
        { error: "Email, Passwort und Aktivierungs-Code sind Pflicht." },
        { status: 400 }
      );
    }

    // Master-Passwort pruefen
    if (masterPassword !== process.env.MASTER_PASSWORD) {
      return Response.json(
        { error: "Aktivierungs-Code ist nicht korrekt." },
        { status: 401 }
      );
    }

    // Admin-Client mit Service-Role-Key fuer User-Anlage
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    // User in Supabase Auth anlegen (mit auto-confirm)
    const { data: newUser, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
    });

    if (signUpError) {
      return Response.json({ error: signUpError.message }, { status: 400 });
    }

    if (!newUser?.user) {
      return Response.json({ error: "User konnte nicht angelegt werden." }, { status: 500 });
    }

    // user_profile anlegen mit 90 Tage Zugang
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);

    const isAdmin = email === "felicitas.primus@gmail.com";

    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .upsert({
        id: newUser.user.id,
        email: email,
        is_admin: isAdmin,
        access_expires_at: isAdmin ? null : expiresAt.toISOString(),
      });

    if (profileError) {
      console.error("Profile error:", profileError);
      // User existiert schon in auth, aber Profile-Anlage fehlgeschlagen
      // Trotzdem ok zurueckgeben
    }

    return Response.json({
      success: true,
      message: "Registrierung erfolgreich. Du kannst dich jetzt einloggen.",
    });
  } catch (err) {
    return Response.json(
      { error: err.message || "Etwas ist schiefgelaufen" },
      { status: 500 }
    );
  }
}

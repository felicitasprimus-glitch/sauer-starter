import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return Response.json(
        { error: "Name, Email und Passwort sind Pflicht." },
        { status: 400 }
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

    const isAdmin = email === "felicitas.primus@gmail.com";

    // user_profile anlegen (dauerhafter Zugang, mit Anzeigename)
    const { error: profileError } = await supabaseAdmin
      .from("user_profiles")
      .upsert({
        id: newUser.user.id,
        email: email,
        display_name: name,
        is_admin: isAdmin,
        access_expires_at: null,
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

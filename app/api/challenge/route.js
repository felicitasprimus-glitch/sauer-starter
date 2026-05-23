import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getAdmin() {
  const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!adminUrl || !adminKey) return null;
  return createAdminClient(adminUrl, adminKey);
}

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    const admin = getAdmin();
    if (!admin) {
      return Response.json(
        { error: "Server nicht konfiguriert (Supabase-Keys fehlen)" },
        { status: 500 }
      );
    }

    // Aktuelle aktive Challenge
    const { data: challenge } = await admin
      .from("challenges")
      .select("id, title, description, starts_at, ends_at, is_active, created_at")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Ist der eingeloggte User Admin?
    const { data: profile } = await admin
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();

    return Response.json({
      challenge: challenge || null,
      isAdmin: !!profile?.is_admin,
    });
  } catch (err) {
    return Response.json(
      { error: err.message || "Fehler beim Laden der Challenge" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    const admin = getAdmin();
    if (!admin) {
      return Response.json(
        { error: "Server nicht konfiguriert (Supabase-Keys fehlen)" },
        { status: 500 }
      );
    }

    // Admin-Check
    const { data: profile } = await admin
      .from("user_profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    if (!profile?.is_admin) {
      return Response.json(
        { error: "Nur Admins duerfen Challenges anlegen" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const title = (body.title || "").trim();
    if (!title) {
      return Response.json({ error: "Titel fehlt" }, { status: 400 });
    }
    const description = (body.description || "").trim() || null;
    const starts_at = body.starts_at || null;
    const ends_at = body.ends_at || null;

    // Bisher aktive Challenges deaktivieren
    await admin
      .from("challenges")
      .update({ is_active: false })
      .eq("is_active", true);

    // Neue Challenge anlegen
    const { data: created, error } = await admin
      .from("challenges")
      .insert({ title, description, starts_at, ends_at, is_active: true })
      .select()
      .single();

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ challenge: created });
  } catch (err) {
    return Response.json(
      { error: err.message || "Fehler beim Anlegen der Challenge" },
      { status: 500 }
    );
  }
}

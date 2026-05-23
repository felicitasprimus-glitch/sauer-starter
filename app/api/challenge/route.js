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

    // Einreichungen + eigene teilbare Brote (nur wenn es eine Challenge gibt)
    let einreichungen = [];
    let eigeneBrote = [];
    if (challenge) {
      const { data: brote } = await admin
        .from("brote")
        .select("id, name, photo_path, krume_score, user_id, shared_at")
        .eq("challenge_id", challenge.id)
        .order("shared_at", { ascending: false });

      const userIds = [...new Set((brote || []).map((b) => b.user_id))];
      const nameMap = {};
      if (userIds.length > 0) {
        const { data: profiles } = await admin
          .from("user_profiles")
          .select("id, display_name")
          .in("id", userIds);
        (profiles || []).forEach((p) => {
          nameMap[p.id] = p.display_name;
        });
      }

      for (const b of brote || []) {
        let fotoUrl = null;
        if (b.photo_path) {
          const { data: signed } = await admin.storage
            .from("photos")
            .createSignedUrl(b.photo_path, 3600);
          fotoUrl = signed?.signedUrl || null;
        }
        einreichungen.push({
          id: b.id,
          name: b.name,
          autor: nameMap[b.user_id] || "Anonym",
          krumeScore: b.krume_score,
          fotoUrl,
          isOwn: b.user_id === user.id,
        });
      }

      // Eigene geteilte Brote zur Auswahl
      const { data: meine } = await admin
        .from("brote")
        .select("id, name, challenge_id")
        .eq("user_id", user.id)
        .eq("is_shared", true)
        .order("shared_at", { ascending: false });
      eigeneBrote = (meine || []).map((b) => ({
        id: b.id,
        name: b.name,
        eingereicht: b.challenge_id === challenge.id,
      }));
    }

    return Response.json({
      challenge: challenge || null,
      isAdmin: !!profile?.is_admin,
      einreichungen,
      eigeneBrote,
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

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const { starterId } = await request.json();
    if (!starterId) {
      return Response.json({ error: "Kein Starter angegeben." }, { status: 400 });
    }

    // Eingeloggten Nutzer aus der Session holen
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Nicht eingeloggt." }, { status: 401 });
    }

    // Admin-Client (Service-Role) - umgeht RLS; Besitz pruefen wir selbst
    const admin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Besitz pruefen: gehoert der Starter diesem Nutzer?
    const { data: starter, error: starterError } = await admin
      .from("starters")
      .select("id, user_id")
      .eq("id", starterId)
      .single();

    if (starterError || !starter) {
      return Response.json({ error: "Starter nicht gefunden." }, { status: 404 });
    }
    if (starter.user_id !== user.id) {
      return Response.json({ error: "Keine Berechtigung." }, { status: 403 });
    }

    // Fotos der Fuetterungen aus dem Storage entfernen
    const { data: feedings } = await admin
      .from("feedings")
      .select("photo_path")
      .eq("starter_id", starterId);

    const photoPaths = (feedings || [])
      .map((f) => f.photo_path)
      .filter(Boolean);
    if (photoPaths.length > 0) {
      await admin.storage.from("photos").remove(photoPaths);
    }

    // Fuetterungen loeschen
    await admin.from("feedings").delete().eq("starter_id", starterId);

    // Starter loeschen
    const { error: deleteError } = await admin
      .from("starters")
      .delete()
      .eq("id", starterId);

    if (deleteError) {
      return Response.json({ error: deleteError.message }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: "Fehler beim Loeschen." }, { status: 500 });
  }
}

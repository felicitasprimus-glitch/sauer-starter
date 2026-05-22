import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Pruefen ob eingeloggt (nur angemeldete duerfen den Feed sehen)
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    // 2. Admin-Client mit Service-Role (umgeht RLS, damit wir fremde
    //    geteilte Brote + deren Fotos laden koennen)
    const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!adminUrl || !adminKey) {
      return Response.json(
        { error: "Server nicht konfiguriert (Supabase-Keys fehlen)" },
        { status: 500 }
      );
    }

    const admin = createAdminClient(adminUrl, adminKey);

    // 3. Geteilte Brote laden
    const { data: brote, error: broteError } = await admin
      .from("brote")
      .select(
        "id, name, photo_path, rezept_text, krume_score, krume_diagnose, shared_at, baked_at, user_id"
      )
      .eq("is_shared", true)
      .order("shared_at", { ascending: false })
      .limit(100);

    if (broteError) {
      return Response.json({ error: broteError.message }, { status: 500 });
    }

    // 4. Anzeige-Namen der Autorinnen laden
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

    // 5. Fuer jedes Brot eine signed URL fuers Foto generieren
    const posts = [];
    for (const b of brote || []) {
      let fotoUrl = null;
      if (b.photo_path) {
        const { data: signed } = await admin.storage
          .from("photos")
          .createSignedUrl(b.photo_path, 3600);
        fotoUrl = signed?.signedUrl || null;
      }
      posts.push({
        id: b.id,
        name: b.name,
        fotoUrl,
        rezept: b.rezept_text || null,
        krumeScore: b.krume_score || null,
        krumeDiagnose: b.krume_diagnose || null,
        autor: nameMap[b.user_id] || "Anonym",
        sharedAt: b.shared_at,
        bakedAt: b.baked_at,
        isOwn: b.user_id === user.id,
      });
    }

    return Response.json({ posts });
  } catch (err) {
    return Response.json(
      { error: err.message || "Fehler beim Laden des Feeds" },
      { status: 500 }
    );
  }
}

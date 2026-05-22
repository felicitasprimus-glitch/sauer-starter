import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: "Nicht eingeloggt" }, { status: 401 });
    }

    const adminUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!adminUrl || !adminKey) {
      return Response.json(
        { error: "Server nicht konfiguriert (Supabase-Keys fehlen)" },
        { status: 500 }
      );
    }

    const admin = createAdminClient(adminUrl, adminKey);

    const { data: brote, error: broteError } = await admin
      .from("brote")
      .select(
        "id, name, photo_path, rezept_text, rezept_photo_path, krume_score, krume_diagnose, shared_at, baked_at, user_id"
      )
      .eq("is_shared", true)
      .order("shared_at", { ascending: false })
      .limit(100);

    if (broteError) {
      return Response.json({ error: broteError.message }, { status: 500 });
    }

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

    const posts = [];
    for (const b of brote || []) {
      let fotoUrl = null;
      if (b.photo_path) {
        const { data: signed } = await admin.storage
          .from("photos")
          .createSignedUrl(b.photo_path, 3600);
        fotoUrl = signed?.signedUrl || null;
      }

      let rezeptFotoUrl = null;
      if (b.rezept_photo_path) {
        const { data: signedR } = await admin.storage
          .from("photos")
          .createSignedUrl(b.rezept_photo_path, 3600);
        rezeptFotoUrl = signedR?.signedUrl || null;
      }

      posts.push({
        id: b.id,
        name: b.name,
        fotoUrl,
        rezept: b.rezept_text || null,
        rezeptFotoUrl,
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

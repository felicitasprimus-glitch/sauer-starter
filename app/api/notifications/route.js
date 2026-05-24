import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
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

    // Meine Brote
    const { data: meineBrote } = await admin
      .from("brote")
      .select("id, name")
      .eq("user_id", user.id);

    const brotMap = {};
    (meineBrote || []).forEach((b) => (brotMap[b.id] = b.name));
    const brotIds = Object.keys(brotMap);

    if (brotIds.length === 0) {
      return Response.json({ events: [], total: 0 });
    }

    // Likes auf meine Brote (ohne meine eigenen)
    const { data: likes } = await admin
      .from("brot_likes")
      .select("*")
      .in("brot_id", brotIds);
    const fremdeLikes = (likes || []).filter((l) => l.user_id !== user.id);

    // Kommentare auf meine Brote (ohne meine eigenen)
    const { data: komms } = await admin
      .from("brot_kommentare")
      .select("id, brot_id, user_id, text, created_at")
      .in("brot_id", brotIds);
    const fremdeKomms = (komms || []).filter((k) => k.user_id !== user.id);

    // Anzeige-Namen der Ausloeser
    const userIds = [
      ...new Set([
        ...fremdeLikes.map((l) => l.user_id),
        ...fremdeKomms.map((k) => k.user_id),
      ]),
    ];
    const nameMap = {};
    if (userIds.length > 0) {
      const { data: profiles } = await admin
        .from("user_profiles")
        .select("id, display_name")
        .in("id", userIds);
      (profiles || []).forEach((p) => (nameMap[p.id] = p.display_name));
    }

    const events = [];
    fremdeLikes.forEach((l) => {
      events.push({
        id: "like-" + l.brot_id + "-" + l.user_id,
        type: "like",
        actor: nameMap[l.user_id] || "Jemand",
        brotName: brotMap[l.brot_id] || "deinem Brot",
        createdAt: l.created_at || null,
      });
    });
    fremdeKomms.forEach((k) => {
      events.push({
        id: "komm-" + k.id,
        type: "comment",
        actor: nameMap[k.user_id] || "Jemand",
        brotName: brotMap[k.brot_id] || "deinem Brot",
        text: k.text,
        createdAt: k.created_at || null,
      });
    });

    // Neueste zuerst, Eintraege ohne Zeitstempel ans Ende
    events.sort((a, b) => {
      if (a.createdAt && b.createdAt)
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (a.createdAt) return -1;
      if (b.createdAt) return 1;
      return 0;
    });

    return Response.json({ events, total: events.length });
  } catch (err) {
    return Response.json(
      { error: err.message || "Fehler beim Laden der Benachrichtigungen" },
      { status: 500 }
    );
  }
}

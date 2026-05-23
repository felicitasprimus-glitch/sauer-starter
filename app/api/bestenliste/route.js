import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { calculateStats } from "@/lib/starterStats";

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

    // BESTE BROTE: geteilte Brote mit Krume-Score, hoechster Score zuerst
    const { data: brote, error: broteError } = await admin
      .from("brote")
      .select(
        "id, name, photo_path, krume_score, krume_diagnose, user_id, shared_at"
      )
      .eq("is_shared", true)
      .not("krume_score", "is", null)
      .order("krume_score", { ascending: false })
      .limit(10);

    if (broteError) {
      return Response.json({ error: broteError.message }, { status: 500 });
    }

    // Anzeige-Namen der Autorinnen laden
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

    const broteListe = [];
    for (const b of brote || []) {
      let fotoUrl = null;
      if (b.photo_path) {
        const { data: signed } = await admin.storage
          .from("photos")
          .createSignedUrl(b.photo_path, 3600);
        fotoUrl = signed?.signedUrl || null;
      }
      broteListe.push({
        id: b.id,
        name: b.name,
        autor: nameMap[b.user_id] || "Anonym",
        krumeScore: b.krume_score,
        krumeDiagnose: b.krume_diagnose || null,
        fotoUrl,
        isOwn: b.user_id === user.id,
      });
    }

    // STAERKSTE STARTER: nur Opt-in-Starter, Triebkraft live berechnet
    let starterListe = [];
    const { data: starters } = await admin
      .from("starters")
      .select("id, name, user_id")
      .eq("share_in_ranking", true);

    if (starters && starters.length > 0) {
      const starterIds = starters.map((s) => s.id);

      const { data: feedings } = await admin
        .from("feedings")
        .select("starter_id, fed_at, asg_g, flour_g, water_g, state, temperature")
        .in("starter_id", starterIds)
        .order("fed_at", { ascending: false });

      const byStarter = {};
      (feedings || []).forEach((f) => {
        if (!byStarter[f.starter_id]) byStarter[f.starter_id] = [];
        byStarter[f.starter_id].push(f);
      });

      const sUserIds = [...new Set(starters.map((s) => s.user_id))];
      const sNameMap = {};
      if (sUserIds.length > 0) {
        const { data: sProfiles } = await admin
          .from("user_profiles")
          .select("id, display_name")
          .in("id", sUserIds);
        (sProfiles || []).forEach((p) => {
          sNameMap[p.id] = p.display_name;
        });
      }

      starterListe = starters.map((s) => {
        const stats = calculateStats(byStarter[s.id] || []);
        return {
          id: s.id,
          name: s.name,
          autor: sNameMap[s.user_id] || "Anonym",
          score: stats.triebkraftScore,
          isOwn: s.user_id === user.id,
        };
      });
      starterListe.sort((a, b) => b.score - a.score);
      starterListe = starterListe.slice(0, 10);
    }

    return Response.json({ brote: broteListe, starter: starterListe });
  } catch (err) {
    return Response.json(
      { error: err.message || "Fehler beim Laden der Bestenliste" },
      { status: 500 }
    );
  }
}

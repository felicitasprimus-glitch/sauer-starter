import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StatsPanel from "@/components/StatsPanel";

export const dynamic = "force-dynamic";

export default async function StatsPage({ params }) {
  const supabase = createClient();
  const { id } = params;

  const { data: starter } = await supabase
    .from("starters")
    .select("*")
    .eq("id", id)
    .single();

  if (!starter) notFound();

  const { data: feedings } = await supabase
    .from("feedings")
    .select("*")
    .eq("starter_id", id)
    .order("fed_at", { ascending: false })
    .limit(200);

  return (
    <main className="px-5 pt-6">
      <Link href={`/starter/${id}`} className="btn-ghost -ml-3 text-sm">
        ← Zurück
      </Link>

      <header className="mt-4">
        <p className="text-sm text-cocoa-700/65">{starter.name}</p>
        <h1 className="font-display text-3xl font-medium tracking-tight text-cocoa-900">
          Statistik &{" "}
          <span className="italic text-terra-600 underline-wobble">
            Triebkraft
          </span>
        </h1>
      </header>

      <section className="mt-6">
        <StatsPanel feedings={feedings ?? []} />
      </section>
    </main>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";
import StarterCard from "@/components/StarterCard";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Starter laden
  const { data: starters } = await supabase
    .from("starters")
    .select("*")
    .order("created_at", { ascending: false });

  // Letzte Fütterung pro Starter
  let lastFeedings = {};
  if (starters?.length) {
    const ids = starters.map((s) => s.id);
    const { data: feedings } = await supabase
      .from("feedings")
      .select("starter_id, fed_at")
      .in("starter_id", ids)
      .order("fed_at", { ascending: false });

    if (feedings) {
      for (const f of feedings) {
        if (!lastFeedings[f.starter_id]) {
          lastFeedings[f.starter_id] = f;
        }
      }
    }
  }

  return (
    <main className="px-5 pt-6">
      <header className="flex items-center justify-between">
        <Logo />
        <SignOutButton />
      </header>

      <section className="mt-8">
        <p className="text-sm text-cocoa-700/70">
          Hallo {user?.email?.split("@")[0]} 👋
        </p>
        <h1 className="font-display text-3xl font-medium tracking-tight text-cocoa-900">
          Meine{" "}
          <span className="italic text-terra-600 underline-wobble">
            Starter
          </span>
        </h1>
      </section>

      <section className="mt-6 space-y-3">
        {starters && starters.length > 0 ? (
          <>
            {starters.map((s) => (
              <StarterCard
                key={s.id}
                starter={s}
                lastFeeding={lastFeedings[s.id]}
              />
            ))}
            <Link
              href="/starter/new"
              className="block rounded-3xl border-2 border-dashed border-mauve-500/30 bg-cream-200/30 p-5 text-center transition-colors hover:border-terra-500/50 hover:bg-cream-200/60"
            >
              <span className="font-display text-cocoa-800">
                + Weiterer Starter
              </span>
            </Link>
          </>
        ) : (
          <div className="rounded-3xl border border-mauve-500/15 bg-cream-50 p-8 text-center shadow-soft">
            <div className="mb-3 text-5xl animate-bubble">🫙</div>
            <h2 className="font-display text-2xl font-medium text-cocoa-900">
              Noch ganz still hier
            </h2>
            <p className="mt-1 text-sm text-cocoa-700/70">
              Leg deinen ersten Starter an und gib ihm einen Namen.
            </p>
            <Link href="/starter/new" className="btn-primary mt-5">
              Ersten Starter anlegen
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}

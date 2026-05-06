import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import StarterForm from "@/components/StarterForm";

export const dynamic = "force-dynamic";

export default async function EditStarterPage({ params }) {
  const supabase = createClient();
  const { id } = params;

  const { data: starter } = await supabase
    .from("starters")
    .select("*")
    .eq("id", id)
    .single();

  if (!starter) notFound();

  return (
    <main className="px-5 pt-6">
      <Link href={`/starter/${id}`} className="btn-ghost -ml-3 text-sm">
        ← Zurück
      </Link>

      <header className="mt-4">
        <h1 className="font-display text-3xl font-medium tracking-tight text-cocoa-900">
          {starter.name} bearbeiten
        </h1>
      </header>

      <section className="mt-6">
        <StarterForm mode="edit" initial={starter} />
      </section>
    </main>
  );
}

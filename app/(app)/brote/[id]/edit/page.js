import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BrotForm from "@/components/BrotForm";

export const dynamic = "force-dynamic";

export default async function EditBrotPage({ params }) {
  const supabase = createClient();
  const { id } = params;

  const { data: brot } = await supabase
    .from("brote")
    .select("*")
    .eq("id", id)
    .single();

  if (!brot) notFound();

  const { data: starters } = await supabase
    .from("starters")
    .select("id, name")
    .order("name");

  return (
    <main className="px-5 pt-6">
      <Link href={`/brote/${id}`} className="btn-ghost -ml-3 text-sm">
        ← Zurück
      </Link>

      <header className="mt-4">
        <h1 className="font-display text-3xl font-medium tracking-tight text-cocoa-900">
          {brot.name} bearbeiten
        </h1>
      </header>

      <section className="mt-6">
        <BrotForm mode="edit" initial={brot} starters={starters ?? []} />
      </section>
    </main>
  );
}

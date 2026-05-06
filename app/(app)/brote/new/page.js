import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BrotForm from "@/components/BrotForm";

export const dynamic = "force-dynamic";

export default async function NewBrotPage() {
  const supabase = createClient();
  const { data: starters } = await supabase
    .from("starters")
    .select("id, name")
    .order("name");

  return (
    <main className="px-5 pt-6">
      <Link href="/brote" className="btn-ghost -ml-3 text-sm">
        ← Zurück
      </Link>

      <header className="mt-4">
        <h1 className="font-display text-3xl font-medium tracking-tight text-cocoa-900">
          Neues{" "}
          <span className="italic text-terra-600">Brot</span>
        </h1>
        <p className="mt-1 text-sm text-cocoa-700/70">
          Mach ein Foto, bewerte es — und das Tagebuch wächst.
        </p>
      </header>

      <section className="mt-6">
        <BrotForm mode="create" starters={starters ?? []} />
      </section>
    </main>
  );
}

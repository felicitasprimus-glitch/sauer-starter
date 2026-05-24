import Link from "next/link";
import { cookies } from "next/headers";
import { translate } from "@/lib/translations";
import PublicLanguageSwitcher from "@/components/PublicLanguageSwitcher";

export default function HomePage() {
  const lang = cookies().get("lang")?.value || "de";
  const t = (k) => translate(lang, k);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        <PublicLanguageSwitcher initialLang={lang} />

        <div>
          <div className="text-5xl">🍞</div>
          <h1 className="mt-3 font-display text-4xl text-cocoa-900">
            Sauer macht krustig
          </h1>
          <p className="mt-2 text-sm text-cocoa-700/70">
            {t("land.tagline")}
          </p>
        </div>

        <div className="card space-y-4 text-left">
          <p className="text-sm leading-relaxed text-cocoa-800">
            {t("land.desc")}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/register" className="btn-primary text-center">
            {t("land.start")}
          </Link>

          <Link href="/login" className="btn-secondary text-center">
            {t("land.haveAccount")}
          </Link>
        </div>

        <p className="text-[10px] text-cocoa-700/60">
          {t("land.codeNote")}
        </p>

        <div className="flex justify-center gap-4 pt-2 text-[11px] text-cocoa-700/60">
          <Link href="/impressum" className="hover:text-cocoa-900">Impressum</Link>
          <Link href="/datenschutz" className="hover:text-cocoa-900">Datenschutz</Link>
        </div>
      </div>
    </div>
  );
}

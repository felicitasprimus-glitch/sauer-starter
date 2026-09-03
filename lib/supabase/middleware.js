import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // WICHTIG: Diesen Aufruf nicht entfernen — er aktualisiert die Session.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const isProtected =
    url.pathname.startsWith("/start") ||
    url.pathname.startsWith("/dashboard") ||
    url.pathname.startsWith("/starter") ||
    url.pathname.startsWith("/sos");

  // Nicht angemeldet + geschuetzte Seite -> zur Startseite,
  // die legt automatisch ein anonymes Konto an (kein Login-Screen).
  if (!user && isProtected) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

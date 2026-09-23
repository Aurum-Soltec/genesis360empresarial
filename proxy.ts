import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const incomingCorrelation = request.headers.get("x-correlation-id");
  const correlation = incomingCorrelation && /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/.test(incomingCorrelation)
    ? incomingCorrelation : crypto.randomUUID();
  requestHeaders.set("x-correlation-id", correlation);
  let response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-correlation-id", correlation);

  // Route handlers enforce authentication and tenant authorization themselves.
  // Avoid a duplicate hosted Auth round trip while preserving correlation IDs.
  if (request.nextUrl.pathname.startsWith("/api/")) return response;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: requestHeaders } });
        response.headers.set("x-correlation-id", correlation);
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // getUser() validates the token with Auth and refreshes cookies when required.
  const { data } = await supabase.auth.getUser();
  const pathname = request.nextUrl.pathname;
  const publicPath =
    pathname === "/entrar" ||
    pathname === "/recuperar-acesso" ||
    pathname === "/nova-senha" ||
    pathname.startsWith("/auth/");
  if (!data.user && !publicPath) {
    const target = request.nextUrl.clone();
    target.pathname = "/entrar";
    target.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
    const redirect = NextResponse.redirect(target);
    redirect.headers.set("x-correlation-id", correlation);
    return redirect;
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

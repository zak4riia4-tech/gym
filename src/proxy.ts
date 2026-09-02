import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { defaultLocale, isLocale, locales, matchLocale } from "@/lib/i18n/config";

const LOCALE_COOKIE = "locale";
const LOCALE_HEADER = "x-locale";

/*
 * Two jobs, split by path.
 *
 * /admin/*  — keep the Supabase session cookie fresh and bounce signed-out
 *             visitors to the login page. That redirect is CONVENIENCE, NOT
 *             SECURITY: middleware has been bypassable in the past, so the
 *             dashboard re-checks the session on the server and Row Level
 *             Security blocks the data itself.
 *
 * everything else — make sure the URL carries a language, and tell the root
 *             layout which one it is via a request header, so <html lang> and
 *             <html dir> are correct on the very first byte.
 */

async function handleAdmin(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
          response = NextResponse.next({ request });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    },
  );

  // getUser() revalidates the token with Supabase. getSession() only decodes
  // the cookie, which a client could have tampered with.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/admin/login";

  if (!user && !isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  // The dashboard is English only, so the header is fixed rather than detected.
  response.headers.set(LOCALE_HEADER, defaultLocale);
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) return handleAdmin(request);

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Already carries a language: pass it through as a header.
  if (first && isLocale(first)) {
    const response = NextResponse.next({ request });
    response.headers.set(LOCALE_HEADER, first);
    // Remember the choice so a return visit to "/" lands in the same language.
    response.cookies.set(LOCALE_COOKIE, first, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  // No language in the URL. Prefer a previous choice, then the browser's
  // Accept-Language, then English.
  const remembered = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    remembered && isLocale(remembered)
      ? remembered
      : matchLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /*
   * Everything except Next's own assets and the files that must be served from
   * the site root — a manifest or robots.txt behind a language prefix would be
   * invisible to browsers and crawlers.
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|sw.js|manifest.webmanifest|robots.txt|sitemap.xml|icon-.*\\.png|apple-touch-icon\\.png).*)",
  ],
};

export { locales };

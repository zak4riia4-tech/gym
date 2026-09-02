import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Staff sign in",
  // Keep the admin area out of search results.
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-void px-6 py-16">
      <div className="w-full max-w-[26rem]">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-brass">
          {site.brand.name} · Staff
        </p>

        <h1 className="u-display mt-4 text-[clamp(1.75rem,5vw,2.25rem)] font-extrabold uppercase leading-[1] text-chalk">
          Sign in
        </h1>

        <p className="mt-4 text-[15px] leading-relaxed text-ash">
          Dashboard access is limited to gym staff. Accounts are created by the
          site administrator — there is no sign-up.
        </p>

        <div className="mt-9 rounded-[2px] border border-steel bg-iron p-6 sm:p-7">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}

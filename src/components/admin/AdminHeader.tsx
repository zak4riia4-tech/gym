"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { getAdminBrowserClient } from "@/lib/supabase/browser";

type AdminHeaderProps = {
  email: string;
  onOpenNav: () => void;
};

export function AdminHeader({ email, onOpenNav }: AdminHeaderProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = getAdminBrowserClient();
    await supabase.auth.signOut();
    // replace() so the back button cannot return to the dashboard shell,
    // and refresh() so the server drops the old session.
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-steel bg-void/85 px-5 py-4 backdrop-blur-sm lg:px-8">
      <button
        type="button"
        onClick={onOpenNav}
        aria-label="Open navigation"
        className="inline-flex size-10 items-center justify-center rounded-[2px] text-ash transition-colors duration-200 hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember lg:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <p className="min-w-0 flex-1 truncate font-mono text-[11px] uppercase tracking-[0.16em] text-ash lg:flex-none">
        <span className="sr-only">Signed in as </span>
        {email}
      </p>

      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="inline-flex min-h-10 items-center gap-2 rounded-[2px] border border-steel px-3.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ash transition-colors duration-200 hover:border-ash hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember disabled:opacity-50"
      >
        <LogOut aria-hidden="true" className="size-3.5" />
        {signingOut ? "Signing out" : "Sign out"}
      </button>
    </header>
  );
}

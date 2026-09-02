"use client";

import { useEffect, useState } from "react";
import { Share, SquarePlus, X } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

/*
 * Two different install flows, because the platforms are not the same.
 *
 * Android fires `beforeinstallprompt`, which we hold on to and replay when the
 * visitor taps the button — one tap and it is installed.
 *
 * iOS fires nothing at all. Safari only installs through Share -> Add to Home
 * Screen, and there is no API to trigger it. So on iOS the only honest thing to
 * do is show the instructions, which is why this component detects the platform
 * rather than showing one generic button that would do nothing on an iPhone.
 */
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISSED_KEY = "ironhaus:install-dismissed";

export function InstallPrompt() {
  const { dict } = useI18n();
  const install = dict.install;
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Already installed? Then there is nothing to offer.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    try {
      if (localStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      // Private browsing can throw on localStorage. Not a reason to bail.
    }

    const ua = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !/Windows/.test(ua);
    setIsIos(ios);

    if (ios) {
      // Nothing to wait for on iOS — show the instructions after a moment so
      // it does not fight the page for attention on arrival.
      const timer = setTimeout(() => setVisible(true), 6000);
      return () => clearTimeout(timer);
    }

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Nothing to do — it will simply ask again next visit.
    }
  }

  async function handleInstall() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={install.title}
      className="fixed inset-x-3 bottom-3 z-50 rounded-[2px] border border-steel bg-iron p-4 shadow-featured sm:start-auto sm:end-4 sm:w-[22rem] lg:hidden"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-[2px] border border-brass/40 bg-brass/10 text-brass">
          <SquarePlus aria-hidden="true" className="size-4" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="u-display text-[14px] font-extrabold uppercase tracking-[0.04em] text-chalk">
            {install.title}
          </p>

          {isIos ? (
            <p className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] leading-relaxed text-ash">
              {install.iosBefore}
              <Share aria-hidden="true" className="inline size-3.5 shrink-0 text-chalk" />
              <span className="text-chalk">{install.iosShare}</span>
              {install.iosAfter}
              <span className="text-chalk">{install.iosAdd}</span>
            </p>
          ) : (
            <p className="mt-2 text-[13px] leading-relaxed text-ash">{install.body}</p>
          )}

          {!isIos && deferred ? (
            <button
              type="button"
              onClick={handleInstall}
              className="mt-3 inline-flex min-h-10 items-center rounded-[2px] bg-brass px-4 font-mono text-[11px] uppercase tracking-[0.16em] text-void transition-colors duration-500 ease-gentle hover:bg-ember focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
            >
              {install.action}
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label={install.dismiss}
          className="-me-1 -mt-1 inline-flex size-9 shrink-0 items-center justify-center rounded-[2px] text-ash transition-colors duration-500 ease-gentle hover:text-chalk focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

/**
 * Registers the service worker, which is what makes the site installable and
 * lets it open when the phone has no signal.
 *
 * Registered after `load` on purpose: doing it during hydration competes with
 * the page's own resources for bandwidth on exactly the connections that need
 * the page to arrive quickly.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("[pwa] service worker registration failed", error);
      });
    };

    if (document.readyState === "complete") register();
    else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}

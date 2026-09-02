import { Mail } from "lucide-react";
import type { SocialPlatform } from "@/content/site";

/**
 * Lucide version 1 removed its brand icons, so Instagram and Facebook are
 * redrawn here in exactly Lucide's style — 24 unit box, 2px stroke,
 * currentColor — so they sit beside the real Lucide icons without a seam.
 */
const strokeProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg {...strokeProps} className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg {...strokeProps} className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

/** Human-readable name for each platform, used to build the aria-label. */
export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  email: "Email",
};

export function SocialIcon({
  platform,
  className,
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  if (platform === "instagram") return <InstagramIcon className={className} />;
  if (platform === "facebook") return <FacebookIcon className={className} />;
  return <Mail aria-hidden="true" className={className} />;
}

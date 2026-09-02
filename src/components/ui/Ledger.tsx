import { cn } from "@/lib/utils";

export type LedgerItem = {
  label: string;
  value: string;
};

/**
 * THE LEDGER — the motif that runs through this whole site.
 *
 * Gyms are a measuring culture: kilos, minutes, levels, years. So anywhere a
 * card carries hard facts, they are set as a spec sheet in the mono face
 * rather than buried in a sentence.
 *
 * Marked up as a description list (<dl>/<dt>/<dd>) because that is literally
 * what a label/value pair is — screen readers announce the pairing correctly.
 */
export function Ledger({
  items,
  tone = "dark",
  className,
}: {
  items: LedgerItem[];
  tone?: "light" | "dark";
  className?: string;
}) {
  const light = tone === "light";

  return (
    <dl className={cn("w-full", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "flex items-baseline justify-between gap-4 border-b py-2.5 last:border-b-0",
            light ? "border-void/10" : "border-white/10",
          )}
        >
          <dt
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.18em]",
              light ? "text-graphite" : "text-ash",
            )}
          >
            {item.label}
          </dt>
          <dd
            className={cn(
              "text-right font-mono text-[11px] uppercase tracking-[0.1em]",
              light ? "text-void" : "text-chalk",
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

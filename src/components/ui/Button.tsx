import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * primary — solid brass. The one action we most want taken on a screen.
 * outline — hairline border. A real choice, but a quieter one.
 * link    — no box at all. For in-card actions that must not shout.
 */
type Variant = "primary" | "outline" | "link";

/**
 * Which surface the button sits on. It only changes the focus ring and the
 * outline colours, so the ring always stays visible against its background.
 */
type Tone = "light" | "dark";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  tone?: Tone;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  tone = "dark",
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        // group/btn lets child icons react to the button's own hover
        "group/btn inline-flex min-h-12 items-center gap-2.5 rounded-[2px]",
        "font-mono text-[12px] uppercase tracking-[0.16em]",
        "transition-[background-color,color,border-color,box-shadow,transform] duration-500 ease-gentle",
        "focus-visible:outline-2 focus-visible:outline-offset-[3px]",
        "disabled:pointer-events-none disabled:opacity-50",
        tone === "light" ? "focus-visible:outline-bronze" : "focus-visible:outline-ember",
        variant === "primary" &&
          "justify-center px-6 bg-brass text-void hover:bg-ember hover:shadow-brass motion-safe:hover:-translate-y-0.5",
        variant === "outline" &&
          tone === "light" &&
          "justify-center px-6 border border-void/25 text-void hover:border-void hover:bg-void hover:text-chalk motion-safe:hover:-translate-y-0.5",
        variant === "outline" &&
          tone === "dark" &&
          "justify-center px-6 border border-chalk/25 text-chalk hover:border-chalk hover:bg-chalk hover:text-void motion-safe:hover:-translate-y-0.5",
        variant === "link" && tone === "dark" && "justify-start text-brass hover:text-ember",
        variant === "link" && tone === "light" && "justify-start text-bronze hover:text-void",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

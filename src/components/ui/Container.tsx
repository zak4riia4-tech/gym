import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Centres content and applies the responsive side gutters. Mobile-first. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-6 md:px-10 lg:px-12", className)}>
      {children}
    </div>
  );
}

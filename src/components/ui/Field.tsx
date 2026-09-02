import type { ReactNode } from "react";
import { cn } from "@/lib/utils";


/* One shared control style, so the input, select and textarea below cannot
   drift apart visually. */
const controlBase = [
  "w-full rounded-[2px] border bg-void px-4 py-3 text-[15px] text-chalk",
  "placeholder:text-ash/70",
  "transition-[border-color,box-shadow] duration-300 ease-out-soft",
  "focus-visible:outline-none focus-visible:border-brass focus-visible:ring-1 focus-visible:ring-brass",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

function controlClasses(invalid: boolean) {
  return cn(controlBase, invalid ? "border-danger" : "border-steel hover:border-ash/50");
}

type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  /** Translated word for "Optional". Passed in so this file stays copy-free. */
  optionalLabel?: string;
  className?: string;
  children: ReactNode;
};

/** Label + control + error message, wired together for screen readers. */
function FieldShell({ id, label, error, optional, optionalLabel, className, children }: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className="flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ash"
      >
        {label}
        {optional ? <span className="text-[10px] text-ash/70">{optionalLabel}</span> : null}
      </label>

      {children}

      {/* role="alert" makes a screen reader announce the problem as it appears. */}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-[13px] leading-snug text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Shared props that connect any control to its label and error text. */
function a11yProps(id: string, error?: string) {
  return {
    id,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? `${id}-error` : undefined,
  };
}

type BaseProps = {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  optionalLabel?: string;
  className?: string;
};

export function TextField({
  id, label, error, optional, optionalLabel, className, ...input
}: BaseProps & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell id={id} label={label} error={error} optional={optional} optionalLabel={optionalLabel} className={className}>
      <input {...a11yProps(id, error)} {...input} className={controlClasses(Boolean(error))} />
    </FieldShell>
  );
}

export function SelectField({
  id, label, error, optional, optionalLabel, className, children, ...select
}: BaseProps & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <FieldShell id={id} label={label} error={error} optional={optional} optionalLabel={optionalLabel} className={className}>
      <select
        {...a11yProps(id, error)}
        {...select}
        className={cn(controlClasses(Boolean(error)), "appearance-none pr-10")}
      >
        {children}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({
  id, label, error, optional, optionalLabel, className, ...textarea
}: BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <FieldShell id={id} label={label} error={error} optional={optional} optionalLabel={optionalLabel} className={className}>
      <textarea
        {...a11yProps(id, error)}
        {...textarea}
        className={cn(controlClasses(Boolean(error)), "min-h-[104px] resize-y")}
      />
    </FieldShell>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { getAdminBrowserClient } from "@/lib/supabase/browser";

type Errors = { email?: string; password?: string };

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [failure, setFailure] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate(): Errors {
    const found: Errors = {};
    if (!email.trim()) found.email = "Enter your email address.";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      found.email = "That email address is not valid.";
    }
    if (!password) found.password = "Enter your password.";
    return found;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const found = validate();
    if (Object.keys(found).length > 0) {
      setErrors(found);
      document.getElementById(`login-${Object.keys(found)[0]}`)?.focus();
      return;
    }

    setErrors({});
    setFailure("");
    setSubmitting(true);

    const supabase = getAdminBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      // Deliberately vague: saying "no such account" would let someone probe
      // which email addresses exist.
      setFailure("Email or password is incorrect.");
      setSubmitting(false);
      return;
    }

    // Signing in is not the same as being authorised. Check the allow-list
    // before sending them on, so a non-admin gets a clear answer rather than
    // an empty dashboard.
    const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");

    if (rpcError || !isAdmin) {
      await supabase.auth.signOut();
      setFailure("That account does not have access to the dashboard.");
      setSubmitting(false);
      return;
    }

    // Full navigation so the server re-reads the new session cookie.
    router.replace("/admin/dashboard");
    router.refresh();
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
      <TextField
        id="login-email"
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="username"
        value={email}
        error={errors.email}
        disabled={submitting}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors((c) => ({ ...c, email: undefined }));
        }}
      />

      <div className="relative">
        <TextField
          id="login-password"
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          error={errors.password}
          disabled={submitting}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((c) => ({ ...c, password: undefined }));
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          className={[
            "absolute right-2 top-[30px] inline-flex size-10 items-center justify-center rounded-[2px]",
            "text-ash transition-colors duration-200 hover:text-chalk",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ember",
          ].join(" ")}
        >
          {showPassword ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>

      {failure ? (
        <p
          role="alert"
          className="flex items-start gap-3 rounded-[2px] border border-danger/40 bg-danger/10 px-4 py-3 text-[14px] leading-snug text-danger"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {failure}
        </p>
      ) : null}

      <Button type="submit" variant="primary" tone="dark" disabled={submitting} className="w-full">
        {submitting ? "Signing in" : "Sign in"}
        {submitting ? (
          <Loader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" />
        ) : (
          <ArrowRight aria-hidden="true" className="size-4" />
        )}
      </Button>

      {/* Placeholder until password reset is wired up in a later step. */}
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
        Lost your password? Contact the site administrator.
      </p>
    </form>
  );
}

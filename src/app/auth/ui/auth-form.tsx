"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export function AuthForm() {
  const supabase = createClient();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const payload = { email, password };
    const result =
      mode === "signup"
        ? await supabase.auth.signUp(payload)
        : await supabase.auth.signInWithPassword(payload);

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="inline-flex rounded-lg border border-slate-200 p-1 text-sm">
        <button
          className={`rounded-md px-3 py-1.5 ${
            mode === "login"
              ? "bg-slate-900 text-white"
              : "text-slate-600 dark:text-slate-300"
          }`}
          onClick={() => setMode("login")}
          type="button"
        >
          Login
        </button>
        <button
          className={`rounded-md px-3 py-1.5 ${
            mode === "signup"
              ? "bg-slate-900 text-white"
              : "text-slate-600 dark:text-slate-300"
          }`}
          onClick={() => setMode("signup")}
          type="button"
        >
          Sign up
        </button>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Email</span>
        <input
          className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm"
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Password</span>
        <input
          className="w-full rounded-lg border border-slate-300 bg-transparent px-3 py-2 text-sm"
          required
          minLength={8}
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-70"
        disabled={loading}
        type="submit"
      >
        {loading
          ? "Please wait..."
          : mode === "signup"
            ? "Create agency account"
            : "Log in"}
      </button>
    </form>
  );
}

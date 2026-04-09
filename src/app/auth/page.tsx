import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthForm } from "./ui/auth-form";

export default async function AuthPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen w-full px-4 py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-200 bg-card p-8 shadow-sm">
        <div className="mb-6 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Agency Booking Portal
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Sign up or log in with your agency email.
          </p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}

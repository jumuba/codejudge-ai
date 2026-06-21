"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/api";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const result = await apiRequest<{ access_token: string }>(
        `/api/auth/${mode}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.get("email"),
            password: data.get("password"),
          }),
        },
      );
      localStorage.setItem("codejudge_token", result.access_token);
      router.push("/dashboard");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to sign in");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className="mb-2 block text-sm font-medium">Email</label><Input name="email" type="email" defaultValue="trainer@demo.dev" required /></div>
      <div><label className="mb-2 block text-sm font-medium">Password</label><Input name="password" type="password" defaultValue="DemoPass123!" minLength={8} required /></div>
      {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
      <Button className="w-full" size="lg" disabled={loading}>{loading ? <><Loader2 className="animate-spin" /> Signing in…</> : mode === "login" ? "Sign in" : "Create account"}</Button>
      <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="w-full text-sm text-muted-foreground hover:text-foreground">
        {mode === "login" ? "New evaluator? Create an account" : "Already registered? Sign in"}
      </button>
    </form>
  );
}

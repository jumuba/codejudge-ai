"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    window.setTimeout(() => router.push("/dashboard"), 700);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div><label className="mb-2 block text-sm font-medium">Email</label><Input type="email" defaultValue="trainer@demo.dev" required /></div>
      <div><label className="mb-2 block text-sm font-medium">Password</label><Input type="password" defaultValue="DemoPass123!" minLength={8} required /></div>
      <Button className="w-full" size="lg" disabled={loading}>{loading ? <><Loader2 className="animate-spin" /> Signing in…</> : mode === "login" ? "Sign in" : "Create account"}</Button>
      <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="w-full text-sm text-muted-foreground hover:text-foreground">
        {mode === "login" ? "New evaluator? Create an account" : "Already registered? Sign in"}
      </button>
    </form>
  );
}

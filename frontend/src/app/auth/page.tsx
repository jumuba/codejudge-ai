import Link from "next/link";
import { Code2, ShieldCheck } from "lucide-react";
import { AuthForm } from "@/components/auth-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden flex-col justify-between border-r bg-card/40 p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2.5 font-semibold"><span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Code2 className="size-5" /></span>CodeJudge AI</Link>
        <div className="max-w-lg"><Badge variant="outline" className="mb-6">Evaluator workspace</Badge><h1 className="text-5xl font-semibold tracking-tight">Build better coding models with better judgments.</h1><p className="mt-5 leading-7 text-muted-foreground">Every evaluation combines executable evidence, a transparent rubric, and independent human judgment.</p></div>
        <p className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="size-4 text-emerald-500" /> Secure, anonymous model comparison</p>
      </section>
      <section className="grid place-items-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader><CardTitle className="text-2xl">Welcome back</CardTitle><p className="text-sm text-muted-foreground">Use the demo account or create a new evaluator profile.</p></CardHeader>
          <CardContent><AuthForm /></CardContent>
        </Card>
      </section>
    </main>
  );
}

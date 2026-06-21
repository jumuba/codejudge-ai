import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Code2,
  GitCompareArrows,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: GitCompareArrows,
    title: "Blind A/B comparison",
    text: "Compare two anonymous model responses without provider bias.",
  },
  {
    icon: TerminalSquare,
    title: "Evidence-first testing",
    text: "Run visible and hidden tests with captured output and strict limits.",
  },
  {
    icon: BarChart3,
    title: "Trainer analytics",
    text: "Track agreement rates, rubric trends, languages, and error patterns.",
  },
  {
    icon: ShieldCheck,
    title: "Structured datasets",
    text: "Export audit-ready human preference data as JSONL or CSV.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Code2 className="size-5" />
          </span>
          CodeJudge <span className="text-primary">AI</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#workflow" className="hover:text-foreground">Workflow</a>
          <Link href="/dashboard" className="hover:text-foreground">Live demo</Link>
        </div>
        <Button asChild>
          <Link href="/auth">Open workspace <ArrowRight /></Link>
        </Button>
      </nav>

      <section className="relative mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-20 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:pt-28">
        <div className="pointer-events-none absolute left-1/3 top-10 -z-10 size-[520px] rounded-full bg-primary/10 blur-[130px]" />
        <div>
          <Badge variant="outline" className="mb-6 gap-2 px-3 py-1.5">
            <Sparkles className="size-3.5 text-emerald-500" />
            Human judgment, backed by executable evidence
          </Badge>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            Evaluate AI code with more than a{" "}
            <span className="text-emerald-500">gut feeling.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
            CodeJudge AI gives coding trainers one rigorous workspace to test,
            score, compare, and export model responses.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild className="h-12 px-6">
              <Link href="/auth">Start evaluating <ArrowRight /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-6">
              <Link href="/dashboard">Explore the dashboard</Link>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["Python, JavaScript & TypeScript", "Human + LLM judge", "JSONL exports"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-500" /> {item}
              </span>
            ))}
          </div>
        </div>

        <Card className="relative border-border/70 bg-card/80 shadow-2xl shadow-black/10 backdrop-blur">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <p className="text-xs text-muted-foreground">EVALUATION · CJ-1042</p>
                <p className="mt-1 font-medium">Merge overlapping intervals</p>
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/15">Running</Badge>
            </div>
            <div className="grid grid-cols-2 divide-x">
              {[
                { name: "Response A", pass: "8 / 10", color: "text-amber-500", width: "80%" },
                { name: "Response B", pass: "10 / 10", color: "text-emerald-500", width: "100%" },
              ].map((response) => (
                <div className="p-5" key={response.name}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{response.name}</span>
                    <span className={`font-mono text-xs ${response.color}`}>{response.pass}</span>
                  </div>
                  <pre className="mt-4 overflow-hidden rounded-lg bg-zinc-950 p-4 font-mono text-[11px] leading-5 text-zinc-300">
{`def merge(intervals):
  intervals.sort()
  result = []
  for start, end in intervals:
    if result and start <= result[-1][1]:
      result[-1][1] = max(end, result[-1][1])
    else:
      result.append([start, end])
  return result`}
                  </pre>
                  <div className="mt-4 h-1.5 rounded-full bg-muted">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: response.width }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t px-5 py-4 text-sm">
              <span className="text-muted-foreground">Human verdict</span>
              <span className="flex items-center gap-2 font-medium text-emerald-500">
                <CheckCircle2 className="size-4" /> Response B is better
              </span>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="features" className="border-y bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-px px-6 py-20 md:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="px-6 py-5 first:pl-0">
              <Icon className="mb-5 size-6 text-emerald-500" />
              <h2 className="font-medium">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

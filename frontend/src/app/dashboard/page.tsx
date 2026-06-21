import { ArrowUpRight, CheckCircle2, Clock3, Languages, Target } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const stats = [
  { label: "Completed evaluations", value: "248", delta: "+18 this week", icon: CheckCircle2 },
  { label: "Human / LLM agreement", value: "84.7%", delta: "+3.2% vs last month", icon: Target },
  { label: "Average review time", value: "6m 24s", delta: "42s faster", icon: Clock3 },
  { label: "Languages evaluated", value: "3", delta: "Python leads at 46%", icon: Languages },
];
const errors = [
  ["Missing edge case", 68, "bg-amber-500"],
  ["Incorrect logic", 51, "bg-red-500"],
  ["Inefficient algorithm", 34, "bg-violet-500"],
  ["Instruction violation", 23, "bg-sky-500"],
];

export default function Dashboard() {
  return (
    <AppShell>
      <header className="flex h-18 items-center justify-between border-b px-6 lg:px-8">
        <div><p className="text-xs text-muted-foreground">WORKSPACE</p><h1 className="font-semibold">Evaluation overview</h1></div>
        <Button asChild><Link href="/evaluate">New evaluation <ArrowUpRight /></Link></Button>
      </header>
      <main className="space-y-6 p-6 lg:p-8">
        <div><h2 className="text-2xl font-semibold tracking-tight">Good morning, Trainer.</h2><p className="mt-1 text-sm text-muted-foreground">Here is the quality pulse across your coding evaluations.</p></div>
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ label, value, delta, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between"><p className="text-sm text-muted-foreground">{label}</p><Icon className="size-4 text-emerald-500" /></div>
                <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
                <p className="mt-2 text-xs text-emerald-500">{delta}</p>
              </CardContent>
            </Card>
          ))}
        </section>
        <section className="grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
          <Card>
            <CardHeader className="flex-row items-center justify-between"><CardTitle>Recent evaluations</CardTitle><Button variant="ghost" size="sm">View all</Button></CardHeader>
            <CardContent className="space-y-1">
              {[
                ["Merge overlapping intervals", "Python", "Response B", "Agreed", "2 min ago"],
                ["Debounce an async function", "TypeScript", "Response A", "Agreed", "34 min ago"],
                ["Validate a binary search tree", "Python", "Tie", "Disagreed", "1 hr ago"],
                ["Group anagrams", "JavaScript", "Response B", "Agreed", "Yesterday"],
              ].map(([title, lang, verdict, agreement, time]) => (
                <div key={title} className="grid grid-cols-[1fr_auto] items-center gap-4 rounded-lg px-3 py-3 hover:bg-muted/60 md:grid-cols-[1fr_100px_110px_90px]">
                  <div><p className="text-sm font-medium">{title}</p><p className="mt-1 text-xs text-muted-foreground md:hidden">{lang} · {time}</p></div>
                  <Badge variant="outline" className="hidden w-fit md:flex">{lang}</Badge>
                  <p className="hidden text-sm md:block">{verdict}</p>
                  <Badge className={agreement === "Agreed" ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}>{agreement}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Top error categories</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {errors.map(([name, amount, color]) => (
                <div key={String(name)}>
                  <div className="mb-2 flex justify-between text-sm"><span>{name}</span><span className="font-mono text-muted-foreground">{amount}</span></div>
                  <div className="h-1.5 rounded-full bg-muted"><div className={`h-full rounded-full ${color}`} style={{ width: `${amount}%` }} /></div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </main>
    </AppShell>
  );
}

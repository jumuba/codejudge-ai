import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const tasks = [
  ["Merge overlapping intervals", "Python", "Medium", "10 tests", "Ready"],
  ["Debounce an async function", "TypeScript", "Hard", "12 tests", "Ready"],
  ["Validate a binary search tree", "Python", "Medium", "14 tests", "Ready"],
  ["Group anagrams", "JavaScript", "Medium", "9 tests", "Completed"],
  ["Implement an LRU cache", "TypeScript", "Hard", "16 tests", "Draft"],
  ["Find the first unique character", "JavaScript", "Easy", "8 tests", "Ready"],
];

export default function TasksPage() {
  return (
    <AppShell>
      <header className="flex h-18 items-center justify-between border-b px-6 lg:px-8"><h1 className="font-semibold">Task library</h1><Button><Plus /> Create task</Button></header>
      <main className="space-y-6 p-6 lg:p-8">
        <div><h2 className="text-2xl font-semibold tracking-tight">Coding tasks</h2><p className="mt-1 text-sm text-muted-foreground">Curate prompts, tests, constraints, and evaluation rubrics.</p></div>
        <div className="flex gap-3"><div className="relative max-w-xl flex-1"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><Input placeholder="Search tasks..." className="pl-9" /></div><Button variant="outline"><SlidersHorizontal /> Filters</Button></div>
        <Card><CardContent className="p-2">
          {tasks.map(([title, language, difficulty, tests, status]) => (
            <Link href="/evaluate" key={title} className="grid items-center gap-3 rounded-lg p-4 hover:bg-muted/60 md:grid-cols-[1fr_120px_100px_100px_100px]">
              <div><p className="font-medium">{title}</p><p className="mt-1 text-xs text-muted-foreground">Includes visible and hidden edge-case tests</p></div>
              <Badge variant="outline" className="w-fit">{language}</Badge><span className="text-sm text-muted-foreground">{difficulty}</span><span className="text-sm text-muted-foreground">{tests}</span>
              <Badge className={`w-fit ${status === "Ready" ? "bg-emerald-500/15 text-emerald-500" : status === "Draft" ? "bg-amber-500/15 text-amber-500" : ""}`}>{status}</Badge>
            </Link>
          ))}
        </CardContent></Card>
      </main>
    </AppShell>
  );
}

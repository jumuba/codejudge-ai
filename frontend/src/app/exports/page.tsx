import { Download, FileJson2, FileSpreadsheet } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const preview = `{
  "task_id": "PY-004",
  "language": "python",
  "human_preference": "response_b",
  "llm_preference": "response_b",
  "agreement": true,
  "rubric_scores": {
    "correctness_a": 3,
    "correctness_b": 5
  },
  "error_labels": ["missing_edge_case"]
}`;

export default function ExportsPage() {
  return (
    <AppShell>
      <header className="flex h-18 items-center border-b px-6 lg:px-8"><h1 className="font-semibold">Dataset exports</h1></header>
      <main className="space-y-6 p-6 lg:p-8">
        <div><h2 className="text-2xl font-semibold">Build a training dataset</h2><p className="mt-1 text-sm text-muted-foreground">Export structured preference data for fine-tuning, benchmarking, or QA analysis.</p></div>
        <div className="grid gap-5 md:grid-cols-2">
          <Card><CardContent className="flex items-center gap-5 p-6"><FileJson2 className="size-9 text-emerald-500" /><div className="flex-1"><p className="font-medium">JSON Lines</p><p className="mt-1 text-sm text-muted-foreground">Ideal for model training pipelines.</p></div><Button><Download /> Export</Button></CardContent></Card>
          <Card><CardContent className="flex items-center gap-5 p-6"><FileSpreadsheet className="size-9 text-sky-500" /><div className="flex-1"><p className="font-medium">CSV spreadsheet</p><p className="mt-1 text-sm text-muted-foreground">Ideal for audits and manual analysis.</p></div><Button variant="outline"><Download /> Export</Button></CardContent></Card>
        </div>
        <Card><CardHeader className="flex-row items-center justify-between"><CardTitle>Export preview</CardTitle><div className="flex gap-2"><Badge variant="outline">248 records</Badge><Badge variant="outline">3 languages</Badge></div></CardHeader><CardContent><pre className="overflow-auto rounded-xl bg-zinc-950 p-6 font-mono text-xs leading-6 text-zinc-300">{preview}</pre></CardContent></Card>
      </main>
    </AppShell>
  );
}

import { AppShell } from "@/components/app-shell";
import { EvaluationWorkspace } from "@/components/evaluation-workspace";

export default function EvaluatePage() {
  return (
    <AppShell>
      <header className="flex h-18 items-center justify-between border-b px-6 lg:px-8">
        <div><p className="text-xs text-muted-foreground">BLIND COMPARISON</p><h1 className="font-semibold">Evaluation workspace</h1></div>
        <p className="font-mono text-xs text-muted-foreground">Autosaved · just now</p>
      </header>
      <main className="p-6 lg:p-8"><EvaluationWorkspace /></main>
    </AppShell>
  );
}

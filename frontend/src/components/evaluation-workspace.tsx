"use client";

import { useEffect, useState } from "react";
import { Check, CircleAlert, FlaskConical, Loader2, Play, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/api";

const responses = [
  {
    id: "A",
    code: `def merge(intervals):
    if not intervals:
        return []
    intervals.sort()
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        last_end = merged[-1][1]
        if start < last_end:
            merged[-1][1] = max(last_end, end)
        else:
            merged.append([start, end])
    return merged`,
    passed: 8,
  },
  {
    id: "B",
    code: `def merge(intervals):
    intervals = sorted(intervals)
    merged = []
    for start, end in intervals:
        if merged and start <= merged[-1][1]:
            merged[-1][1] = max(end, merged[-1][1])
        else:
            merged.append([start, end])
    return merged`,
    passed: 10,
  },
];

const criteria = ["Correctness", "Instruction following", "Readability", "Efficiency"];

export function EvaluationWorkspace() {
  const [ran, setRan] = useState(false);
  const [running, setRunning] = useState(false);
  const [verdict, setVerdict] = useState("B");
  const [submitted, setSubmitted] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [responseIds, setResponseIds] = useState<Record<string, string>>({});
  const [justification, setJustification] = useState("Response B is better because it passes all tests and correctly merges adjacent intervals. Response A uses a strict comparison and misses the required endpoint edge case.");
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    apiRequest<Array<{ id: string; responses: Array<{ id: string; label: string }> }>>("/api/tasks")
      .then((tasks) => {
        const task = tasks[0];
        if (!task) return;
        setTaskId(task.id);
        setResponseIds(Object.fromEntries(task.responses.map((item) => [item.label, item.id])));
      })
      .catch(() => setApiMessage("Demo data is available while the API wakes up."));
  }, []);

  async function runTests() {
    setRunning(true);
    const token = localStorage.getItem("codejudge_token");
    if (token && responseIds.A && responseIds.B) {
      await Promise.all(
        [responseIds.A, responseIds.B].map((responseId) =>
          apiRequest("/api/executions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ response_id: responseId }),
          }),
        ),
      ).catch(() => setApiMessage("Using cached demo execution results."));
    }
    window.setTimeout(() => {
      setRunning(false);
      setRan(true);
    }, 500);
  }

  async function submitEvaluation() {
    const token = localStorage.getItem("codejudge_token");
    if (!token || !taskId) {
      setApiMessage("Sign in first to save this evaluation.");
      return;
    }
    try {
      await apiRequest("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          task_id: taskId,
          preference: verdict === "A" ? "response_a" : verdict === "B" ? "response_b" : verdict === "Tie" ? "tie" : "both_incorrect",
          justification,
          rubric_scores: { correctness_a: 3, correctness_b: 5, readability_a: 4, readability_b: 5 },
          error_labels: ["missing_edge_case"],
        }),
      });
      setSubmitted(true);
      setApiMessage("Evaluation saved to PostgreSQL.");
    } catch (reason) {
      setApiMessage(reason instanceof Error ? reason.message : "Unable to save evaluation.");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">Python</Badge><Badge variant="outline">Medium</Badge>
            <span className="ml-auto text-xs text-muted-foreground">TASK · PY-004</span>
          </div>
          <h2 className="mt-4 text-xl font-semibold">Merge overlapping intervals</h2>
          <p className="mt-2 max-w-4xl text-sm leading-6 text-muted-foreground">
            Given a list of intervals, merge all overlapping intervals and return the result sorted by start time.
            Adjacent intervals such as <code className="text-foreground">[1, 4]</code> and <code className="text-foreground">[4, 5]</code> must also be merged.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        {responses.map((response) => (
          <Card key={response.id} className={verdict === response.id ? "ring-1 ring-primary" : ""}>
            <CardHeader className="flex-row items-center justify-between">
              <div><CardTitle>Response {response.id}</CardTitle><p className="mt-1 text-xs text-muted-foreground">Model identity hidden until submission</p></div>
              {ran && <Badge className={response.passed === 10 ? "bg-emerald-500/15 text-emerald-500" : "bg-amber-500/15 text-amber-500"}>{response.passed}/10 passed</Badge>}
            </CardHeader>
            <CardContent>
              <pre className="min-h-72 overflow-auto rounded-xl border bg-zinc-950 p-5 font-mono text-xs leading-6 text-zinc-300">{response.code}</pre>
              {ran && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-emerald-500"><Check className="size-4" /> Visible tests: 5/5 passed</div>
                  <div className={`flex items-center gap-2 text-sm ${response.passed === 10 ? "text-emerald-500" : "text-amber-500"}`}>
                    {response.passed === 10 ? <Check className="size-4" /> : <CircleAlert className="size-4" />}
                    Hidden tests: {response.passed - 5}/5 passed
                  </div>
                  {response.id === "A" && <p className="rounded-lg bg-amber-500/10 p-3 text-xs leading-5 text-amber-400">Fails when two intervals share an endpoint because it uses <code>&lt;</code> instead of <code>&lt;=</code>.</p>}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button size="lg" onClick={runTests} disabled={running} className="min-w-48">
          {running ? <><Loader2 className="animate-spin" /> Running sandbox…</> : <><Play /> Run both solutions</>}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Human evaluation</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-4">
            {["A", "B", "Tie", "Both incorrect"].map((choice) => (
              <Button key={choice} variant={verdict === choice ? "default" : "outline"} onClick={() => setVerdict(choice)}>
                {choice === "A" || choice === "B" ? `Response ${choice}` : choice}
              </Button>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {criteria.map((criterion, index) => (
              <div key={criterion} className="rounded-xl border p-4">
                <p className="text-sm font-medium">{criterion}</p>
                <div className="mt-3 flex gap-1.5">{[1,2,3,4,5].map((n) => <button key={n} className={`grid size-7 place-items-center rounded text-xs ${n <= (index === 0 ? 5 : 4) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{n}</button>)}</div>
              </div>
            ))}
          </div>
          <Textarea value={justification} onChange={(event) => setJustification(event.target.value)} className="min-h-28" />
          {apiMessage && <p className="text-sm text-muted-foreground">{apiMessage}</p>}
          <div className="flex justify-end">
            <Button onClick={submitEvaluation} disabled={!ran}><Send /> Submit human verdict</Button>
          </div>
        </CardContent>
      </Card>

      {submitted && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center">
            <span className="grid size-12 place-items-center rounded-full bg-emerald-500/15 text-emerald-500"><FlaskConical /></span>
            <div className="flex-1"><p className="font-semibold">Human and LLM judges agree</p><p className="mt-1 text-sm text-muted-foreground">Both selected Response B. The LLM judge independently identified the same endpoint edge case.</p></div>
            <Badge className="w-fit bg-emerald-500 text-zinc-950">Agreement</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

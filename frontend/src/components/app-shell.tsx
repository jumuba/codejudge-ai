"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, BookOpen, Code2, Download, GitCompareArrows, LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/tasks", label: "Task library", icon: BookOpen },
  { href: "/evaluate", label: "Evaluate", icon: GitCompareArrows },
  { href: "/exports", label: "Datasets", icon: Download },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r bg-card/40 lg:flex lg:flex-col">
        <Link href="/" className="flex h-18 items-center gap-2.5 border-b px-6 font-semibold">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Code2 className="size-5" /></span>
          CodeJudge AI
        </Link>
        <nav className="flex-1 space-y-1 p-4">
          <p className="mb-3 px-3 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Workspace</p>
          {nav.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-muted hover:text-foreground",
              pathname === href && "bg-muted text-foreground"
            )}>
              <Icon className="size-4" /> {label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <Button variant="ghost" className="mb-3 w-full justify-start gap-3"><Settings /> Settings</Button>
          <div className="flex items-center gap-3 rounded-xl bg-muted/60 p-3">
            <Avatar className="size-9"><AvatarFallback>AT</AvatarFallback></Avatar>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">AI Trainer</p><p className="truncate text-xs text-muted-foreground">trainer@demo.dev</p></div>
            <LogOut className="size-4 text-muted-foreground" />
          </div>
        </div>
      </aside>
      <div className="lg:pl-64">{children}</div>
    </div>
  );
}

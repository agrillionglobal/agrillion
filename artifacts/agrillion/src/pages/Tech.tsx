import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useListProjects,
  useGetProject,
  useGetImpactMetrics,
  getGetProjectQueryKey,
} from "@workspace/api-client-react";
import { num, fullDate, relativeDate } from "@/lib/format";
import {
  Sprout,
  MapPin,
  Users,
  Briefcase,
  Package,
  CheckCircle2,
  Circle,
  Clock3,
  Map,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function Tech() {
  const projects = useListProjects();
  const impact = useGetImpactMetrics();
  const [activeId, setActiveId] = useState<string | null>(null);
  const detail = useGetProject(activeId ?? "", {
    query: { enabled: !!activeId, queryKey: getGetProjectQueryKey(activeId ?? "") },
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Tech & Projects"
        title="Real progress across Nigeria."
        description="Every Agrillion-backed project is tracked openly — from rice mills to cold storage hubs. Watch milestones, follow updates, and see the impact."
      />

      {/* Impact strip */}
      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-5">
        {[
          { label: "Active projects", value: impact.data?.activeProjects ?? 0, icon: Sprout },
          { label: "States covered", value: impact.data?.statesCovered ?? 0, icon: Map },
          { label: "Jobs created", value: impact.data?.jobsCreated ?? 0, icon: Briefcase },
          { label: "Farmers supported", value: impact.data?.farmersSupported ?? 0, icon: Users },
          { label: "Tons processed", value: impact.data?.tonsProcessed ?? 0, icon: Package },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-5">
                  <Icon className="h-4 w-4 text-amber-600" />
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.label}</p>
                  <p className="mt-2 font-serif text-2xl font-semibold">{num(s.value)}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* States breakdown */}
      {impact.data?.statesBreakdown && impact.data.statesBreakdown.length > 0 && (
        <Card className="mt-6">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Projects by state</p>
            <div className="mt-4 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impact.data.statesBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                  <YAxis dataKey="state" type="category" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} width={120} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }}
                  />
                  <Bar dataKey="projects" fill="hsl(42 75% 55%)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project grid */}
      <div className="mt-10">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">All projects</p>
        {projects.data && projects.data.length > 0 ? (
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.data.map((p, i) => (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => setActiveId(p.id)}
                className="text-left"
              >
                <Card className="overflow-hidden h-full hover-elevate cursor-pointer">
                  <div className="aspect-[16/10] forest-gradient leaf-motif relative">
                    {p.coverImage && (
                      <img
                        src={p.coverImage}
                        alt={p.name}
                        className="absolute inset-0 h-full w-full object-cover opacity-90"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/85 to-emerald-950/30" />
                    <div className="absolute inset-0 flex flex-col justify-end p-5">
                      <p className="text-xs uppercase tracking-wider text-amber-300/80">{p.category}</p>
                      <p className="mt-1 font-serif text-xl font-semibold text-amber-50">{p.name}</p>
                      <p className="text-xs text-amber-100/70 inline-flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {p.location}
                      </p>
                    </div>
                    <div className="absolute top-3 right-3"><StatusPill status={p.status} /></div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.summary}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{p.progress}%</span>
                      </div>
                      <Progress value={p.progress} className="h-2" />
                    </div>
                    <p className="mt-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                      Started {fullDate(p.startedAt)}
                    </p>
                  </CardContent>
                </Card>
              </motion.button>
            ))}
          </div>
        ) : (
          <EmptyState title="No projects yet" />
        )}
      </div>

      {/* Detail dialog */}
      <Dialog open={!!activeId} onOpenChange={(o) => !o && setActiveId(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
          {detail.data ? (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-primary">{detail.data.category}</p>
                    <DialogTitle className="font-serif text-2xl mt-1">{detail.data.name}</DialogTitle>
                    <DialogDescription className="inline-flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {detail.data.location}
                    </DialogDescription>
                  </div>
                  <StatusPill status={detail.data.status} />
                </div>
              </DialogHeader>
              <div className="aspect-[16/8] rounded-xl forest-gradient leaf-motif relative overflow-hidden">
                {detail.data.coverImage && (
                  <img
                    src={detail.data.coverImage}
                    alt={detail.data.name}
                    className="absolute inset-0 h-full w-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{detail.data.summary}</p>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Jobs created", value: detail.data.impact?.jobsCreated ?? 0, icon: Briefcase },
                  { label: "Farmers supported", value: detail.data.impact?.farmersSupported ?? 0, icon: Users },
                  { label: "Tons processed", value: detail.data.impact?.tonsProcessed ?? 0, icon: Package },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="rounded-xl bg-muted/50 p-4">
                      <Icon className="h-4 w-4 text-amber-600" />
                      <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
                      <p className="mt-1 font-serif text-xl font-semibold">{num(s.value)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-2.5">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Progress: {detail.data.progress}%</p>
                <Progress value={detail.data.progress} className="h-2.5" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Milestones</p>
                <ol className="space-y-3">
                  {detail.data.milestones?.map((m, i: number) => {
                    const Icon = m.status === "completed" ? CheckCircle2 : m.status === "in_progress" ? Clock3 : Circle;
                    const tone = m.status === "completed" ? "text-emerald-600" : m.status === "in_progress" ? "text-amber-600" : "text-muted-foreground";
                    return (
                      <li key={i} className="flex items-start gap-3">
                        <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${tone}`} />
                        <div>
                          <p className="text-sm font-medium">{m.title}</p>
                          <p className="text-xs text-muted-foreground">{m.description}</p>
                          {m.date && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{fullDate(m.date)}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Recent updates</p>
                <div className="space-y-3">
                  {detail.data.updates?.map((u) => (
                    <Card key={u.id}>
                      <CardContent className="p-4">
                        <p className="text-sm font-medium">{u.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{u.body}</p>
                        <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground/70">{relativeDate(u.postedAt)}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setActiveId(null)}>Close</Button>
              </div>
            </>
          ) : (
            <div className="grid place-items-center py-16">
              <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

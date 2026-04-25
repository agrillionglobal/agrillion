import { Link } from "wouter";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import {
  useGetDashboardSummary,
  useGetRecentActivity,
} from "@workspace/api-client-react";
import {
  Wallet,
  Sparkles,
  Store,
  Sprout,
  Phone,
  Tv,
  Wifi,
  Zap,
  ArrowUpRight,
  TrendingUp,
  ShoppingBag,
  Send,
  ArrowRight,
} from "lucide-react";
import { naira, num, units, relativeDate } from "@/lib/format";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["hsl(150 45% 22%)", "hsl(42 75% 55%)", "hsl(165 35% 38%)", "hsl(28 70% 55%)", "hsl(195 40% 42%)"];

const QUICK = [
  { label: "Airtime", icon: Phone, to: "/smart?cat=airtime" },
  { label: "Data", icon: Wifi, to: "/smart?cat=data" },
  { label: "Cable TV", icon: Tv, to: "/smart?cat=cable" },
  { label: "Electricity", icon: Zap, to: "/smart?cat=electricity" },
  { label: "Internet", icon: Wifi, to: "/smart?cat=internet" },
  { label: "Visit Agrillion Mart", icon: Store, to: "/mart" },
  { label: "Projects", icon: Sprout, to: "/tech" },
];

export default function Dashboard() {
  const summary = useGetDashboardSummary();
  const activity = useGetRecentActivity({ limit: 12 });

  if (summary.isLoading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-44 rounded-2xl bg-muted animate-pulse" />)}
          </div>
        </div>
      </AppShell>
    );
  }

  const data = summary.data;
  if (!data) return <AppShell><EmptyState title="Could not load dashboard" /></AppShell>;

  return (
    <AppShell>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
      >
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Welcome back</p>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl font-semibold tracking-tight">
            Hello, {data.member.fullName.split(" ")[0]}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">{data.member.membershipId}</Badge>
            <StatusPill status={data.member.tier} />
            <span className="text-xs text-muted-foreground">{data.member.lga}, {data.member.state}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/smart"><Button variant="outline">Pay a bill</Button></Link>
          <Link href="/mart"><Button className="bg-primary text-primary-foreground hover:bg-primary/90">Visit Agrillion Mart</Button></Link>
        </div>
      </motion.div>

      {/* Wallet cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card className="overflow-hidden h-full forest-gradient text-amber-50 border-amber-300/20">
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-300/80">Cash wallet</p>
                  <p className="mt-3 font-serif text-3xl md:text-4xl font-semibold">{naira(data.wallet.cashBalance)}</p>
                  <p className="mt-1 text-xs text-amber-100/60">Available for bills & Agrillion Mart</p>
                </div>
                <div className="rounded-xl bg-amber-400/15 p-2.5 ring-1 ring-amber-300/30">
                  <Wallet className="h-5 w-5 text-amber-300" />
                </div>
              </div>
              <Button variant="ghost" className="mt-6 -ml-3 text-amber-200 hover:text-amber-100 hover:bg-emerald-900/40">
                Top up wallet <ArrowUpRight className="ml-1 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="overflow-hidden h-full bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-200/50">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-700 dark:text-amber-400">Smart Units</p>
                  <p className="mt-3 font-serif text-3xl md:text-4xl font-semibold text-amber-950 dark:text-amber-100">
                    {num(data.wallet.smartUnits)} <span className="text-base font-normal text-amber-800/60">SU</span>
                  </p>
                  <p className="mt-1 text-xs text-amber-800/70 dark:text-amber-200/60">
                    Pending: {num(data.wallet.pendingUnits)} SU
                  </p>
                </div>
                <div className="rounded-xl gold-gradient p-2.5 ring-1 ring-amber-300/40 shadow-sm">
                  <Sparkles className="h-5 w-5 text-emerald-950" />
                </div>
              </div>
              <Link href="/smart">
                <Button variant="ghost" className="mt-6 -ml-3 text-amber-800 dark:text-amber-300 hover:bg-amber-200/40">
                  Open Smart wallet <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="h-full">
            <CardContent className="p-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Earned this month</p>
                <p className="mt-2 font-serif text-2xl font-semibold gold-text">+{num(data.unitsEarnedThisMonth)} SU</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Bills paid</p>
                <p className="mt-2 font-serif text-2xl font-semibold">{data.utilityPurchasesThisMonth}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Agrillion Mart orders</p>
                <p className="mt-2 font-serif text-2xl font-semibold">{data.martOrdersCount}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Member since</p>
                <p className="mt-2 font-serif text-sm font-semibold">
                  {new Date(data.member.joinedAt).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick actions */}
      <div className="mt-8">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Quick actions</p>
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {QUICK.map((q, i) => {
            const Icon = q.icon;
            return (
              <motion.div
                key={q.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.04 }}
              >
                <Link href={q.to}>
                  <Card className="hover-elevate cursor-pointer">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      <div className="rounded-xl bg-primary/10 p-2.5 ring-1 ring-primary/15">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <p className="text-xs font-medium">{q.label}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Charts row */}
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Smart Units this week</p>
                <p className="mt-1 font-serif text-2xl font-semibold gold-text">
                  +{num(data.weeklyUnits.reduce((s, w) => s + w.units, 0))} SU
                </p>
              </div>
              <Badge variant="secondary" className="gap-1.5">
                <TrendingUp className="h-3 w-3" /> 7-day rewards
              </Badge>
            </div>
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.weeklyUnits}>
                  <defs>
                    <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(42 75% 55%)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="hsl(42 75% 55%)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${num(v)} SU`, "Earned"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="units"
                    stroke="hsl(42 75% 50%)"
                    strokeWidth={2.5}
                    fill="url(#goldArea)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Spend by category</p>
            {data.spendByCategory.length === 0 ? (
              <div className="h-56 grid place-items-center text-sm text-muted-foreground">No data yet</div>
            ) : (
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.spendByCategory}
                      dataKey="amount"
                      nameKey="category"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={2}
                    >
                      {data.spendByCategory.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => naira(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="mt-3 space-y-1.5">
              {data.spendByCategory.slice(0, 5).map((c, i) => (
                <div key={c.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="capitalize">{c.category}</span>
                  </div>
                  <span className="font-medium">{naira(c.amount)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recent activity</p>
          <Link href="/smart" className="text-xs text-primary hover:underline inline-flex items-center gap-1">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <Card className="mt-3">
          <CardContent className="p-0">
            {activity.data && activity.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {activity.data.map((a) => {
                  const Icon = a.kind === "utility" ? Zap : a.kind === "mart" ? ShoppingBag : a.kind === "transfer" ? Send : Sparkles;
                  return (
                    <li key={a.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40">
                      <div className="rounded-xl bg-primary/10 p-2.5 ring-1 ring-primary/15">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{a.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{a.description}</p>
                      </div>
                      <div className="text-right">
                        {a.amount != null && a.amount > 0 && (
                          <p className="text-sm font-medium">{naira(a.amount)}</p>
                        )}
                        {a.units != null && a.units !== 0 && (
                          <p className="text-xs gold-text font-medium">
                            {a.kind === "transfer" && a.title.includes("sent") ? "−" : "+"}
                            {units(Math.abs(a.units))}
                          </p>
                        )}
                        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                          {relativeDate(a.createdAt)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <EmptyState title="No activity yet" description="Pay your first bill or visit Agrillion Mart to get started." />
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

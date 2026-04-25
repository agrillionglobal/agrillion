import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetAdminOverview,
  useListAdminMembers,
  useListAdminTransactions,
  useGetRevenueReport,
  useGetAdminSettings,
  useUpdateAdminSettings,
  getGetAdminSettingsQueryKey,
} from "@workspace/api-client-react";
import { naira, num, fullDate } from "@/lib/format";
import {
  Users,
  Sparkles,
  Banknote,
  Receipt,
  ShoppingBag,
  ShieldAlert,
  Crown,
  Shield,
  ShieldCheck,
  Lock,
  UserPlus,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  AdminRole,
  ROLE_LABEL,
  ROLE_DESCRIPTION,
  ROLE_PERMISSIONS,
  ROLE_BADGE_CLASS,
  SEED_ADMINS,
  CURRENT_ADMIN_ID,
  hasPermission,
  ALL_ROLES,
  type AdminUser,
} from "@/lib/admin-roles";
import { initials } from "@/lib/format";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { toast } from "sonner";

const PIE_COLORS = ["hsl(150 45% 22%)", "hsl(42 75% 55%)", "hsl(165 35% 38%)", "hsl(28 70% 55%)", "hsl(195 40% 42%)"];

export default function Admin() {
  const overview = useGetAdminOverview();
  const members = useListAdminMembers();
  const txns = useListAdminTransactions();
  const revenue = useGetRevenueReport();
  const settings = useGetAdminSettings();
  const queryClient = useQueryClient();

  const update = useUpdateAdminSettings({
    mutation: {
      onSuccess: () => {
        toast.success("Settings saved");
        queryClient.invalidateQueries({ queryKey: getGetAdminSettingsQueryKey() });
      },
      onError: (err) => toast.error("Save failed", { description: err.message }),
    },
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Admin Console"
        title="Operate Agrillion."
        description="Member growth, revenue, transactions, services and platform settings — all at a glance."
      />

      {/* Overview KPIs */}
      <div className="mt-8 grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {[
          { label: "Total members", value: num(overview.data?.totalMembers ?? 0), icon: Users },
          { label: "Active members", value: num(overview.data?.activeMembers ?? 0), icon: Users },
          { label: "Units circulating", value: num(overview.data?.totalUnitsCirculating ?? 0), suffix: "SU", icon: Sparkles },
          { label: "Platform revenue", value: naira(overview.data?.totalRevenueNgn ?? 0), icon: Banknote },
          { label: "Bill volume", value: naira(overview.data?.totalUtilityVolumeNgn ?? 0), icon: Receipt },
          { label: "Agrillion Mart orders", value: num(overview.data?.totalMartOrders ?? 0), icon: ShoppingBag },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.label}</p>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="mt-3 font-serif text-xl font-semibold">
                    {s.value} {s.suffix && <span className="text-base font-normal text-muted-foreground">{s.suffix}</span>}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {(overview.data?.fraudAlerts ?? 0) > 0 && (
        <Card className="mt-4 border-amber-300/40 bg-amber-50 dark:bg-amber-950/30">
          <CardContent className="p-4 flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-amber-700 dark:text-amber-300" />
            <p className="text-sm">
              <span className="font-medium">{overview.data?.fraudAlerts}</span> fraud alerts need review.
            </p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Member growth</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overview.data?.memberGrowth ?? []}>
                    <defs>
                      <linearGradient id="growth" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(150 45% 30%)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="hsl(150 45% 30%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} />
                    <Area type="monotone" dataKey="members" stroke="hsl(150 45% 30%)" strokeWidth={2.5} fill="url(#growth)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Revenue by service</p>
              <div className="mt-4 h-64 grid grid-cols-[1fr_auto] gap-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={overview.data?.revenueByService ?? []} dataKey="revenue" nameKey="service" innerRadius={50} outerRadius={85} paddingAngle={2}>
                      {(overview.data?.revenueByService ?? []).map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => naira(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col justify-center gap-2 text-xs min-w-[120px]">
                  {(overview.data?.revenueByService ?? []).map((c, i) => (
                    <div key={c.service} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                        <span className="capitalize">{c.service}</span>
                      </div>
                      <span className="font-medium">{naira(c.revenue, true)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members" className="mt-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {members.data && members.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Membership ID</TableHead>
                        <TableHead>State</TableHead>
                        <TableHead>Tier</TableHead>
                        <TableHead className="text-right">Cash</TableHead>
                        <TableHead className="text-right">Smart Units</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.data.map((m) => (
                        <TableRow key={m.id} className="hover:bg-muted/40">
                          <TableCell>
                            <div className="font-medium">{m.fullName}</div>
                            <div className="text-xs text-muted-foreground">{m.email}</div>
                          </TableCell>
                          <TableCell className="font-mono text-xs">{m.membershipId}</TableCell>
                          <TableCell>{m.state}</TableCell>
                          <TableCell><StatusPill status={m.tier} /></TableCell>
                          <TableCell className="text-right font-medium">{naira(m.cashBalance)}</TableCell>
                          <TableCell className="text-right gold-text font-semibold">{num(m.smartUnits)} SU</TableCell>
                          <TableCell><StatusPill status={m.status} /></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{fullDate(m.joinedAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState title="No members yet" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins" className="mt-6">
          <AdminsPanel />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {txns.data && txns.data.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reference</TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Margin</TableHead>
                        <TableHead className="text-right">Units</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>When</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {txns.data.slice(0, 100).map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-mono text-[10px]">{t.reference}</TableCell>
                          <TableCell className="text-xs">{t.memberName ?? "—"}</TableCell>
                          <TableCell className="capitalize">{t.serviceCategory}</TableCell>
                          <TableCell>{t.provider}</TableCell>
                          <TableCell className="text-right font-medium">{naira(t.amount)}</TableCell>
                          <TableCell className="text-right text-xs">{naira(t.marginGenerated, true)}</TableCell>
                          <TableCell className="text-right gold-text font-semibold">+{num(t.unitsEarned)}</TableCell>
                          <TableCell><StatusPill status={t.status} /></TableCell>
                          <TableCell className="text-xs text-muted-foreground">{fullDate(t.createdAt)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <EmptyState title="No transactions yet" />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Daily revenue</p>
              <p className="mt-1 font-serif text-2xl font-semibold">{naira(revenue.data?.totalNgn ?? 0)}</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenue.data?.daily ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }}
                      formatter={(v: number, name: string) => [name === "revenue" ? naira(v, true) : naira(v), name]}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(42 75% 50%)" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">By category</p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenue.data?.byCategory ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => naira(v, true)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }} />
                    <Bar dataKey="revenue" fill="hsl(150 45% 25%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          {settings.data && (
            <SettingsForm
              initial={settings.data}
              busy={update.isPending}
              onSave={(v) => update.mutate({ data: v })}
            />
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

type SettingsValue = {
  unitConversionRateNgn: number;
  rewardSplitMemberPct: number;
  servicesEnabled: { airtime: boolean; data: boolean; cable: boolean; electricity: boolean; internet: boolean };
};

function SettingsForm({
  initial,
  onSave,
  busy,
}: {
  initial: SettingsValue;
  onSave: (v: SettingsValue) => void;
  busy: boolean;
}) {
  const [v, setV] = useState<SettingsValue>(initial);
  useEffect(() => setV(initial), [initial]);

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(v); }}
      className="grid gap-6 md:grid-cols-2"
    >
      <Card>
        <CardContent className="p-6 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Reward economics</p>
            <h3 className="mt-1 font-serif text-lg font-semibold">Smart Units</h3>
          </div>
          <div className="space-y-2">
            <Label>Unit conversion rate (₦ per Smart Unit)</Label>
            <Input
              type="number"
              min={0.01}
              step={0.01}
              value={v.unitConversionRateNgn}
              onChange={(e) => setV({ ...v, unitConversionRateNgn: Number(e.target.value) })}
            />
            <p className="text-xs text-muted-foreground">Base value used across Agrillion Mart and member statements.</p>
          </div>
          <div className="space-y-2">
            <Label>Reward split (member %)</Label>
            <Input
              type="number"
              min={0}
              max={100}
              value={v.rewardSplitMemberPct}
              onChange={(e) => setV({ ...v, rewardSplitMemberPct: Number(e.target.value) })}
            />
            <p className="text-xs text-muted-foreground">Portion of platform margin returned to the member as Smart Units.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Available services</p>
            <h3 className="mt-1 font-serif text-lg font-semibold">Smart toggles</h3>
          </div>
          {(["airtime", "data", "cable", "electricity", "internet"] as const).map((k) => (
            <div key={k} className="flex items-center justify-between border-b border-border last:border-0 py-2">
              <Label className="capitalize">{k}</Label>
              <Switch
                checked={v.servicesEnabled[k]}
                onCheckedChange={(checked) => setV({ ...v, servicesEnabled: { ...v.servicesEnabled, [k]: checked } })}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={busy} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {busy ? "Saving..." : "Save settings"}
        </Button>
      </div>
    </form>
  );
}

function AdminsPanel() {
  const [admins, setAdmins] = useState<AdminUser[]>(SEED_ADMINS);
  const me = admins.find((a) => a.id === CURRENT_ADMIN_ID) ?? admins[0];
  const canManage = hasPermission(me.role, "manage_admins");
  const [openInvite, setOpenInvite] = useState(false);

  const updateRole = (id: string, role: AdminRole) => {
    if (!canManage) return;
    const target = admins.find((a) => a.id === id);
    if (!target) return;
    if (target.isFounder) {
      toast.error("The founder's role is locked.");
      return;
    }
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, role } : a)));
    toast.success(`${target.fullName} is now ${ROLE_LABEL[role]}.`);
  };

  const toggleStatus = (id: string) => {
    if (!canManage) return;
    const target = admins.find((a) => a.id === id);
    if (!target) return;
    if (target.isFounder) {
      toast.error("The founder cannot be suspended.");
      return;
    }
    const next = target.status === "active" ? "suspended" : "active";
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, status: next } : a)));
    toast.success(`${target.fullName} ${next === "active" ? "reinstated" : "suspended"}.`);
  };

  const removeAdmin = (id: string) => {
    if (!canManage) return;
    const target = admins.find((a) => a.id === id);
    if (!target) return;
    if (target.isFounder) {
      toast.error("The founder cannot be removed.");
      return;
    }
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    toast.success(`${target.fullName} removed from admin team.`);
  };

  const addAdmin = (data: { fullName: string; email: string; phone: string; role: AdminRole }) => {
    const id = `adm_${Math.random().toString(36).slice(2, 8)}`;
    setAdmins((prev) => [
      ...prev,
      {
        id,
        ...data,
        status: "invited",
        lastActiveAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setOpenInvite(false);
    toast.success(`Invite sent to ${data.email}`);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/60 bg-card p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-500/15 ring-1 ring-amber-500/30 flex items-center justify-center">
            <Crown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="font-medium">Signed in as {me.fullName}</p>
            <p className="text-xs text-muted-foreground">
              Role: <span className="font-medium text-foreground">{ROLE_LABEL[me.role]}</span> ·{" "}
              {canManage
                ? "You can add, remove and reassign admins."
                : "Read-only view. Only the Super Admin can change admin roles."}
            </p>
          </div>
        </div>
        <Dialog open={openInvite} onOpenChange={setOpenInvite}>
          <DialogTrigger asChild>
            <Button disabled={!canManage} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" /> Invite admin
            </Button>
          </DialogTrigger>
          <InviteAdminDialog onSubmit={addAdmin} />
        </Dialog>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-emerald-900/10 text-emerald-900 dark:bg-emerald-200/10 dark:text-emerald-200 text-xs">
                            {initials(a.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium flex items-center gap-1.5">
                            {a.fullName}
                            {a.isFounder && (
                              <span title="Founder">
                                <Crown className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{a.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {canManage && !a.isFounder ? (
                        <Select value={a.role} onValueChange={(v) => updateRole(a.id, v as AdminRole)}>
                          <SelectTrigger className="w-[160px] h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ALL_ROLES.map((r) => (
                              <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={`${ROLE_BADGE_CLASS[a.role]} font-normal`} variant="outline">
                          {ROLE_LABEL[a.role]}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusPill
                        status={a.status === "active" ? "active" : a.status === "invited" ? "pending" : "failed"}
                      >
                        {a.status}
                      </StatusPill>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {fullDate(a.lastActiveAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!canManage || a.isFounder}
                          onClick={() => toggleStatus(a.id)}
                        >
                          {a.status === "active" ? (
                            <>
                              <XCircle className="h-3.5 w-3.5 mr-1" /> Suspend
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Activate
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!canManage || a.isFounder}
                          onClick={() => removeAdmin(a.id)}
                          className="text-rose-600 dark:text-rose-300 hover:text-rose-600"
                        >
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ALL_ROLES.map((r) => (
          <Card key={r} className="h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                {r === "super_admin" ? (
                  <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                ) : (
                  <ShieldCheck className="h-4 w-4 text-emerald-700 dark:text-emerald-300" />
                )}
                <p className="font-medium">{ROLE_LABEL[r]}</p>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{ROLE_DESCRIPTION[r]}</p>
              <ul className="mt-3 space-y-1.5 text-xs">
                {ROLE_PERMISSIONS[r].map((p) => (
                  <li key={p} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3 text-emerald-700 dark:text-emerald-300" />
                    <span className="text-foreground/80">{p.replace(/_/g, " ")}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {!canManage && (
        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 flex items-center gap-3">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Only the founder (Super Admin) can add new admins or change roles.
          </p>
        </div>
      )}
    </div>
  );
}

function InviteAdminDialog({
  onSubmit,
}: {
  onSubmit: (data: { fullName: string; email: string; phone: string; role: AdminRole }) => void;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<AdminRole>("support");
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Invite a new admin</DialogTitle>
        <DialogDescription>
          They'll get an email invite to join the Agrillion admin team. You can change their role anytime.
        </DialogDescription>
      </DialogHeader>
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          if (!fullName || !email) return;
          onSubmit({ fullName, email, phone, role });
        }}
      >
        <div className="space-y-1.5">
          <Label htmlFor="adm-name">Full name</Label>
          <Input id="adm-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="adm-email">Email</Label>
          <Input id="adm-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="adm-phone">Phone</Label>
          <Input id="adm-phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 ..." />
        </div>
        <div className="space-y-1.5">
          <Label>Role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as AdminRole)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_ROLES.filter((r) => r !== "super_admin").map((r) => (
                <SelectItem key={r} value={r}>{ROLE_LABEL[r]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[11px] text-muted-foreground">{ROLE_DESCRIPTION[role]}</p>
        </div>
        <DialogFooter className="pt-2">
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            Send invite
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

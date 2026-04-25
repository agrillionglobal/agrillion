import { useState } from "react";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { StatusPill } from "@/components/StatusPill";
import { EmptyState } from "@/components/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetSmartUnitsSummary,
  useGetWallet,
  useListSmartUnitsLedger,
  useListUtilityServices,
  useListUtilityTransactions,
  useCreateUtilityTransaction,
  useTransferSmartUnits,
  getGetWalletQueryKey,
  getGetSmartUnitsSummaryQueryKey,
  getListSmartUnitsLedgerQueryKey,
  getListUtilityTransactionsQueryKey,
  getGetDashboardSummaryQueryKey,
} from "@workspace/api-client-react";
import { naira, num, units, relativeDate } from "@/lib/format";
import { toast } from "sonner";
import {
  Phone,
  Wifi,
  Tv,
  Zap,
  Send,
  Sparkles,
  TrendingUp,
  Wallet as WalletIcon,
  Clock,
  ArrowDownToLine,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CATEGORY_ICON = {
  airtime: Phone,
  data: Wifi,
  cable: Tv,
  electricity: Zap,
  internet: Wifi,
} as const;

const CATEGORY_LABEL: Record<string, string> = {
  airtime: "Airtime",
  data: "Data Bundle",
  cable: "Cable TV",
  electricity: "Electricity",
  internet: "Internet",
};

export default function Smart() {
  const wallet = useGetWallet();
  const summary = useGetSmartUnitsSummary();
  const services = useListUtilityServices();
  const txns = useListUtilityTransactions({ limit: 50 });
  const ledger = useListSmartUnitsLedger({ limit: 50 });
  const queryClient = useQueryClient();

  const [payOpen, setPayOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);

  const createTxn = useCreateUtilityTransaction({
    mutation: {
      onSuccess: (res) => {
        toast.success("Payment successful", {
          description: `You earned ${num(res.unitsEarned)} Smart Units. New balance: ${num(res.newUnitBalance)} SU.`,
        });
        setPayOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSmartUnitsSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListUtilityTransactionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListSmartUnitsLedgerQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardSummaryQueryKey() });
      },
      onError: (err) => toast.error("Payment failed", { description: err.message }),
    },
  });

  const transfer = useTransferSmartUnits({
    mutation: {
      onSuccess: (res) => {
        toast.success("Transfer complete", {
          description: `New balance: ${num(res.newBalance)} SU. Reference ${res.reference}.`,
        });
        setTransferOpen(false);
        queryClient.invalidateQueries({ queryKey: getGetWalletQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetSmartUnitsSummaryQueryKey() });
        queryClient.invalidateQueries({ queryKey: getListSmartUnitsLedgerQueryKey() });
      },
      onError: (err) => toast.error("Transfer failed", { description: err.message }),
    },
  });

  const activeSvc = services.data?.find((s) => s.id === activeService) ?? services.data?.[0];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Smart"
        title="Pay your bills, earn rewards."
        description="Top up airtime and data, settle cable, fund your meter, pay home internet — and watch your Smart Units grow with every transaction."
        actions={
          <Button onClick={() => setTransferOpen(true)} variant="outline" className="gap-2">
            <Send className="h-4 w-4" /> Transfer Units
          </Button>
        }
      />

      {/* Wallet stat row */}
      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Smart Units", value: num(summary.data?.totalUnits ?? 0), suffix: "SU", icon: Sparkles, accent: true },
          { label: "Earned this month", value: `+${num(summary.data?.earnedThisMonth ?? 0)}`, suffix: "SU", icon: TrendingUp },
          { label: "Used to date", value: num(summary.data?.usedUnits ?? 0), suffix: "SU", icon: ArrowDownToLine },
          { label: "Pending", value: num(summary.data?.pendingUnits ?? 0), suffix: "SU", icon: Clock },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={s.accent ? "bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/10 border-amber-200/50" : ""}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{s.label}</p>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className={`mt-3 font-serif text-2xl font-semibold ${s.accent ? "gold-text" : ""}`}>
                    {s.value} <span className="text-base font-normal text-muted-foreground">{s.suffix}</span>
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Cash + chart */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="forest-gradient text-amber-50 border-amber-300/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.18em] text-amber-300/80">Cash wallet</p>
              <WalletIcon className="h-4 w-4 text-amber-300" />
            </div>
            <p className="mt-3 font-serif text-3xl font-semibold">{naira(wallet.data?.cashBalance ?? 0)}</p>
            <p className="mt-1 text-xs text-amber-100/60">
              1 Smart Unit = ₦{summary.data?.unitValueNgn ?? 1}
            </p>
            <Button variant="ghost" className="mt-4 -ml-3 text-amber-200 hover:bg-white/5">
              Top up wallet
            </Button>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Monthly rewards trend</p>
            <div className="mt-4 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.data?.monthlyTrend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, fontSize: 12 }}
                    formatter={(v: number, n: string) => [`${num(v)} SU`, n === "earned" ? "Earned" : "Used"]}
                  />
                  <Bar dataKey="earned" fill="hsl(42 75% 55%)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="used" fill="hsl(150 35% 30%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service tiles */}
      <div className="mt-10">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Pay a bill</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {services.data?.map((svc, i) => {
            const Icon = CATEGORY_ICON[svc.category as keyof typeof CATEGORY_ICON] ?? Phone;
            return (
              <motion.button
                key={svc.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                onClick={() => { setActiveService(svc.id); setPayOpen(true); }}
                className="text-left"
              >
                <Card className="hover-elevate cursor-pointer h-full">
                  <CardContent className="p-5">
                    <div className="rounded-xl bg-primary/10 p-2.5 w-fit ring-1 ring-primary/15">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="mt-4 font-serif text-lg font-semibold">{svc.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{svc.providers.length} providers · {(svc.marginRate * 100).toFixed(1)}% reward</p>
                  </CardContent>
                </Card>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Transactions table */}
      <div className="mt-10">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Recent bill payments</p>
        <Card className="mt-3 overflow-hidden">
          <CardContent className="p-0">
            {txns.data && txns.data.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Beneficiary</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Margin</TableHead>
                      <TableHead className="text-right">Earned</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {txns.data.map((t) => (
                      <TableRow key={t.id} className="hover:bg-muted/40">
                        <TableCell className="text-xs text-muted-foreground">{relativeDate(t.createdAt)}</TableCell>
                        <TableCell className="capitalize">{CATEGORY_LABEL[t.serviceCategory] ?? t.serviceCategory}</TableCell>
                        <TableCell>{t.provider}</TableCell>
                        <TableCell className="font-mono text-xs">{t.beneficiary}</TableCell>
                        <TableCell className="text-right font-medium">{naira(t.amount)}</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">{naira(t.marginGenerated, true)}</TableCell>
                        <TableCell className="text-right">
                          <span className="gold-text font-semibold">+{num(t.unitsEarned)} SU</span>
                        </TableCell>
                        <TableCell><StatusPill status={t.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState title="No bill payments yet" description="Tap a service tile above to make your first payment." />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Ledger */}
      <div className="mt-10">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Smart Units ledger</p>
        <Card className="mt-3 overflow-hidden">
          <CardContent className="p-0">
            {ledger.data && ledger.data.length > 0 ? (
              <ul className="divide-y divide-border">
                {ledger.data.map((l) => (
                  <li key={l.id} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 px-5 py-3.5 hover:bg-muted/30">
                    <div className="rounded-lg bg-muted p-2 ring-1 ring-border">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{l.description}</p>
                      <p className="text-xs text-muted-foreground capitalize">{l.sourceType.replace(/_/g, " ")} · {relativeDate(l.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      {l.unitsAdded > 0 && <p className="text-sm font-semibold gold-text">+{num(l.unitsAdded)} SU</p>}
                      {l.unitsUsed > 0 && <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">−{num(l.unitsUsed)} SU</p>}
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-xs text-muted-foreground">Balance</p>
                      <p className="text-sm font-medium">{num(l.balanceAfter)} SU</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No reward activity yet" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pay dialog */}
      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pay {activeSvc ? activeSvc.name : "bill"}</DialogTitle>
            <DialogDescription>Earn Smart Units transparently from the platform margin.</DialogDescription>
          </DialogHeader>
          <PayForm
            services={services.data ?? []}
            initialServiceId={activeSvc?.id}
            onSubmit={(v) => createTxn.mutate({ data: v })}
            busy={createTxn.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Transfer dialog */}
      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transfer Smart Units</DialogTitle>
            <DialogDescription>Send rewards to another Agrillion member.</DialogDescription>
          </DialogHeader>
          <TransferForm
            available={summary.data?.totalUnits ?? 0}
            onSubmit={(v) => transfer.mutate({ data: v })}
            busy={transfer.isPending}
          />
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function PayForm({
  services,
  initialServiceId,
  onSubmit,
  busy,
}: {
  services: { id: string; category: string; name: string; providers: { code: string; name: string }[] }[];
  initialServiceId?: string;
  onSubmit: (v: { serviceCategory: string; provider: string; beneficiary: string; amount: number }) => void;
  busy: boolean;
}) {
  const [svcId, setSvcId] = useState(initialServiceId ?? services[0]?.id ?? "");
  const svc = services.find((s) => s.id === svcId);
  const [provider, setProvider] = useState(svc?.providers[0]?.name ?? "");
  const [beneficiary, setBeneficiary] = useState("");
  const [amount, setAmount] = useState("1000");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!svc) return;
        onSubmit({ serviceCategory: svc.category, provider, beneficiary, amount: Number(amount) });
      }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label>Service</Label>
        <Select value={svcId} onValueChange={(v) => { setSvcId(v); const s = services.find((x) => x.id === v); setProvider(s?.providers[0]?.name ?? ""); }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label>Provider</Label>
        <Select value={provider} onValueChange={setProvider}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {svc?.providers.map((p) => <SelectItem key={p.code} value={p.name}>{p.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="ben">{svc?.category === "airtime" || svc?.category === "data" ? "Phone number" : svc?.category === "cable" ? "Smart card / IUC" : "Account / meter number"}</Label>
        <Input id="ben" value={beneficiary} onChange={(e) => setBeneficiary(e.target.value)} placeholder="Enter beneficiary" required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="amt">Amount (₦)</Label>
        <Input id="amt" type="number" min={100} step={100} value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <p className="text-xs text-muted-foreground">
          Estimated earn: <span className="gold-text font-semibold">+{num(Number(amount) * 0.03 * 0.6)} SU</span>
        </p>
      </div>
      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={busy}>
        {busy ? "Processing..." : `Pay ${naira(Number(amount))}`}
      </Button>
    </form>
  );
}

function TransferForm({
  available,
  onSubmit,
  busy,
}: {
  available: number;
  onSubmit: (v: { toMembershipId: string; units: number; walletPin: string; note?: string }) => void;
  busy: boolean;
}) {
  const [toId, setToId] = useState("");
  const [unitsValue, setUnitsValue] = useState("100");
  const [pin, setPin] = useState("");
  const [note, setNote] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ toMembershipId: toId, units: Number(unitsValue), walletPin: pin, note: note || undefined });
      }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <Label>Recipient Membership ID</Label>
        <Input value={toId} onChange={(e) => setToId(e.target.value.toUpperCase())} placeholder="AGP-FCT-GWA-000011" className="font-mono" required />
      </div>
      <div className="space-y-1.5">
        <Label>Smart Units to send</Label>
        <Input type="number" min={1} max={available} value={unitsValue} onChange={(e) => setUnitsValue(e.target.value)} required />
        <p className="text-xs text-muted-foreground">Available: <span className="font-medium">{units(available)}</span></p>
      </div>
      <div className="space-y-1.5">
        <Label>Wallet PIN</Label>
        <Input type="password" maxLength={4} inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} className="tracking-[0.5em] font-mono" placeholder="••••" required />
        <p className="text-xs text-muted-foreground">Demo PIN: 0000</p>
      </div>
      <div className="space-y-1.5">
        <Label>Note (optional)</Label>
        <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Birthday gift, refund, etc." />
      </div>
      <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={busy}>
        {busy ? "Sending..." : `Send ${units(Number(unitsValue))}`}
      </Button>
    </form>
  );
}

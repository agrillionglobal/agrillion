import { useState } from "react";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  ShieldCheck,
  Fingerprint,
  IdCard,
  CheckCircle2,
  AlertCircle,
  Lock,
  Smartphone,
  Mail,
  KeyRound,
  Eye,
} from "lucide-react";
import { toast } from "sonner";

type Status = "unverified" | "pending" | "verified" | "failed";

function StatusBadge({ status }: { status: Status }) {
  const map: Record<Status, { label: string; tone: string; icon: typeof CheckCircle2 }> = {
    unverified: { label: "Not verified", tone: "bg-muted text-muted-foreground", icon: AlertCircle },
    pending: { label: "Pending review", tone: "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200", icon: AlertCircle },
    verified: { label: "Verified", tone: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200", icon: CheckCircle2 },
    failed: { label: "Failed — retry", tone: "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200", icon: AlertCircle },
  };
  const { label, tone, icon: Icon } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${tone}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

export default function Verification() {
  const [ninStatus, setNinStatus] = useState<Status>("unverified");
  const [bvnStatus, setBvnStatus] = useState<Status>("unverified");
  const [nin, setNin] = useState("");
  const [bvn, setBvn] = useState("");
  const [twofa, setTwofa] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [busyKind, setBusyKind] = useState<"nin" | "bvn" | null>(null);

  const completeness =
    (ninStatus === "verified" ? 1 : 0) +
    (bvnStatus === "verified" ? 1 : 0) +
    (twofa ? 1 : 0) +
    (loginAlerts ? 1 : 0);
  const pct = Math.round((completeness / 4) * 100);

  const submitNin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{11}$/.test(nin)) {
      toast.error("NIN must be 11 digits");
      return;
    }
    setBusyKind("nin");
    setNinStatus("pending");
    setTimeout(() => {
      setBusyKind(null);
      setNinStatus("verified");
      toast.success("NIN verified", { description: "Identity confirmed via NIMC." });
    }, 1100);
  };

  const submitBvn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{11}$/.test(bvn)) {
      toast.error("BVN must be 11 digits");
      return;
    }
    setBusyKind("bvn");
    setBvnStatus("pending");
    setTimeout(() => {
      setBusyKind(null);
      setBvnStatus("verified");
      toast.success("BVN verified", { description: "Bank record confirmed via NIBSS." });
    }, 1100);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Trust & Security"
        title="Verify your identity. Lock down your account."
        description="Agrillion uses NIN and BVN verification (NIMC + NIBSS) to keep the ecosystem safe and to unlock higher transfer limits, payouts and Mart purchases."
      />

      {/* Completeness */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mt-8 overflow-hidden">
          <CardContent className="p-6 md:p-7">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Account security score
                </p>
                <p className="mt-2 font-serif text-3xl font-semibold">
                  {pct}% <span className="text-base font-normal text-muted-foreground">complete</span>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Complete all four checks below to unlock the highest tier.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <ShieldCheck className="h-12 w-12 text-amber-500" />
                <div className="hidden md:block w-48">
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full gold-gradient transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="identity" className="mt-8">
        <TabsList className="flex-wrap">
          <TabsTrigger value="identity">Identity (NIN / BVN)</TabsTrigger>
          <TabsTrigger value="security">Account security</TabsTrigger>
          <TabsTrigger value="sessions">Active sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="mt-6 grid gap-5 md:grid-cols-2">
          {/* NIN */}
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
                    <IdCard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold">National Identification Number</p>
                    <p className="text-xs text-muted-foreground">11-digit NIN issued by NIMC</p>
                  </div>
                </div>
                <StatusBadge status={ninStatus} />
              </div>
              <form onSubmit={submitNin} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="nin">NIN</Label>
                  <Input
                    id="nin"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="12345678901"
                    value={nin}
                    onChange={(e) => setNin(e.target.value.replace(/\D/g, ""))}
                    disabled={ninStatus === "verified"}
                    className="h-11 font-mono tracking-[0.2em]"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Dial *346# on your registered SIM if you don't know your NIN.
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={busyKind === "nin" || ninStatus === "verified"}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {ninStatus === "verified"
                    ? "NIN verified"
                    : busyKind === "nin"
                    ? "Verifying with NIMC..."
                    : "Verify NIN"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* BVN */}
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
                    <Fingerprint className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-serif text-lg font-semibold">Bank Verification Number</p>
                    <p className="text-xs text-muted-foreground">11-digit BVN issued by NIBSS</p>
                  </div>
                </div>
                <StatusBadge status={bvnStatus} />
              </div>
              <form onSubmit={submitBvn} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="bvn">BVN</Label>
                  <Input
                    id="bvn"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="22123456789"
                    value={bvn}
                    onChange={(e) => setBvn(e.target.value.replace(/\D/g, ""))}
                    disabled={bvnStatus === "verified"}
                    className="h-11 font-mono tracking-[0.2em]"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Dial *565*0# on your registered SIM to retrieve your BVN.
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={busyKind === "bvn" || bvnStatus === "verified"}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {bvnStatus === "verified"
                    ? "BVN verified"
                    : busyKind === "bvn"
                    ? "Verifying with NIBSS..."
                    : "Verify BVN"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 bg-muted/40 border-dashed">
            <CardContent className="p-6 flex items-start gap-4">
              <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Your data is encrypted and minimally retained.</p>
                <p className="mt-1 text-muted-foreground">
                  We hash both NIN and BVN locally before sending the verification request, and we
                  never store the raw numbers. Only the verification status (yes/no) and the matched
                  name are kept on your record.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            {
              key: "twofa",
              icon: Smartphone,
              title: "Two-factor authentication",
              desc: "One-time codes sent to your registered phone on every sign-in from a new device.",
              checked: twofa,
              set: setTwofa,
              badge: "Recommended",
            },
            {
              key: "bio",
              icon: Fingerprint,
              title: "Biometric unlock",
              desc: "Use Face ID or fingerprint on supported devices to approve transfers and Mart orders.",
              checked: biometric,
              set: setBiometric,
              badge: "New",
            },
            {
              key: "alerts",
              icon: Mail,
              title: "Login & transaction alerts",
              desc: "Get an email and SMS the moment your account is signed into or a transaction is made.",
              checked: loginAlerts,
              set: setLoginAlerts,
            },
            {
              key: "pin",
              icon: KeyRound,
              title: "Wallet PIN",
              desc: "A 4-digit PIN required for every Smart Units transfer and cash withdrawal.",
              checked: true,
              set: () => {},
              badge: "Active",
              fixed: true,
            },
          ].map((row) => {
            const Icon = row.icon;
            return (
              <Card key={row.key}>
                <CardContent className="p-5 flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-primary/10 p-2.5 ring-1 ring-primary/20">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{row.title}</p>
                        {row.badge && (
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                            {row.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground max-w-sm">{row.desc}</p>
                    </div>
                  </div>
                  <Switch
                    checked={row.checked}
                    onCheckedChange={(c) => row.set(c)}
                    disabled={row.fixed}
                  />
                </CardContent>
              </Card>
            );
          })}

          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                <p className="font-medium">Recovery options on file</p>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                You can recover your account by phone or email at any time from the sign-in screen.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium mt-1">+234 803 ••• 4567</p>
                </div>
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Email</p>
                  <p className="text-sm font-medium mt-1">a••••@example.com</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Devices currently signed in
              </p>
              <div className="mt-4 divide-y divide-border">
                {[
                  { device: "iPhone 15 · Safari", loc: "Lagos · 14 mins ago", current: true },
                  { device: "MacBook Air · Chrome", loc: "Lagos · 3 hours ago", current: false },
                  { device: "Samsung A54 · Chrome Mobile", loc: "Abuja · 2 days ago", current: false },
                ].map((s) => (
                  <div key={s.device} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-3">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{s.device}</p>
                        <p className="text-xs text-muted-foreground">{s.loc}</p>
                      </div>
                    </div>
                    {s.current ? (
                      <Badge variant="secondary">This device</Badge>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => toast.success("Session revoked")}>
                        Sign out
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

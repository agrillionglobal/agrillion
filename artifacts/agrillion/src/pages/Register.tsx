import { Link, useLocation } from "wouter";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { NIGERIA_STATES_LGAS } from "@/lib/format";

export default function Register() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<string>("Lagos");
  const [busy, setBusy] = useState(false);
  const lgas = useMemo(() => NIGERIA_STATES_LGAS[state] ?? [], [state]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/"><Logo size="sm" /></Link>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Already a member? Sign in
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[1fr_320px] gap-10 items-start">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Become a member</p>
          <h1 className="mt-1 font-serif text-3xl md:text-4xl font-semibold tracking-tight">
            Create your Agrillion account
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Free to join. No card required. Get your unique Membership ID instantly.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setBusy(true);
              setTimeout(() => setLocation("/dashboard"), 600);
            }}
            className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="full">Full name</Label>
                <Input id="full" placeholder="e.g. Adaeze Okoye" required className="h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" required className="h-11" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <div className="flex h-11 rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                  <span className="grid place-items-center px-3 text-sm font-medium text-muted-foreground border-r border-border">+234</span>
                  <Input id="phone" inputMode="tel" placeholder="803 123 4567" required className="h-full border-0 focus-visible:ring-0" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(NIGERIA_STATES_LGAS).map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>LGA</Label>
                <Select defaultValue={lgas[0]}>
                  <SelectTrigger className="h-11"><SelectValue placeholder="Select LGA" /></SelectTrigger>
                  <SelectContent>
                    {lgas.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pwd">Password</Label>
                <PasswordInput id="pwd" placeholder="At least 8 characters" required className="h-11" />
                <p className="text-[11px] text-muted-foreground">
                  Tap the eye icon to confirm what you typed.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pin">4-digit wallet PIN</Label>
                <PasswordInput id="pin" inputMode="numeric" maxLength={4} placeholder="••••" required className="h-11 tracking-[0.5em] font-mono text-center" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ref">Referral code (optional)</Label>
                <Input id="ref" placeholder="e.g. AGRO2026" className="h-11" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="nin">NIN (optional, verify later)</Label>
                <Input id="nin" inputMode="numeric" maxLength={11} placeholder="11-digit NIN" className="h-11 font-mono tracking-[0.18em]" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="bvn">BVN (optional, verify later)</Label>
                <Input id="bvn" inputMode="numeric" maxLength={11} placeholder="11-digit BVN" className="h-11 font-mono tracking-[0.18em]" />
              </div>
            </div>
            <div className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
              Your Membership ID will be auto-generated based on your state and LGA — for example
              <span className="ml-1 font-mono text-foreground">AGP-LA-IKE-000245</span>. NIN/BVN
              verification can be completed any time from{" "}
              <Link href="/verify" className="text-primary hover:underline">
                Identity & Security
              </Link>
              .
            </div>
            <Button type="submit" size="lg" disabled={busy} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {busy ? "Creating account..." : "Create my account"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </motion.div>
        <motion.aside
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl forest-gradient leaf-motif p-7 text-amber-50 sticky top-6"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80">Member benefits</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold">Why join Agrillion</h2>
          <ul className="mt-5 space-y-3 text-sm text-amber-100/85">
            {[
              "Earn Smart Units on every bill payment",
              "Spend rewards on real Nigerian agro-produce",
              "Follow Agrillion projects in real time",
              "Free membership — no fees, no minimums",
              "Unique Membership ID for life",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-amber-300 shrink-0" /> {b}
              </li>
            ))}
          </ul>
        </motion.aside>
      </div>
    </div>
  );
}

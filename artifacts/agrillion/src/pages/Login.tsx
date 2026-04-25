import { Link, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { ArrowRight, ShieldCheck } from "lucide-react";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export default function Login() {
  const [, setLocation] = useLocation();
  const [busy, setBusy] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setTimeout(() => setLocation("/dashboard"), 600);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col justify-center p-8 lg:p-16"
      >
        <Link href="/" className="inline-flex w-fit">
          <Logo size="md" />
        </Link>
        <div className="mt-12 max-w-sm">
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Welcome back.</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage your wallet, pay bills and check on your Agrillion projects.
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="ident">Membership ID or phone</Label>
              <Input
                id="ident"
                placeholder="AGP-LA-IKE-000245"
                defaultValue="AGP-LA-IKE-000245"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd">Password</Label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
              </div>
              <Input id="pwd" type="password" placeholder="••••••••" defaultValue="demo1234" className="h-11" required />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox defaultChecked /> Remember me
              </label>
              <span className="text-xs text-muted-foreground">Demo build</span>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={busy}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {busy ? "Signing in..." : "Sign in"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="mt-6 text-sm text-muted-foreground">
            New to Agrillion?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
      <div className="relative hidden lg:block forest-gradient leaf-motif">
        <div className="absolute inset-0 flex flex-col justify-between p-16">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80">A members' club</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-amber-50 leading-tight">
              "I never thought my airtime budget could buy me palm oil."
            </h2>
            <p className="mt-3 text-sm text-amber-100/70 max-w-md">— Adaeze, Lagos</p>
          </div>
          <Card className="bg-emerald-950/60 border-amber-300/20 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-amber-400/15 p-2 ring-1 ring-amber-300/30">
                    <ShieldCheck className="h-5 w-5 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-50">Bank-grade security</p>
                    <p className="text-xs text-amber-100/60">Wallet PIN required for transfers</p>
                  </div>
                </div>
                <img
                  src={`${BASE}/agrillion-logo.jpeg`}
                  alt="Agrillion"
                  className="h-10 w-10 rounded-lg ring-1 ring-amber-300/30"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

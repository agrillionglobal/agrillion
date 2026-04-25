import { Link, useLocation } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { PasswordInput } from "@/components/ui/password-input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { ArrowRight, Phone, Mail, ShieldCheck, KeyRound, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

type Mode = "phone" | "email";
type Step = "request" | "verify" | "reset" | "done";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<Mode>("phone");
  const [step, setStep] = useState<Step>("request");
  const [contact, setContact] = useState("");
  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setStep("verify");
      toast.success(
        mode === "phone" ? "Verification SMS sent" : "Verification email sent",
        {
          description:
            mode === "phone"
              ? `A 6-digit code was sent to +234 ${contact}.`
              : `Check ${contact} for your reset code.`,
        },
      );
    }, 700);
  };

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setStep("reset");
    }, 500);
  };

  const reset = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (pwd !== confirm) {
      toast.error("Passwords don't match");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setStep("done");
    }, 700);
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
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Account recovery</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">
            {step === "done" ? "All set." : "Recover your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === "request" &&
              "We'll send you a 6-digit verification code so you can reset your password and recover your Membership ID."}
            {step === "verify" && "Enter the 6-digit code we just sent you."}
            {step === "reset" && "Choose a new password for your Agrillion account."}
            {step === "done" && "Your password has been reset and your Membership ID has been re-sent."}
          </p>

          {step === "request" && (
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)} className="mt-6">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="phone" className="gap-2">
                  <Phone className="h-3.5 w-3.5" /> Phone
                </TabsTrigger>
                <TabsTrigger value="email" className="gap-2">
                  <Mail className="h-3.5 w-3.5" /> Email
                </TabsTrigger>
              </TabsList>
              <TabsContent value="phone" className="mt-4">
                <form onSubmit={sendCode} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Registered phone number</Label>
                    <div className="flex h-11 rounded-md border border-input bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring">
                      <span className="grid place-items-center px-3 text-sm font-medium text-muted-foreground border-r border-border">
                        +234
                      </span>
                      <Input
                        id="phone"
                        inputMode="tel"
                        placeholder="803 123 4567"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        required
                        className="h-full border-0 focus-visible:ring-0"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      We'll text you a one-time code. Standard SMS rates may apply.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={busy}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {busy ? "Sending..." : "Send SMS code"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="email" className="mt-4">
                <form onSubmit={sendCode} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Registered email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      required
                      className="h-11"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Check spam/promotions if you don't see it within 1 minute.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={busy}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {busy ? "Sending..." : "Send email code"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}

          {step === "verify" && (
            <form onSubmit={verify} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="code">6-digit code</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="••••••"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  required
                  className="h-12 text-center font-mono tracking-[0.6em] text-lg"
                />
                <p className="text-[11px] text-muted-foreground text-center">
                  Sent to {mode === "phone" ? `+234 ${contact}` : contact}
                </p>
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={busy}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {busy ? "Verifying..." : "Verify code"}
              </Button>
              <button
                type="button"
                onClick={() => setStep("request")}
                className="w-full text-xs text-muted-foreground hover:text-foreground"
              >
                Use a different {mode === "phone" ? "phone number" : "email"}
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={reset} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="newpwd">New password</Label>
                <PasswordInput
                  id="newpwd"
                  placeholder="At least 8 characters"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm new password</Label>
                <PasswordInput
                  id="confirm"
                  placeholder="Re-enter your new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={busy}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {busy ? "Saving..." : "Reset password"}
              </Button>
            </form>
          )}

          {step === "done" && (
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4 ring-1 ring-emerald-300/40">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Password reset successful.</p>
                  <p className="mt-1 text-muted-foreground">
                    Your Membership ID has also been{" "}
                    {mode === "phone" ? "texted to you" : "emailed to you"} as a reminder.
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => setLocation("/login")}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Continue to sign in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          <p className="mt-6 text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </motion.div>

      <div className="relative hidden lg:block forest-gradient leaf-motif">
        <div className="absolute inset-0 flex flex-col justify-between p-16">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-300/80">Recovery, the safe way</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-amber-50 leading-tight">
              Two channels. <span className="gold-text">One Membership ID.</span>
            </h2>
            <p className="mt-3 text-sm text-amber-100/70 max-w-md">
              Recover by phone or email — whichever you registered with. Your unique
              Agrillion Membership ID is restored to you the moment you verify.
            </p>
          </div>
          <Card className="bg-emerald-950/60 border-amber-300/20 backdrop-blur">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-400/15 p-2 ring-1 ring-amber-300/30">
                  <ShieldCheck className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-50">Encrypted end-to-end</p>
                  <p className="text-xs text-amber-100/60">Codes expire in 10 minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-400/15 p-2 ring-1 ring-amber-300/30">
                  <KeyRound className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-50">Wallet PIN unaffected</p>
                  <p className="text-xs text-amber-100/60">Your transfer PIN is never reset here</p>
                </div>
              </div>
              <img
                src={`${BASE}/agrillion-logo.jpeg`}
                alt="Agrillion"
                className="h-10 w-10 rounded-lg ring-1 ring-amber-300/30"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

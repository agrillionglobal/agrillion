import { Link } from "wouter";
import { motion } from "framer-motion";
import { PublicShell } from "@/components/PublicShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { useGetImpactMetrics, useListProjects } from "@workspace/api-client-react";
import { num } from "@/lib/format";
import {
  Wallet,
  Store,
  Sprout,
  ShieldCheck,
  ArrowRight,
  Phone,
  Tv,
  Wifi,
  Zap,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Quote,
} from "lucide-react";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

const SERVICES = [
  { icon: Phone, name: "Airtime", color: "from-amber-500/20 to-amber-500/5" },
  { icon: Wifi, name: "Data", color: "from-emerald-500/20 to-emerald-500/5" },
  { icon: Tv, name: "Cable TV", color: "from-sky-500/20 to-sky-500/5" },
  { icon: Zap, name: "Electricity", color: "from-orange-500/20 to-orange-500/5" },
  { icon: Wifi, name: "Internet", color: "from-indigo-500/20 to-indigo-500/5" },
];

export default function Landing() {
  const impact = useGetImpactMetrics();
  const projects = useListProjects();

  return (
    <PublicShell>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 forest-gradient opacity-95" />
        <div className="absolute inset-0 leaf-motif" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,hsl(150_45%_6%/.6)_100%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 ring-1 ring-amber-400/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-300">
              <Sparkles className="h-3 w-3" />
              Now serving Lagos · Abuja · Port Harcourt
            </div>
            <h1 className="mt-6 font-serif text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-amber-50 leading-[1.05]">
              Pay your bills.<br />
              <span className="gold-text">Earn Smart Units.</span><br />
              Grow Nigeria.
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg text-amber-100/80 leading-relaxed">
              Agrillion turns everyday airtime, data, cable, electricity and internet payments
              into rewards you can spend on Nigerian-grown food, farm inputs, and equipment —
              while helping fund real agro-projects across the country.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/register">
                <Button size="lg" className="gold-gradient text-primary-foreground hover:opacity-95 shadow-xl">
                  Become a member
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-300/30 bg-white/5 text-amber-50 hover:bg-white/10 backdrop-blur"
                >
                  Open dashboard demo
                </Button>
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { v: impact.data?.activeProjects ?? 4, l: "Active projects" },
                { v: impact.data?.farmersSupported ?? 7400, l: "Farmers supported" },
                { v: impact.data?.statesCovered ?? 5, l: "States covered" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-serif text-3xl md:text-4xl font-semibold text-amber-300">
                    {num(s.v)}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-amber-100/60">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* floating logo card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block absolute right-12 top-24 w-[340px]"
          >
            <div className="rounded-3xl bg-gradient-to-br from-amber-100/95 to-amber-50/90 p-1 shadow-2xl ring-1 ring-amber-300/40 rotate-2">
              <div className="rounded-[20px] bg-white p-6">
                <img
                  src={`${BASE}/agrillion-logo.jpeg`}
                  alt="Agrillion"
                  className="w-full rounded-xl object-cover aspect-square"
                />
                <div className="mt-4 text-center">
                  <p className="font-serif text-lg font-semibold text-emerald-950">Member-owned. Reward-driven.</p>
                  <p className="mt-1 text-xs text-emerald-900/60">Est. 2025 · Lagos</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -left-8 rounded-2xl bg-emerald-950/90 backdrop-blur p-4 ring-1 ring-amber-400/30 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-amber-400/20 p-2">
                  <TrendingUp className="h-4 w-4 text-amber-300" />
                </div>
                <div>
                  <p className="text-xs text-amber-100/70">You earned</p>
                  <p className="font-serif text-lg font-semibold text-amber-200">+60 SU</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 ivory-grain">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-primary">The Smart Units model</p>
            <h2 className="mt-2 font-serif text-3xl md:text-5xl font-semibold tracking-tight">
              A new kind of loyalty, built for Nigeria.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Every bill payment generates a small platform margin. We share a portion of that
              margin back to you as Smart Units — a non-monetary reward redeemable on the Mart.
              No locked-in capital, no monthly fees, no jargon.
            </p>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Pay everyday bills",
                description:
                  "Top up airtime, buy data, settle DStv, fund your prepaid meter or pay your home internet — all in seconds.",
                icon: Wallet,
              },
              {
                step: "02",
                title: "Earn Smart Units",
                description:
                  "Each transaction credits Smart Units to your wallet, calculated transparently from the platform margin.",
                icon: Sparkles,
              },
              {
                step: "03",
                title: "Spend on the Mart",
                description:
                  "Redeem Smart Units for Nigerian agro-produce, farm inputs and equipment — fully, partially, or alongside cash.",
                icon: Store,
              },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="relative overflow-hidden h-full bg-card hover:shadow-lg transition-shadow">
                    <CardContent className="p-7">
                      <p className="font-serif text-sm text-amber-600">{s.step}</p>
                      <div className="mt-3 inline-flex rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="mt-4 font-serif text-xl font-semibold">{s.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Smart module */}
      <section id="smart" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Smart</p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-semibold tracking-tight">
              Bill payments that pay you back.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Pay across all major Nigerian providers from one beautiful interface. Every
              transaction earns you Smart Units transparently — visible in your wallet within
              seconds.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                "MTN, Airtel, Glo, 9mobile",
                "DStv, GOtv, Startimes",
                "Eko, Ikeja, Abuja, PH Electric",
                "Spectranet, Smile, ipNX Fiber",
              ].map((p) => (
                <div key={p} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                  <span className="text-foreground/80">{p}</span>
                </div>
              ))}
            </div>
            <Link href="/smart">
              <Button className="mt-7 bg-primary text-primary-foreground hover:bg-primary/90">
                Explore Smart
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`rounded-2xl bg-gradient-to-br ${s.color} p-5 ring-1 ring-border ${i === 4 ? "col-span-2" : ""}`}
                  >
                    <Icon className="h-6 w-6 text-foreground/80" />
                    <p className="mt-3 font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">3-5% reward margin</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mart module */}
      <section id="mart" className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-12 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Ofada Rice", price: "₦12,500", units: "or 1,250 SU", grad: "from-emerald-700 to-emerald-900" },
                { name: "Palm Oil 5L", price: "₦18,500", units: "or 1,850 SU", grad: "from-amber-600 to-amber-800" },
                { name: "Free-Range Chicken", price: "₦85,000", units: "or 8,500 SU", grad: "from-rose-700 to-rose-900" },
                { name: "Mambilla Honey", price: "₦11,500", units: "or 1,150 SU", grad: "from-yellow-600 to-amber-700" },
              ].map((p) => (
                <div key={p.name} className="overflow-hidden rounded-2xl bg-background ring-1 ring-border shadow-sm hover:shadow-md transition-shadow">
                  <div className={`aspect-[4/3] bg-gradient-to-br ${p.grad} relative leaf-motif`}>
                    <div className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-emerald-950">
                      In stock
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium leading-tight">{p.name}</p>
                    <p className="mt-1 text-sm font-semibold">{p.price}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">{p.units}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Mart</p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl font-semibold tracking-tight">
              The Nigerian agro-marketplace.
            </h2>
            <p className="mt-4 text-muted-foreground">
              From Ofada rice and Mambilla honey to solar pumps and NPK fertiliser — sourced
              directly from cooperatives and Agrillion-backed projects. Pay with cash, Smart
              Units, or a satisfying split of both.
            </p>
            <Link href="/mart">
              <Button className="mt-7 bg-primary text-primary-foreground hover:bg-primary/90">
                Browse Mart
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Tech / projects */}
      <section id="tech" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Tech & Projects</p>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl font-semibold tracking-tight">
                Real progress, in real time.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Every Agrillion project is published with milestones, updates and impact data.
                Watch how rice mills, cassava plants and cold storage hubs are coming online
                across Nigeria.
              </p>
            </div>
            <Link href="/tech">
              <Button variant="outline">View all projects</Button>
            </Link>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(projects.data ?? []).slice(0, 3).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="aspect-[16/10] forest-gradient relative leaf-motif">
                    <div className="absolute inset-0 flex items-end p-5">
                      <div>
                        <p className="text-xs text-amber-300/80 uppercase tracking-wider">{p.category}</p>
                        <p className="mt-1 font-serif text-lg font-semibold text-amber-50">{p.name}</p>
                        <p className="text-xs text-amber-100/70">{p.location}</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 rounded-full bg-amber-400/90 px-2.5 py-1 text-[10px] font-semibold text-emerald-950 capitalize">
                      {p.status}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground line-clamp-2">{p.summary}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold">{p.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full gold-gradient"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="py-20 bg-card">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Built on transparency",
                body: "Every reward calculation, every project milestone — published and auditable.",
              },
              {
                icon: Sprout,
                title: "Backed by real assets",
                body: "Smart Units circulate within an ecosystem of working agro-plants and inventory.",
              },
              {
                icon: TrendingUp,
                title: "Fair value sharing",
                body: "60% of the platform margin from your bill payments returns to you as Smart Units.",
              },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex flex-col items-start">
                  <div className="rounded-xl bg-primary/10 p-3 ring-1 ring-primary/20">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
              From members across Nigeria
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Adaeze Okoye", loc: "Lagos · Premier member", q: "I pay my DStv and electricity here — and three months later I bought a year's supply of palm oil with the Smart Units I earned. It's such a beautiful thing." },
              { name: "Tunde Bakare", loc: "Abuja · Member", q: "The Mart prices are honest and the payment options are flexible. Splitting cash and Smart Units feels like a small superpower." },
              { name: "Ifeoma Eze", loc: "Port Harcourt · Partner", q: "What I love most is being able to follow the projects I help fund. The cold storage hub update last week was inspiring." },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full bg-card">
                  <CardContent className="p-6">
                    <Quote className="h-6 w-6 text-amber-500/50" />
                    <p className="mt-3 text-sm leading-relaxed text-foreground/85">{t.q}</p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="size-10 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 grid place-items-center text-amber-300 font-medium text-sm">
                        {t.name.split(" ").map((s) => s[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.loc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl forest-gradient leaf-motif p-10 md:p-16 text-center">
            <Logo size="xl" variant="mark" className="justify-center" />
            <h2 className="mt-6 font-serif text-3xl md:text-5xl font-semibold tracking-tight text-amber-50">
              Your bills can do <span className="gold-text">more.</span>
            </h2>
            <p className="mt-4 text-amber-100/75 max-w-xl mx-auto">
              Join the Agrillion membership free of charge. Pay your first bill, earn your first
              Smart Units, and spend them on real Nigerian-grown food.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/register">
                <Button size="lg" className="gold-gradient text-primary-foreground hover:opacity-95 shadow-xl">
                  Become a member
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-300/30 bg-white/5 text-amber-50 hover:bg-white/10"
                >
                  Try the dashboard demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

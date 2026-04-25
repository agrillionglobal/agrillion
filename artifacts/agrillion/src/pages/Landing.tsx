import { Link } from "wouter";
import { motion } from "framer-motion";
import { PublicShell } from "@/components/PublicShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { useGetImpactMetrics, useListProjects } from "@workspace/api-client-react";
import { num } from "@/lib/format";
import { EXTERNAL_SITES } from "@/lib/external-sites";
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
  ExternalLink,
  Leaf,
} from "lucide-react";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

const SERVICES = [
  { icon: Phone, name: "Airtime" },
  { icon: Wifi, name: "Data" },
  { icon: Tv, name: "Cable TV" },
  { icon: Zap, name: "Electricity" },
  { icon: Wifi, name: "Internet" },
];

export default function Landing() {
  const impact = useGetImpactMetrics();
  const projects = useListProjects();

  return (
    <PublicShell>
      {/* HERO ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 forest-gradient" />
        <div className="absolute inset-0 leaf-motif" />
        {/* large soft gold radial glow behind text */}
        <div
          className="absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(42 85% 50% / .35), transparent 65%)",
          }}
        />
        {/* faint emerald glow on right */}
        <div
          className="absolute -bottom-40 -right-40 h-[700px] w-[700px] rounded-full opacity-50 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, hsl(150 60% 30% / .35), transparent 65%)",
          }}
        />
        <div className="absolute inset-0 vignette" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pt-28 md:pb-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 ring-1 ring-amber-300/40 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-amber-200">
              <Sparkles className="h-3 w-3" />
              Now serving Lagos · Abuja · Port Harcourt
            </div>
            <h1 className="mt-6 font-serif text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-amber-50 leading-[1.02]">
              Pay your bills.
              <br />
              <span className="gold-shimmer-text italic">Earn Smart Units.</span>
              <br />
              Grow Nigeria.
            </h1>
            <p className="mt-7 max-w-xl text-base md:text-lg text-amber-100/75 leading-relaxed">
              Agrillion turns everyday airtime, data, cable, electricity and internet payments
              into rewards you can spend on Nigerian-grown food, farm inputs, and equipment —
              while helping fund real agro-projects across the country.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link href="/register">
                <Button
                  size="lg"
                  className="gold-gradient text-emerald-950 font-semibold hover:opacity-95 shadow-[0_20px_50px_-15px_hsl(42_85%_45%/0.6)] h-12 px-7"
                >
                  Become a member
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-300/40 bg-white/5 text-amber-50 hover:bg-white/10 backdrop-blur h-12 px-7"
                >
                  Open dashboard demo
                </Button>
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { v: impact.data?.activeProjects ?? 4, l: "Active projects" },
                { v: impact.data?.farmersSupported ?? 7400, l: "Farmers supported" },
                { v: impact.data?.statesCovered ?? 5, l: "States covered" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-serif text-3xl md:text-4xl font-semibold gold-text">
                    {num(s.v)}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-amber-100/55">
                    {s.l}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Floating logo card — gold framed, with halo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -1.5 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="hidden lg:block absolute right-12 top-20 w-[360px]"
          >
            {/* gold glow halo */}
            <div className="absolute -inset-10 rounded-[40px] gold-glow opacity-80" />
            {/* gold gradient frame */}
            <div className="relative rounded-[28px] gold-gradient p-[2px] gold-ring-strong rotate-2">
              <div className="rounded-[26px] bg-emerald-950 p-3">
                <img
                  src={`${BASE}/agrillion-logo.jpeg`}
                  alt="Agrillion"
                  className="w-full rounded-[20px] object-cover aspect-square"
                />
                <div className="mt-4 mb-2 text-center">
                  <p className="font-serif text-lg font-semibold gold-text">
                    Member-owned. Reward-driven.
                  </p>
                  <div className="ornament-divider mt-3 mx-6 text-[10px]">
                    <Leaf className="h-3 w-3" />
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-amber-100/60">
                    Est. 2025 · Lagos
                  </p>
                </div>
              </div>
            </div>
            {/* SU floating chip */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-6 -left-10 rounded-2xl bg-emerald-950/90 backdrop-blur p-4 ring-1 ring-amber-400/40 shadow-[0_18px_50px_-10px_hsl(42_85%_30%/0.6)]"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full gold-gradient p-2">
                  <TrendingUp className="h-4 w-4 text-emerald-950" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-amber-100/60">
                    You earned
                  </p>
                  <p className="font-serif text-lg font-semibold gold-text">+60 SU</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* gold ornament divider at bottom */}
        <div className="relative mx-auto max-w-5xl px-6 pb-6">
          <div className="ornament-divider text-amber-300/70">
            <Leaf className="h-4 w-4" />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS ─────────────────────────────────────────────── */}
      <section id="how" className="relative py-24 forest-grain">
        <div className="absolute inset-0 leaf-motif opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] text-amber-300">
              The Smart Units model
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-semibold tracking-tight text-amber-50">
              A new kind of <span className="gold-text italic">loyalty</span>,
              <br className="hidden md:block" /> built for Nigeria.
            </h2>
            <div className="ornament-divider mt-6 max-w-sm mx-auto">
              <Leaf className="h-3 w-3" />
            </div>
            <p className="mt-6 text-amber-100/70 leading-relaxed">
              Every bill payment generates a small platform margin. We share a portion of that
              margin back to you as Smart Units — a non-monetary reward redeemable on the
              Agrillion Mart. No locked-in capital, no monthly fees, no jargon.
            </p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
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
                title: "Spend on Agrillion Mart",
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
                  className="premium-card p-7 transition-all"
                >
                  <p className="font-serif text-sm gold-text">{s.step}</p>
                  <div className="mt-4 inline-flex rounded-xl gold-gradient p-3 shadow-[0_10px_30px_-10px_hsl(42_85%_40%/0.6)]">
                    <Icon className="h-5 w-5 text-emerald-950" />
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-amber-50">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-amber-100/65 leading-relaxed">
                    {s.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SMART MODULE ─────────────────────────────────────────────── */}
      <section id="smart" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 forest-gradient opacity-60" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-14 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] uppercase tracking-[0.24em] text-amber-300">Smart</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-semibold tracking-tight text-amber-50">
              Bill payments that <span className="gold-text italic">pay you back.</span>
            </h2>
            <p className="mt-5 text-amber-100/70 leading-relaxed">
              Pay across all major Nigerian providers from one beautiful interface. Every
              transaction earns you Smart Units transparently — visible in your wallet within
              seconds.
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              {[
                "MTN, Airtel, Glo, 9mobile",
                "DStv, GOtv, Startimes",
                "Eko, Ikeja, Abuja, PH Electric",
                "Spectranet, Smile, ipNX Fiber",
              ].map((p) => (
                <div key={p} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-amber-300 shrink-0" />
                  <span className="text-amber-100/85">{p}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/smart">
                <Button className="gold-gradient text-emerald-950 font-semibold hover:opacity-95 shadow-lg">
                  Open Smart Wallet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href={EXTERNAL_SITES.smart.url} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="border-amber-300/40 bg-white/5 text-amber-50 hover:bg-white/10"
                >
                  Explore Smart
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
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
                    className={`premium-card p-5 hover-elevate ${i === 4 ? "col-span-2" : ""}`}
                  >
                    <div className="inline-flex rounded-lg bg-amber-400/10 ring-1 ring-amber-300/30 p-2.5">
                      <Icon className="h-5 w-5 text-amber-300" />
                    </div>
                    <p className="mt-4 font-serif font-semibold text-amber-50">{s.name}</p>
                    <p className="text-xs text-amber-100/55 mt-0.5">1–3% reward margin</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* MART MODULE ──────────────────────────────────────────────── */}
      <section id="mart" className="relative py-24 forest-grain">
        <div className="absolute inset-0 leaf-motif opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-14 md:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  name: "Ofada Rice",
                  price: "₦12,500",
                  units: "or 1,250 SU",
                  grad: "from-emerald-700 to-emerald-950",
                },
                {
                  name: "Palm Oil 5L",
                  price: "₦18,500",
                  units: "or 1,850 SU",
                  grad: "from-amber-600 to-amber-900",
                },
                {
                  name: "Free-Range Chicken",
                  price: "₦85,000",
                  units: "or 8,500 SU",
                  grad: "from-rose-800 to-rose-950",
                },
                {
                  name: "Mambilla Honey",
                  price: "₦11,500",
                  units: "or 1,150 SU",
                  grad: "from-yellow-600 to-amber-800",
                },
              ].map((p) => (
                <div
                  key={p.name}
                  className="overflow-hidden rounded-2xl premium-card hover-elevate"
                >
                  <div
                    className={`aspect-[4/3] bg-gradient-to-br ${p.grad} relative leaf-motif`}
                  >
                    <div className="absolute bottom-2 left-2 rounded-full gold-gradient px-2.5 py-0.5 text-[10px] font-semibold text-emerald-950">
                      In stock
                    </div>
                  </div>
                  <div className="p-3.5">
                    <p className="text-sm font-serif font-medium text-amber-50 leading-tight">
                      {p.name}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-amber-50">{p.price}</p>
                    <p className="text-xs gold-text font-medium">{p.units}</p>
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
            <p className="text-[11px] uppercase tracking-[0.24em] text-amber-300">
              Agrillion Mart
            </p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-semibold tracking-tight text-amber-50">
              The Nigerian <span className="gold-text italic">agro-marketplace.</span>
            </h2>
            <p className="mt-5 text-amber-100/70 leading-relaxed">
              From Ofada rice and Mambilla honey to solar pumps and NPK fertiliser — sourced
              directly from cooperatives and Agrillion-backed projects. Pay with cash, Smart
              Units, or a satisfying split of both.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/mart">
                <Button className="gold-gradient text-emerald-950 font-semibold hover:opacity-95 shadow-lg">
                  Open Agrillion Mart
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href={EXTERNAL_SITES.mart.url} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="border-amber-300/40 bg-white/5 text-amber-50 hover:bg-white/10"
                >
                  Explore Agrillion Mart
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TECH / PROJECTS ──────────────────────────────────────────── */}
      <section id="tech" className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 forest-gradient opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.24em] text-amber-300">
                Tech & Projects
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-5xl font-semibold tracking-tight text-amber-50">
                Real progress, <span className="gold-text italic">in real time.</span>
              </h2>
              <p className="mt-5 text-amber-100/70 leading-relaxed">
                Every Agrillion project is published with milestones, updates and impact data.
                Watch how rice mills, cassava plants and cold storage hubs are coming online
                across Nigeria.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/tech">
                <Button
                  variant="outline"
                  className="border-amber-300/40 bg-white/5 text-amber-50 hover:bg-white/10"
                >
                  View all projects
                </Button>
              </Link>
              <a href={EXTERNAL_SITES.tech.url} target="_blank" rel="noopener noreferrer">
                <Button className="gold-gradient text-emerald-950 font-semibold hover:opacity-95 shadow-lg">
                  Explore Tech
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {(projects.data ?? []).slice(0, 3).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="overflow-hidden h-full premium-card hover-elevate">
                  <div className="aspect-[16/10] forest-gradient relative leaf-motif">
                    <div className="absolute inset-0 flex items-end p-5">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-amber-300">
                          {p.category}
                        </p>
                        <p className="mt-1 font-serif text-lg font-semibold text-amber-50">
                          {p.name}
                        </p>
                        <p className="text-xs text-amber-100/70">{p.location}</p>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 rounded-full gold-gradient px-2.5 py-1 text-[10px] font-semibold text-emerald-950 capitalize">
                      {p.status}
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-amber-100/65 line-clamp-2">{p.summary}</p>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-100/55">Progress</span>
                        <span className="font-semibold gold-text">{p.progress}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-emerald-950/60 ring-1 ring-amber-300/15">
                        <div
                          className="h-full gold-gradient"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP ──────────────────────────────────────────────── */}
      <section className="relative py-24 forest-grain">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="ornament-divider mb-12 max-w-md mx-auto">
            <Leaf className="h-4 w-4" />
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: ShieldCheck,
                title: "Built on transparency",
                body:
                  "Every reward calculation, every project milestone — published and auditable.",
              },
              {
                icon: Sprout,
                title: "Backed by real assets",
                body:
                  "Smart Units circulate within an ecosystem of working agro-plants and inventory.",
              },
              {
                icon: TrendingUp,
                title: "Fair value sharing",
                body:
                  "60% of the platform margin from your bill payments returns to you as Smart Units.",
              },
            ].map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex flex-col items-start">
                  <div className="rounded-xl gold-gradient p-3 shadow-[0_12px_30px_-10px_hsl(42_85%_40%/0.5)]">
                    <Icon className="h-5 w-5 text-emerald-950" />
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-semibold text-amber-50">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm text-amber-100/65">{b.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 forest-gradient opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] text-amber-300">Members</p>
            <h2 className="mt-3 font-serif text-3xl md:text-5xl font-semibold tracking-tight text-amber-50">
              From members <span className="gold-text italic">across Nigeria</span>
            </h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Adaeze Okoye",
                loc: "Lagos · Premier member",
                q:
                  "I pay my DStv and electricity here — and three months later I bought a year's supply of palm oil with the Smart Units I earned. It's such a beautiful thing.",
              },
              {
                name: "Tunde Bakare",
                loc: "Abuja · Member",
                q:
                  "The Agrillion Mart prices are honest and the payment options are flexible. Splitting cash and Smart Units feels like a small superpower.",
              },
              {
                name: "Ifeoma Eze",
                loc: "Port Harcourt · Partner",
                q:
                  "What I love most is being able to follow the projects I help fund. The cold storage hub update last week was inspiring.",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="h-full premium-card p-6">
                  <Quote className="h-6 w-6 text-amber-300/60" />
                  <p className="mt-3 text-sm leading-relaxed text-amber-100/85 italic font-serif">
                    "{t.q}"
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="size-10 rounded-full gold-gradient grid place-items-center text-emerald-950 font-serif font-semibold text-sm">
                      {t.name.split(" ").map((s) => s[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-amber-50">{t.name}</p>
                      <p className="text-xs text-amber-100/55">{t.loc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[32px] forest-gradient leaf-motif p-10 md:p-16 text-center gold-ring-strong">
            <div
              className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full opacity-40 blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, hsl(42 85% 50% / .5), transparent 65%)",
              }}
            />
            <div className="relative">
              <Logo size="xl" variant="mark" className="justify-center" />
              <div className="ornament-divider mt-6 max-w-xs mx-auto">
                <Leaf className="h-4 w-4" />
              </div>
              <h2 className="mt-6 font-serif text-3xl md:text-5xl font-semibold tracking-tight text-amber-50">
                Your bills can do <span className="gold-shimmer-text italic">more.</span>
              </h2>
              <p className="mt-5 text-amber-100/75 max-w-xl mx-auto">
                Join the Agrillion membership free of charge. Pay your first bill, earn your
                first Smart Units, and spend them on real Nigerian-grown food.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="gold-gradient text-emerald-950 font-semibold hover:opacity-95 shadow-[0_20px_50px_-15px_hsl(42_85%_40%/0.7)] h-12 px-8"
                  >
                    Become a member
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-amber-300/40 bg-white/5 text-amber-50 hover:bg-white/10 h-12 px-8"
                  >
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

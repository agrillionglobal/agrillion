import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

const SLIDES = [
  {
    src: `${BASE}/hero-1-payments.png`,
    label: "Pay everyday bills",
  },
  {
    src: `${BASE}/hero-2-mart.png`,
    label: "Shop the agro-marketplace",
  },
  {
    src: `${BASE}/hero-3-projects.png`,
    label: "Track real Agrillion projects",
  },
  {
    src: `${BASE}/hero-4-farmer.png`,
    label: "Grow Nigerian agriculture",
  },
];

export function HeroSlider() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* Full-bleed slider images */}
      <div className="absolute inset-0 overflow-hidden">
        <AnimatePresence mode="sync">
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.0 }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 7, ease: "linear" } }}
            className="absolute inset-0"
          >
            <img
              src={SLIDES[i].src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dark gradient overlays for legibility + brand tint */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 via-emerald-950/75 to-emerald-950/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/60 via-transparent to-emerald-950/85" />
      <div
        className="absolute inset-0 mix-blend-color opacity-60"
        style={{ background: "linear-gradient(135deg, hsl(150 60% 12%), hsl(42 70% 30%))" }}
      />
      <div className="absolute inset-0 vignette" />

      {/* Slider indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
        {SLIDES.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={s.label}
            className="group flex items-center gap-2"
          >
            <span
              className={`block h-[3px] rounded-full transition-all duration-500 ${
                idx === i ? "w-12 bg-amber-300" : "w-6 bg-amber-100/30 group-hover:bg-amber-200/50"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Active slide label */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={SLIDES[i].label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5 }}
            className="text-[11px] uppercase tracking-[0.3em] text-amber-200/80"
          >
            {SLIDES[i].label}
          </motion.p>
        </AnimatePresence>
      </div>
    </>
  );
}

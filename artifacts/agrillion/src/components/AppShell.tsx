import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Ambient gold/forest glows */}
      <div
        className="pointer-events-none fixed -top-40 -left-40 h-[640px] w-[640px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(42 85% 50% / .35), transparent 65%)" }}
      />
      <div
        className="pointer-events-none fixed -bottom-40 -right-40 h-[700px] w-[700px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(150 60% 28% / .30), transparent 65%)" }}
      />
      <div className="absolute inset-0 leaf-motif pointer-events-none opacity-50" />

      <Topbar />
      <main className="relative flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
      <footer className="relative border-t border-amber-300/15 py-6 mt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-amber-100/55">
          <span>© {new Date().getFullYear()} Agrillion. Powering rewards-backed everyday spending.</span>
          <span>Made in Lagos · Smart Units are non-monetary platform rewards.</span>
        </div>
      </footer>
    </div>
  );
}

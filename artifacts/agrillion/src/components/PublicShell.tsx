import { Link } from "wouter";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#smart" className="hover:text-foreground">Smart</a>
            <a href="#mart" className="hover:text-foreground">Agrillion Mart</a>
            <a href="#tech" className="hover:text-foreground">Tech</a>
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">Become a member</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-12 border-t border-border/60 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo size="md" />
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Agrillion is a Nigerian rewards-and-utility platform that turns everyday bill
              payments into Smart Units redeemable across Agrillion Mart and our project
              ecosystem. Pay. Earn. Grow Nigeria.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Platform</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/smart" className="hover:underline">Smart Wallet</Link></li>
              <li><Link href="/mart" className="hover:underline">Agrillion Mart</Link></li>
              <li><Link href="/tech" className="hover:underline">Tech & Projects</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Members</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/login" className="hover:underline">Sign in</Link></li>
              <li><Link href="/register" className="hover:underline">Create account</Link></li>
              <li><Link href="/forgot-password" className="hover:underline">Forgot password</Link></li>
              <li><Link href="/dashboard" className="hover:underline">My dashboard</Link></li>
              <li><Link href="/verify" className="hover:underline">Identity & security</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60 py-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-xs text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-2">
            <span>© {new Date().getFullYear()} Agrillion Limited · Lagos, Nigeria</span>
            <span>Smart Units are platform rewards and do not constitute a financial security.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

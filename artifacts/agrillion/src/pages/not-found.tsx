import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-background px-6">
      <div className="text-center max-w-md">
        <Logo size="lg" className="justify-center" />
        <p className="mt-10 text-xs uppercase tracking-[0.2em] text-primary">404 — Not found</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">
          We couldn't find that page.
        </h1>
        <p className="mt-3 text-muted-foreground">
          The link may have moved, or the page is no longer available.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Link href="/">
            <Button variant="outline">Go home</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Open dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

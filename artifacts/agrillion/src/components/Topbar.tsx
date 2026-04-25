import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Wallet,
  Store,
  Sprout,
  Shield,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetMyMember, useListNotifications } from "@workspace/api-client-react";
import { initials, relativeDate } from "@/lib/format";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/smart", label: "Smart", icon: Wallet },
  { to: "/mart", label: "Agrillion Mart", icon: Store },
  { to: "/tech", label: "Tech", icon: Sprout },
  { to: "/verify", label: "Verify", icon: ShieldCheck },
  { to: "/admin", label: "Admin", icon: Shield },
];

export function Topbar() {
  const [location, setLocation] = useLocation();
  const [open, setOpen] = useState(false);
  const member = useGetMyMember();
  const notifs = useListNotifications();
  const unread = notifs.data?.filter((n) => !n.read).length ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/dashboard" className="flex items-center">
          <Logo size="sm" />
        </Link>

        <nav className="ml-6 hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = location === item.to || location.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary/10 text-primary dark:bg-primary/15 dark:text-amber-300"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-amber-950">
                    {unread}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifs.data && notifs.data.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                  {notifs.data.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className="flex flex-col gap-1 px-3 py-2.5 hover:bg-muted/60"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">{n.title}</p>
                        {!n.read && (
                          <span className="mt-1 size-1.5 shrink-0 rounded-full bg-amber-500" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-snug">{n.body}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                        {relativeDate(n.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No notifications yet.
                </p>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="hidden md:inline-flex h-10 items-center gap-2 px-2"
              >
                <Avatar className="h-8 w-8 ring-1 ring-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                    {member.data ? initials(member.data.fullName) : "AG"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium">
                    {member.data?.fullName.split(" ")[0] ?? "Member"}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono tracking-wider">
                    {member.data?.membershipId ?? ""}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{member.data?.fullName}</span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {member.data?.tier} member
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/dashboard")}>
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/smart")}>
                Smart Wallet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/verify")}>
                Identity & Security
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/admin")}>
                Admin Console
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/login")}>
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="border-b border-border p-4">
                <Logo />
              </div>
              <div className="flex flex-col gap-1 p-3">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const active = location === item.to;
                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
              <div className="border-t border-border p-4">
                {member.data && (
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 ring-1 ring-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {initials(member.data.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <p className="text-sm font-medium">{member.data.fullName}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">
                        {member.data.membershipId}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/20",
  processing: "bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-sky-500/20",
  shipped: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-indigo-500/20",
  delivered: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-500/20",
  failed: "bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-500/20",
  active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
  milestone: "bg-amber-500/10 text-amber-800 dark:text-amber-300 ring-amber-500/20",
  planning: "bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-sky-500/20",
  completed: "bg-primary/10 text-primary dark:text-amber-300 ring-primary/20",
  premier: "bg-amber-500/10 text-amber-800 dark:text-amber-300 ring-amber-500/20",
  partner: "bg-primary/10 text-primary dark:text-amber-300 ring-primary/20",
  member: "bg-muted text-muted-foreground ring-border",
  default: "bg-muted text-muted-foreground ring-border",
};

export function StatusPill({
  status,
  className,
  children,
}: {
  status: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const tone = TONES[status] ?? TONES.default;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize",
        tone,
        className,
      )}
    >
      <span className="inline-block size-1.5 rounded-full bg-current opacity-70" />
      {children ?? status.replace(/_/g, " ")}
    </span>
  );
}

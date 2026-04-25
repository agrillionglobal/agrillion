import { type LucideIcon, Leaf } from "lucide-react";

export function EmptyState({
  icon: Icon = Leaf,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12 rounded-2xl border border-dashed border-border bg-card/40">
      <div className="rounded-2xl bg-primary/10 p-4 ring-1 ring-primary/20">
        <Icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-base font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

import { cn } from "@/lib/utils";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

export function Logo({
  size = "md",
  variant = "horizontal",
  className,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "horizontal" | "mark";
  className?: string;
}) {
  const px = size === "xl" ? 64 : size === "lg" ? 48 : size === "md" ? 36 : 28;
  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div
        className="relative shrink-0 overflow-hidden rounded-xl ring-1 ring-black/5 shadow-sm"
        style={{ width: px, height: px }}
      >
        <img
          src={`${BASE}/agrillion-logo.jpeg`}
          alt="Agrillion"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
      {variant === "horizontal" && (
        <div className="flex flex-col leading-none">
          <span
            className="font-serif font-semibold tracking-tight text-foreground"
            style={{ fontSize: size === "xl" ? 28 : size === "lg" ? 22 : 18 }}
          >
            Agrillion
          </span>
          {size !== "sm" && (
            <span className="mt-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Pay · Earn · Grow
            </span>
          )}
        </div>
      )}
    </div>
  );
}

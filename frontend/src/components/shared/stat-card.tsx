import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  variant?: "default" | "success" | "error";
  /** lucide icon element, rendered in a gold chip */
  icon?: React.ReactNode;
  /** oversize the figure for a focal "hero" stat */
  emphasis?: boolean;
}

export function StatCard({
  label,
  value,
  subtext,
  variant = "default",
  icon,
  emphasis = false,
}: StatCardProps) {
  return (
    <Card className="vault-card group h-full overflow-hidden">
      <CardContent className="flex h-full flex-col gap-3 px-5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </span>
          {icon && (
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gold/12 text-gold ring-1 ring-gold/20 [&_svg]:size-4">
              {icon}
            </span>
          )}
        </div>
        <p
          className={cn(
            "tnum font-display font-semibold leading-none tracking-tight",
            emphasis ? "text-4xl sm:text-5xl" : "text-2xl",
            variant === "default" && emphasis && "text-treasure",
            variant === "success" && "text-gain",
            variant === "error" && "text-loss"
          )}
        >
          {value}
        </p>
        {subtext && (
          <p className="text-xs text-muted-foreground">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}

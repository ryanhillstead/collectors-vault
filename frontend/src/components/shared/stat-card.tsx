import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  variant?: "default" | "success" | "error";
}

export function StatCard({ label, value, subtext, variant = "default" }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-2xl font-bold",
            variant === "success" && "text-green-600",
            variant === "error" && "text-red-600"
          )}
        >
          {value}
        </p>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </CardContent>
    </Card>
  );
}

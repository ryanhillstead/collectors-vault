import { Badge } from "@/components/ui/badge";
import { Condition, conditionLabels } from "@/lib/types";

export function ConditionBadge({ condition }: { condition: Condition }) {
  return <Badge variant="outline">{conditionLabels[condition]}</Badge>;
}

import { z } from "zod";

export const itemFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["video-game", "console", "trading-card", "movie"], {
    message: "Category is required",
  }),
  purchasePrice: z
    .string()
    .min(1, "Purchase price is required")
    .regex(/^\d+(\.\d{0,2})?$/, "Enter a valid dollar amount"),
  currentValue: z
    .string()
    .min(1, "Current value is required")
    .regex(/^\d+(\.\d{0,2})?$/, "Enter a valid dollar amount"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  condition: z.enum(["mint", "near-mint", "excellent", "good", "fair", "poor"], {
    message: "Condition is required",
  }),
  imageUrl: z.string().url("Enter a valid URL").or(z.literal("")),
  notes: z.string(),
});

export type ItemFormValues = z.infer<typeof itemFormSchema>;

export function dollarsToCents(dollars: string): number {
  return Math.round(parseFloat(dollars) * 100);
}

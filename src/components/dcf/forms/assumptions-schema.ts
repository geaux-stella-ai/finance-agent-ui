import { z } from "zod";

export const dcfAssumptionsSchema = z.object({
  // Normalized Tax Rate
  normalizedTaxRate: z
    .number()
    .min(0, "Tax rate must be positive")
    .max(100, "Tax rate cannot exceed 100%")
    .optional(),

  // Normalized Net Working Capital
  normalizedNetWorkingCapital: z
    .number()
    .min(-50, "Working capital assumption seems extreme")
    .max(50, "Working capital assumption seems extreme")
    .optional(),

  // Exit Revenue Multiple
  exitRevenueMultiple: z
    .number()
    .min(0, "Exit revenue multiple must be positive")
    .max(20, "Exit revenue multiple seems unreasonably high")
    .optional(),

  // Discount Rate
  discountRate: z
    .number()
    .min(0, "Discount rate must be positive")
    .max(50, "Discount rate seems unreasonably high")
    .optional(),
});

export type DCFAssumptions = z.infer<typeof dcfAssumptionsSchema>;

export const defaultAssumptions: Partial<DCFAssumptions> = {
  normalizedTaxRate: 25,
  normalizedNetWorkingCapital: 2,
  exitRevenueMultiple: 8,
  discountRate: 10,
};
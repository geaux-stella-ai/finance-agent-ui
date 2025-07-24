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

  // Valuation Date
  valuationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((date) => {
      const parsed = new Date(date);
      const minDate = new Date('1900-01-01');
      const maxDate = new Date('2100-12-31');
      return parsed >= minDate && parsed <= maxDate;
    }, "Date must be between 1900 and 2100")
    .optional(),

  // Terminal Value Model Selection
  terminalValueModel: z
    .enum(["gordon-growth", "h-model", "exit-revenue-multiple", "ebitda-multiple"])
    .optional(),

  // Gordon Growth Model
  terminalGrowthRate: z
    .number()
    .optional(),

  // H-Model
  terminalGrowthRateH: z
    .number()
    .optional(),

  halfLifePeriod: z
    .number()
    .optional(),

  // Revenue Multiple
  revenueMultiple: z
    .number()
    .optional(),

  revenueMarketComparables: z
    .string()
    .optional(),

  // EBITDA Multiple
  ebitdaMultiple: z
    .number()
    .optional(),

  ebitdaMarketComparables: z
    .string()
    .optional(),
});

export type DCFAssumptions = z.infer<typeof dcfAssumptionsSchema>;

export const defaultAssumptions: Partial<DCFAssumptions> = {
  normalizedTaxRate: 25,
  normalizedNetWorkingCapital: 2,
  exitRevenueMultiple: 8,
  discountRate: 10,
  terminalValueModel: "gordon-growth",
  terminalGrowthRate: 2.5,
  valuationDate: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
};

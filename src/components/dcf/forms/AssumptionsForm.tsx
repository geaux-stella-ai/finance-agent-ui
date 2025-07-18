"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { NumberInput } from "./inputs/NumberInput";
import { PercentageInput } from "./inputs/PercentageInput";
import {
  dcfAssumptionsSchema,
  DCFAssumptions,
  defaultAssumptions,
} from "./assumptions-schema";

const getErrorMessage = (error: any): string | undefined => {
  if (typeof error === "object" && error?.message) {
    return error.message;
  }
  return undefined;
};

interface AssumptionsFormProps {
  onSubmit: (data: DCFAssumptions) => void;
  initialData?: Partial<DCFAssumptions>;
  isLoading?: boolean;
}

export function AssumptionsForm({
  onSubmit,
  initialData,
  isLoading = false,
}: AssumptionsFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<DCFAssumptions>({
    resolver: zodResolver(dcfAssumptionsSchema),
    defaultValues: { ...defaultAssumptions, ...initialData },
    mode: "onChange",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Simplified DCF Assumptions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          DCF Key Assumptions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="normalizedTaxRate"
            control={control}
            render={({ field }) => (
              <PercentageInput
                {...field}
                label="Normalized Tax Rate"
                max={100}
                error={getErrorMessage(errors.normalizedTaxRate)}
              />
            )}
          />
          <Controller
            name="normalizedNetWorkingCapital"
            control={control}
            render={({ field }) => (
              <PercentageInput
                {...field}
                label="Normalized Net Working Capital (% of Revenue)"
                min={-50}
                max={50}
                allowNegative
                error={getErrorMessage(errors.normalizedNetWorkingCapital)}
              />
            )}
          />
          <Controller
            name="exitRevenueMultiple"
            control={control}
            render={({ field }) => (
              <NumberInput
                {...field}
                label="Exit Revenue Multiple"
                decimalScale={1}
                suffix="x"
                max={20}
                error={getErrorMessage(errors.exitRevenueMultiple)}
              />
            )}
          />
          <Controller
            name="discountRate"
            control={control}
            render={({ field }) => (
              <PercentageInput
                {...field}
                label="Discount Rate (WACC)"
                max={50}
                error={getErrorMessage(errors.discountRate)}
              />
            )}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset(defaultAssumptions)}
          disabled={isLoading}
        >
          Reset to Defaults
        </Button>
        <Button type="submit"
          variant="outline"
          disabled={!isValid || isLoading}>
          {isLoading ? "Calculating..." : "Calculate DCF"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { NumberInput } from "./inputs/NumberInput";
import { PercentageInput } from "./inputs/PercentageInput";
import { useWorkspaceParams } from "@/hooks/useWorkspaceParams";
import { parameterAPI } from "@/lib/api/parameters";
import { useToast } from "@/components/ui/use-toast";
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
  const { tenantId, projectId } = useWorkspaceParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingParams, setIsLoadingParams] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
  } = useForm<DCFAssumptions>({
    resolver: zodResolver(dcfAssumptionsSchema),
    defaultValues: { ...defaultAssumptions, ...initialData },
    mode: "onChange",
  });

  // Load saved parameters from backend
  useEffect(() => {
    if (tenantId && projectId) {
      loadSavedParameters();
    }
  }, [tenantId, projectId]);

  const loadSavedParameters = async () => {
    if (!tenantId || !projectId) return;

    setIsLoadingParams(true);
    try {
      const savedParams = await parameterAPI.loadParametersForForm(tenantId, projectId);

      // Merge saved parameters with defaults and initial data
      const mergedData = { ...defaultAssumptions, ...initialData, ...savedParams };
      reset(mergedData);

      if (Object.keys(savedParams).length > 0) {
        toast({
          title: "Success",
          description: "Loaded saved parameters",
        });
      }
    } catch (error: any) {
      console.error("Failed to load parameters:", error);
      // Don't show error toast for 404 (no parameters saved yet)
      if (error.response?.status !== 404) {
        toast({
          title: "Error",
          description: "Failed to load saved parameters",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoadingParams(false);
    }
  };

  const saveParameters = async () => {
    if (!tenantId || !projectId) {
      toast({
        title: "Error",
        description: "Missing project information",
        variant: "destructive",
      });
      return;
    }

    const formData = watch();
    setIsSaving(true);

    try {
      // Convert form data to parameter format
      const parametersToSave: Record<string, { value: number; dataType: 'decimal' | 'percentage' }> = {};

      if (formData.normalizedTaxRate !== undefined) {
        parametersToSave.normalizedTaxRate = {
          value: formData.normalizedTaxRate / 100, // Convert percentage to decimal
          dataType: 'percentage'
        };
      }

      if (formData.normalizedNetWorkingCapital !== undefined) {
        parametersToSave.normalizedNetWorkingCapital = {
          value: formData.normalizedNetWorkingCapital,
          dataType: 'decimal'
        };
      }

      if (formData.exitRevenueMultiple !== undefined) {
        parametersToSave.exitRevenueMultiple = {
          value: formData.exitRevenueMultiple,
          dataType: 'decimal'
        };
      }

      if (formData.discountRate !== undefined) {
        parametersToSave.discountRate = {
          value: formData.discountRate / 100, // Convert percentage to decimal
          dataType: 'percentage'
        };
      }

      await parameterAPI.saveParameters(tenantId, projectId, parametersToSave);

      // Reset dirty state since we've saved
      reset(formData);

      toast({
        title: "Success",
        description: "Parameters saved successfully",
      });
    } catch (error) {
      console.error("Failed to save parameters:", error);
      toast({
        title: "Error",
        description: "Failed to save parameters",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Loading indicator */}
      {isLoadingParams && (
        <div className="text-sm text-muted-foreground">Loading saved parameters...</div>
      )}

      {/* Simplified DCF Assumptions */}
      <div className="space-y-4">
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
                disabled={isLoadingParams}
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
                disabled={isLoadingParams}
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
                disabled={isLoadingParams}
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
                disabled={isLoadingParams}
              />
            )}
          />
        </div>
      </div>
    </form>
  );
}

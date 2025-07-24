"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { NumberInput } from "./inputs/NumberInput";
import { PercentageInput } from "./inputs/PercentageInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
      const parametersToSave: Record<string, { value: number | string; dataType: 'decimal' | 'percentage' | 'text' | 'date' }> = {};

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

      // Terminal Value parameters
      if (formData.terminalValueModel !== undefined) {
        parametersToSave.terminalValueModel = {
          value: formData.terminalValueModel,
          dataType: 'text'
        };
      }

      if (formData.terminalGrowthRate !== undefined) {
        parametersToSave.terminalGrowthRate = {
          value: formData.terminalGrowthRate / 100, // Convert percentage to decimal
          dataType: 'percentage'
        };
      }

      if (formData.terminalGrowthRateH !== undefined) {
        parametersToSave.terminalGrowthRateH = {
          value: formData.terminalGrowthRateH / 100, // Convert percentage to decimal
          dataType: 'percentage'
        };
      }

      if (formData.halfLifePeriod !== undefined) {
        parametersToSave.halfLifePeriod = {
          value: formData.halfLifePeriod,
          dataType: 'decimal'
        };
      }

      if (formData.revenueMultiple !== undefined) {
        parametersToSave.revenueMultiple = {
          value: formData.revenueMultiple,
          dataType: 'decimal'
        };
      }

      if (formData.revenueMarketComparables !== undefined) {
        parametersToSave.revenueMarketComparables = {
          value: formData.revenueMarketComparables,
          dataType: 'text'
        };
      }

      if (formData.ebitdaMultiple !== undefined) {
        parametersToSave.ebitdaMultiple = {
          value: formData.ebitdaMultiple,
          dataType: 'decimal'
        };
      }

      if (formData.ebitdaMarketComparables !== undefined) {
        parametersToSave.ebitdaMarketComparables = {
          value: formData.ebitdaMarketComparables,
          dataType: 'text'
        };
      }

      if (formData.valuationDate !== undefined) {
        parametersToSave.valuationDate = {
          value: formData.valuationDate,
          dataType: 'date'
        };
      }

      await parameterAPI.saveParameters(tenantId, projectId, parametersToSave);

      // Reset dirty state since we've saved
      reset(formData);

      toast({
        title: "Success",
        description: "Parameters saved successfully",
      });
    } catch (error: any) {
      console.error("Failed to save parameters:", error);

      // Extract detailed error information
      let errorMessage = "Failed to save parameters";
      let errorDetails = "";

      if (error.response?.status === 422) {
        // Validation error - extract detailed information
        const responseData = error.response.data;

        if (responseData?.detail) {
          if (Array.isArray(responseData.detail)) {
            // Pydantic validation errors
            const validationErrors = responseData.detail.map((err: any) => {
              const field = err.loc ? err.loc.join('.') : 'unknown field';
              const message = err.msg || 'validation error';
              const value = err.input !== undefined ? `(value: ${JSON.stringify(err.input)})` : '';
              return `${field}: ${message} ${value}`;
            }).join('\n');

            errorMessage = "Validation Error";
            errorDetails = validationErrors;
          } else {
            // String detail message
            errorDetails = responseData.detail;
          }
        } else if (responseData?.message) {
          errorDetails = responseData.message;
        }
      } else if (error.response?.data?.message) {
        errorDetails = error.response.data.message;
      } else if (error.message) {
        errorDetails = error.message;
      }

      toast({
        title: errorMessage,
        description: errorDetails || "Unknown error occurred",
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
          <Controller
            name="valuationDate"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="valuationDate">Valuation Date</Label>
                <Input
                  {...field}
                  type="date"
                  id="valuationDate"
                  disabled={isLoadingParams}
                  className={cn(
                    "bg-background [color-scheme:dark]",
                    getErrorMessage(errors.valuationDate) ? "border-red-500" : ""
                  )}
                />
                {getErrorMessage(errors.valuationDate) && (
                  <p className="text-sm text-destructive">{getErrorMessage(errors.valuationDate)}</p>
                )}
              </div>
            )}
          />
        </div>
      </div>

      {/* Terminal Value Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Terminal Value</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="terminalValueModel"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label>Terminal Value Model</Label>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={isLoadingParams}
                >
                  <SelectTrigger className="bg-background border border-input text-foreground w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border min-w-full">
                    <SelectItem
                      value="gordon-growth"
                      className="text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground pr-8"
                    >
                      Gordon Growth Model
                    </SelectItem>
                    <SelectItem
                      value="h-model"
                      className="text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground pr-8"
                    >
                      H-Model
                    </SelectItem>
                    <SelectItem
                      value="exit-revenue-multiple"
                      className="text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground pr-8"
                    >
                      Revenue Multiple
                    </SelectItem>
                    <SelectItem
                      value="ebitda-multiple"
                      className="text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground pr-8"
                    >
                      EBITDA Multiple
                    </SelectItem>
                  </SelectContent>
                </Select>
                {getErrorMessage(errors.terminalValueModel) && (
                  <p className="text-sm text-destructive">{getErrorMessage(errors.terminalValueModel)}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Model-specific fields */}
        {watch("terminalValueModel") === "gordon-growth" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="terminalGrowthRate"
              control={control}
              render={({ field }) => (
                <PercentageInput
                  {...field}
                  label="Terminal Growth Rate"
                  error={getErrorMessage(errors.terminalGrowthRate)}
                  disabled={isLoadingParams}
                />
              )}
            />
          </div>
        )}

        {watch("terminalValueModel") === "h-model" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="terminalGrowthRateH"
              control={control}
              render={({ field }) => (
                <PercentageInput
                  {...field}
                  label="Terminal Growth Rate"
                  error={getErrorMessage(errors.terminalGrowthRateH)}
                  disabled={isLoadingParams}
                />
              )}
            />
            <Controller
              name="halfLifePeriod"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Half-life Period"
                  suffix="years"
                  error={getErrorMessage(errors.halfLifePeriod)}
                  disabled={isLoadingParams}
                />
              )}
            />
          </div>
        )}

        {watch("terminalValueModel") === "exit-revenue-multiple" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="revenueMultiple"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Revenue Multiple"
                  suffix="x"
                  decimalScale={1}
                  error={getErrorMessage(errors.revenueMultiple)}
                  disabled={isLoadingParams}
                />
              )}
            />
            <Controller
              name="revenueMarketComparables"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Market Comparables</Label>
                  <TextArea
                    {...field}
                    placeholder="Enter comparable companies, one per line"
                    disabled={isLoadingParams}
                  />
                  {getErrorMessage(errors.revenueMarketComparables) && (
                    <p className="text-sm text-destructive">{getErrorMessage(errors.revenueMarketComparables)}</p>
                  )}
                </div>
              )}
            />
          </div>
        )}

        {watch("terminalValueModel") === "ebitda-multiple" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="ebitdaMultiple"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="EBITDA Multiple"
                  suffix="x"
                  decimalScale={1}
                  error={getErrorMessage(errors.ebitdaMultiple)}
                  disabled={isLoadingParams}
                />
              )}
            />
            <Controller
              name="ebitdaMarketComparables"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Market Comparables</Label>
                  <TextArea
                    {...field}
                    placeholder="Enter comparable companies, one per line"
                    disabled={isLoadingParams}
                  />
                  {getErrorMessage(errors.ebitdaMarketComparables) && (
                    <p className="text-sm text-destructive">{getErrorMessage(errors.ebitdaMarketComparables)}</p>
                  )}
                </div>
              )}
            />
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={saveParameters}
          disabled={isSaving || isLoadingParams}
          className="flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            "Save Parameters"
          )}
        </Button>
      </div>
    </form>
  );
}

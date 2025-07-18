"use client";

import React from "react";
import { NumericFormat } from "react-number-format";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PercentageInputProps {
  value?: number;
  onChange?: (value: number | undefined) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  min?: number;
  max?: number;
  allowNegative?: boolean;
}

export const PercentageInput = React.forwardRef<
  HTMLInputElement,
  PercentageInputProps
>(
  (
    {
      value,
      onChange,
      label,
      placeholder = "0.00",
      error,
      disabled,
      className,
      min,
      max,
      allowNegative = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label className={cn("text-sm font-medium", error && "text-destructive")}>
            {label}
          </Label>
        )}
        <NumericFormat
          customInput={Input}
          getInputRef={ref}
          value={value}
          onValueChange={(values) => {
            onChange?.(values.floatValue);
          }}
          suffix="%"
          decimalScale={2}
          fixedDecimalScale
          allowNegative={allowNegative}
          placeholder={placeholder}
          disabled={disabled}
          isAllowed={(values) => {
            const { floatValue } = values;
            if (floatValue === undefined) return true;
            if (min !== undefined && floatValue < min) return false;
            if (max !== undefined && floatValue > max) return false;
            return true;
          }}
          className={cn(
            error && "border-red-500 focus-visible:ring-red-500",
            "text-right"
          )}
          {...props}
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }
);

PercentageInput.displayName = "PercentageInput";
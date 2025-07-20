"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";

interface IncomeStatementData {
  [metric: string]: {
    [date: string]: number | null;
  };
}

interface IncomeStatementTableProps {
  data?: IncomeStatementData;
  onDataChange?: (data: IncomeStatementData) => void;
  isEditable?: boolean;
}

const PREDEFINED_METRICS = [
  "Total Revenue",
  "Cost of Sales",
  "Total Operating Expenses",
  "Tax Depreciation Expenses",
  "Less: Capital Expenditures"
];

const DEFAULT_COLUMNS = [
  "2023-12-31"
];

export function IncomeStatementTable({
  data = {},
  onDataChange = () => { },
  isEditable = true
}: IncomeStatementTableProps) {
  const [columns, setColumns] = useState<string[]>(
    Object.keys(data).length > 0
      ? Object.keys(Object.values(data)[0] || {})
      : DEFAULT_COLUMNS
  );
  const [newColumnDate, setNewColumnDate] = useState("");
  const [showAddColumn, setShowAddColumn] = useState(false);

  // Initialize data structure if empty
  const tableData = PREDEFINED_METRICS.reduce((acc, metric) => {
    acc[metric] = columns.reduce((colAcc, col) => {
      colAcc[col] = data[metric]?.[col] ?? null;
      return colAcc;
    }, {} as { [date: string]: number | null });
    return acc;
  }, {} as IncomeStatementData);

  const handleCellChange = (metric: string, date: string, value: string) => {
    const numValue = value === "" ? null : parseFloat(value);
    const updatedData = {
      ...tableData,
      [metric]: {
        ...tableData[metric],
        [date]: numValue
      }
    };
    onDataChange(updatedData);
  };

  const handleAddColumn = () => {
    if (newColumnDate && !columns.includes(newColumnDate)) {
      const newColumns = [...columns, newColumnDate].sort();
      setColumns(newColumns);

      // Update data with new column
      const updatedData = { ...tableData };
      PREDEFINED_METRICS.forEach(metric => {
        updatedData[metric] = {
          ...updatedData[metric],
          [newColumnDate]: null
        };
      });
      onDataChange(updatedData);

      setNewColumnDate("");
      setShowAddColumn(false);
    }
  };

  const handleRemoveColumn = (dateToRemove: string) => {
    if (columns.length <= 1) return; // Keep at least one column

    const newColumns = columns.filter(col => col !== dateToRemove);
    setColumns(newColumns);

    // Update data by removing the column
    const updatedData = { ...tableData };
    PREDEFINED_METRICS.forEach(metric => {
      const { [dateToRemove]: removed, ...remaining } = updatedData[metric];
      updatedData[metric] = remaining;
    });
    onDataChange(updatedData);
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Income Statement</h3>
        {isEditable && (
          <Button
            onClick={() => setShowAddColumn(true)}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Period
          </Button>
        )}
      </div>

      {/* Add Column Form */}
      {showAddColumn && (
        <div className="mb-4 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Input
              type="date"
              value={newColumnDate}
              onChange={(e) => setNewColumnDate(e.target.value)}
              placeholder="YYYY-MM-DD"
              className="w-48"
            />
            <Button onClick={handleAddColumn} size="sm" variant="outline">
              Add
            </Button>
            <Button
              onClick={() => {
                setShowAddColumn(false);
                setNewColumnDate("");
              }}
              size="sm"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="text-left p-3 font-medium min-w-[200px]"></th>
              {columns.map((date) => (
                <th key={date} className="text-center p-3 font-medium min-w-[120px]">
                  <div className="flex items-center justify-center gap-2">
                    <span>{date}</span>
                    {isEditable && columns.length > 1 && (
                      <Button
                        onClick={() => handleRemoveColumn(date)}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PREDEFINED_METRICS.map((metric, index) => (
              <tr key={metric} className={index % 2 === 0 ? "bg-background" : "bg-muted/25"}>
                <td className="p-3 font-medium text-sm border-r">
                  {metric}
                </td>
                {columns.map((date) => (
                  <td key={`${metric}-${date}`} className="p-2 text-center">
                    {isEditable ? (
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={tableData[metric]?.[date] ?? ""}
                        onChange={(e) => handleCellChange(metric, date, e.target.value)}
                        className="text-center border-0 bg-transparent focus:bg-background [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                    ) : (
                      <span className="text-sm">
                        {tableData[metric]?.[date]?.toLocaleString() ?? "-"}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

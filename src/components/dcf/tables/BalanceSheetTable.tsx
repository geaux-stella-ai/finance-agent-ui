"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Edit, Save, Loader2 } from "lucide-react";

interface BalanceSheetData {
  [metric: string]: {
    [date: string]: number | null;
  };
}

interface BalanceSheetTableProps {
  data?: BalanceSheetData;
  onDataChange?: (data: BalanceSheetData) => void;
  isEditable?: boolean;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
}

const PREDEFINED_METRICS = [
  "Current Assets",
  "Total Assets",
  "Current Liabilities",
  "Total Liabilities",
  "Total Shareholders' Equity"
];

const DEFAULT_COLUMNS = [
  "2023-12-31"
];

export function BalanceSheetTable({
  data = {},
  onDataChange = () => { },
  isEditable = true,
  onSave,
  isSaving = false
}: BalanceSheetTableProps) {
  const [columns, setColumns] = useState<string[]>(
    Object.keys(data).length > 0
      ? Object.keys(Object.values(data)[0] || {})
      : DEFAULT_COLUMNS
  );
  const [newColumnDate, setNewColumnDate] = useState("");
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [editColumnValue, setEditColumnValue] = useState("");

  // Initialize data structure if empty
  const tableData = PREDEFINED_METRICS.reduce((acc, metric) => {
    acc[metric] = columns.reduce((colAcc, col) => {
      colAcc[col] = data[metric]?.[col] ?? null;
      return colAcc;
    }, {} as { [date: string]: number | null });
    return acc;
  }, {} as BalanceSheetData);

  // Initialize data with default columns when component first loads
  useEffect(() => {
    if (Object.keys(data).length === 0) {
      onDataChange(tableData);
    }
  }, []);

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
      void removed; // Suppress unused variable warning
      updatedData[metric] = remaining;
    });
    onDataChange(updatedData);
  };

  const handleEditColumn = (oldDate: string) => {
    setEditingColumn(oldDate);
    setEditColumnValue(oldDate);
  };

  const handleSaveColumnEdit = () => {
    if (editingColumn && editColumnValue && editColumnValue !== editingColumn && !columns.includes(editColumnValue)) {
      const newColumns = columns.map(col => col === editingColumn ? editColumnValue : col).sort();
      setColumns(newColumns);

      // Update data by renaming the column
      const updatedData = { ...tableData };
      PREDEFINED_METRICS.forEach(metric => {
        const { [editingColumn]: oldValue, ...remaining } = updatedData[metric];
        updatedData[metric] = {
          ...remaining,
          [editColumnValue]: oldValue
        };
      });
      onDataChange(updatedData);
    }
    setEditingColumn(null);
    setEditColumnValue("");
  };

  const handleCancelColumnEdit = () => {
    setEditingColumn(null);
    setEditColumnValue("");
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Balance Sheet</h3>
        <div className="flex items-center gap-2">
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
          {onSave && isEditable && (
            <Button
              onClick={onSave}
              disabled={isSaving}
              size="sm"
              variant="outline"
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          )}
        </div>
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
                  {editingColumn === date ? (
                    <div className="flex items-center justify-center gap-1">
                      <Input
                        type="date"
                        value={editColumnValue}
                        onChange={(e) => setEditColumnValue(e.target.value)}
                        className="text-center text-xs h-6 w-32"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveColumnEdit();
                          if (e.key === 'Escape') handleCancelColumnEdit();
                        }}
                        autoFocus
                      />
                      <Button
                        onClick={handleSaveColumnEdit}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-green-600"
                      >
                        ✓
                      </Button>
                      <Button
                        onClick={handleCancelColumnEdit}
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span>{date}</span>
                      {isEditable && (
                        <Button
                          onClick={() => handleEditColumn(date)}
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-blue-600"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      )}
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
                  )}
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
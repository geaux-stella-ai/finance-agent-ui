"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Edit, Save, Loader2 } from "lucide-react";

interface BalanceSheetData {
  [lineItem: string]: {
    [date: string]: number | null;
  };
}

interface LineItemCodification {
  [lineItem: string]: string;
}

interface BalanceSheetTableProps {
  data?: BalanceSheetData;
  onDataChange?: (data: BalanceSheetData) => void;
  codifications?: LineItemCodification;
  onCodificationChange?: (codifications: LineItemCodification) => void;
  isEditable?: boolean;
  onSave?: () => Promise<void>;
  isSaving?: boolean;
}

const PREDEFINED_LINE_ITEMS = [
  // Assets
  "Cash and Equivalents",
  "Marketable Securities",
  "Accounts Receivable",
  "Intercompany Receivables",
  "Inventories",
  "Finance Lease Receivables, Current",
  "Prepaid Expenses",
  "Other Current Assets",
  "Nonoperating Assets, Current",
  "Current Assets",
  "Property, Plant, and Equipment",
  "Finance Lease Receivables, Noncurrent",
  "Intangible Assets",
  "Other Noncurrent Assets",
  "Nonoperating Assets, Noncurrent",
  "Noncurrent Assets",
  "Total Assets",

  // Current Liabilities
  "Accounts Payable",
  "Intercompany Payables",
  "Deferred Revenue, Current",
  "Finance Lease Liabilities, Current",
  "Operating Lease Liabilities, Current",
  "Other Current Liabilities",
  "Deferred Tax Liabilities, Current",
  "Debt (Exc. Finance Lease Liabilities), Current",
  "Intercompany Loans, Current",
  "Nonoperating Liabilities, Current",
  "Current Liabilities",

  // Noncurrent Liabilities
  "Deferred Revenue, Noncurrent",
  "Deferred Tax Liabilities, Noncurrent",
  "Debt (Exc. Finance Lease Liabilities), Noncurrent",
  "Finance Lease Liabilities, Noncurrent",
  "Operating Lease Liabilities, Noncurrent",
  "Intercompany Loans, Noncurrent",
  "Underfunded Pension Liabilities",
  "Other Noncurrent Liabilities",
  "Nonoperating Liabilities, Noncurrent",
  "Noncurrent Liabilities",
  "Total Liabilities",

  // Equity
  "Noncontrolling Interests",
  "Preferred Equity",
  "Common Equity",
  "Other Equity",
  "Total Equity",

  // Final Totals
  "Total Liabilities and Equity",
  "Sanity Check"
];

const CODIFICATION_OPTIONS = [
  "__none__", "Cash", "Debt", "DTA", "DTL", "GW", "Intang", "INV", "LDEF", "NCOA", 
  "Non-op", "NWC", "PP&E", "ROUO", "ROUF", "OLL", "FLL", "SDEF", "TA", "TE"
];

const DEFAULT_CODIFICATIONS: LineItemCodification = {
  // Assets
  "Cash and Equivalents": "Cash",
  "Marketable Securities": "Cash",
  "Accounts Receivable": "NWC",
  "Intercompany Receivables": "NWC",
  "Inventories": "INV",
  "Finance Lease Receivables, Current": "ROUF",
  "Prepaid Expenses": "NWC",
  "Other Current Assets": "NCOA",
  "Nonoperating Assets, Current": "Non-op",
  "Current Assets": "",
  "Property, Plant, and Equipment": "PP&E",
  "Finance Lease Receivables, Noncurrent": "ROUF",
  "Intangible Assets": "Intang",
  "Other Noncurrent Assets": "NCOA",
  "Nonoperating Assets, Noncurrent": "Non-op",
  "Noncurrent Assets": "",
  "Total Assets": "TA",
  
  // Current Liabilities
  "Accounts Payable": "NWC",
  "Intercompany Payables": "NWC",
  "Deferred Revenue, Current": "SDEF",
  "Finance Lease Liabilities, Current": "FLL",
  "Operating Lease Liabilities, Current": "OLL",
  "Other Current Liabilities": "NWC",
  "Deferred Tax Liabilities, Current": "DTL",
  "Debt (Exc. Finance Lease Liabilities), Current": "Debt",
  "Intercompany Loans, Current": "Debt",
  "Nonoperating Liabilities, Current": "Non-op",
  "Current Liabilities": "TA",
  
  // Noncurrent Liabilities
  "Deferred Revenue, Noncurrent": "LDEF",
  "Deferred Tax Liabilities, Noncurrent": "DTL",
  "Debt (Exc. Finance Lease Liabilities), Noncurrent": "Debt",
  "Finance Lease Liabilities, Noncurrent": "FLL",
  "Operating Lease Liabilities, Noncurrent": "OLL",
  "Intercompany Loans, Noncurrent": "Debt",
  "Underfunded Pension Liabilities": "LDEF",
  "Other Noncurrent Liabilities": "LDEF",
  "Nonoperating Liabilities, Noncurrent": "Non-op",
  "Noncurrent Liabilities": "",
  "Total Liabilities": "",
  
  // Equity
  "Noncontrolling Interests": "",
  "Preferred Equity": "",
  "Common Equity": "",
  "Other Equity": "",
  "Total Equity": "TE",
  
  // Final Totals
  "Total Liabilities and Equity": "",
  "Sanity Check": "TA"
};

const DEFAULT_COLUMNS = [
  "2023-12-31"
];

export function BalanceSheetTable({
  data = {},
  onDataChange = () => { },
  codifications = {},
  onCodificationChange = () => { },
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
  const tableData = PREDEFINED_LINE_ITEMS.reduce((acc, lineItem) => {
    acc[lineItem] = columns.reduce((colAcc, col) => {
      colAcc[col] = data[lineItem]?.[col] ?? null;
      return colAcc;
    }, {} as { [date: string]: number | null });
    return acc;
  }, {} as BalanceSheetData);

  // Initialize codifications with defaults, making it reactive to prop changes
  const tableCodifications = React.useMemo(() => {
    return { ...DEFAULT_CODIFICATIONS, ...codifications };
  }, [codifications]);

  // Initialize data with default columns when component first loads
  useEffect(() => {
    if (Object.keys(data).length === 0) {
      onDataChange(tableData);
    }
    if (Object.keys(codifications).length === 0) {
      onCodificationChange(DEFAULT_CODIFICATIONS);
    }
  }, []);

  const handleCellChange = (lineItem: string, date: string, value: string) => {
    let numValue: number | null = null;
    
    if (value === "") {
      numValue = null;
    } else {
      const parsed = parseFloat(value);
      // Only store the value if it's a valid number, otherwise keep as null
      numValue = !isNaN(parsed) ? parsed : null;
    }
    
    const updatedData = {
      ...tableData,
      [lineItem]: {
        ...tableData[lineItem],
        [date]: numValue
      }
    };
    onDataChange(updatedData);
  };

  const handleCodificationChange = (lineItem: string, codification: string) => {
    const actualValue = codification === "__none__" ? "" : codification;
    const updatedCodifications = {
      ...tableCodifications,
      [lineItem]: actualValue
    };
    onCodificationChange(updatedCodifications);
  };

  const handleAddColumn = () => {
    if (newColumnDate && !columns.includes(newColumnDate)) {
      const newColumns = [...columns, newColumnDate].sort();
      setColumns(newColumns);

      // Update data with new column
      const updatedData = { ...tableData };
      PREDEFINED_LINE_ITEMS.forEach(lineItem => {
        updatedData[lineItem] = {
          ...updatedData[lineItem],
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
    PREDEFINED_LINE_ITEMS.forEach(lineItem => {
      const { [dateToRemove]: removed, ...remaining } = updatedData[lineItem];
      void removed; // Suppress unused variable warning
      updatedData[lineItem] = remaining;
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
      PREDEFINED_LINE_ITEMS.forEach(lineItem => {
        const { [editingColumn]: oldValue, ...remaining } = updatedData[lineItem];
        updatedData[lineItem] = {
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
              <th className="text-center p-3 font-medium min-w-[120px]">Codification</th>
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
            {PREDEFINED_LINE_ITEMS.map((lineItem, index) => (
              <tr key={lineItem} className={index % 2 === 0 ? "bg-background" : "bg-muted/25"}>
                <td className="p-3 font-medium text-sm border-r">
                  {lineItem}
                </td>
                <td className="p-2 text-center border-r">
                  {isEditable ? (
                    <Select
                      value={tableCodifications[lineItem] || "__none__"}
                      onValueChange={(value) => handleCodificationChange(lineItem, value)}
                    >
                      <SelectTrigger className="w-full h-8 text-xs">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border">
                        {CODIFICATION_OPTIONS.map((option) => (
                          <SelectItem 
                            key={option} 
                            value={option}
                            className="text-foreground hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            {option === "__none__" ? "None" : option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sm">
                      {tableCodifications[lineItem] || "-"}
                    </span>
                  )}
                </td>
                {columns.map((date) => (
                  <td key={`${lineItem}-${date}`} className="p-2 text-center">
                    {isEditable ? (
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={
                          tableData[lineItem]?.[date] === null || 
                          tableData[lineItem]?.[date] === undefined || 
                          isNaN(tableData[lineItem]?.[date] as number) 
                            ? "" 
                            : String(tableData[lineItem]?.[date])
                        }
                        onChange={(e) => handleCellChange(lineItem, date, e.target.value)}
                        className="text-center border-0 bg-transparent focus:bg-background [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0"
                      />
                    ) : (
                      <span className="text-sm">
                        {
                          tableData[lineItem]?.[date] === null || 
                          tableData[lineItem]?.[date] === undefined || 
                          isNaN(tableData[lineItem]?.[date] as number)
                            ? "-" 
                            : tableData[lineItem]?.[date]?.toLocaleString()
                        }
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

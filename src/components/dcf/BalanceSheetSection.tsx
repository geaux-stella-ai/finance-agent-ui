"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BalanceSheetTable } from "./tables";
import { Edit, Table, ChevronDown } from "lucide-react";

interface BalanceSheetData {
  [metric: string]: {
    [date: string]: number | null;
  };
}

interface BalanceSheetSectionProps {
  data?: BalanceSheetData;
  onDataChange?: (data: BalanceSheetData) => void;
}

export function BalanceSheetSection({
  data = {},
  onDataChange = () => {}
}: BalanceSheetSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Calculate summary stats
  const columns = Object.keys(Object.values(data)[0] || {});
  const totalCells = Object.keys(data).length * columns.length;
  const filledCells = Object.values(data).reduce((count, metricData) => {
    return count + Object.values(metricData).filter(value => value !== null && value !== undefined).length;
  }, 0);

  const completionPercentage = totalCells > 0 ? Math.round((filledCells / totalCells) * 100) : 0;

  return (
    <div className="flex flex-col gap-2">
      <button
        className="flex items-center gap-2 mb-2 w-full text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h2 className="text-2xl font-semibold flex-1">Balance Sheet</h2>
        <ChevronDown className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="space-y-4">
          {/* Summary Card */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Financial Data</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {completionPercentage}% complete
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Metrics:</span>
                <span>5 (DCF Standard)</span>
              </div>
              <div className="flex justify-between">
                <span>Periods:</span>
                <span>{columns.length || 1}</span>
              </div>
              <div className="flex justify-between">
                <span>Data Points:</span>
                <span>{filledCells} / {totalCells || 5}</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {filledCells > 0 ? 'Edit Balance Sheet' : 'Enter Balance Sheet Data'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle>Balance Sheet Data Entry</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                <BalanceSheetTable
                  data={data}
                  onDataChange={onDataChange}
                  isEditable={true}
                />
              </div>
            </DialogContent>
          </Dialog>

          {/* Quick Preview for filled data */}
          {filledCells > 0 && (
            <div className="text-xs text-muted-foreground">
              <div className="font-medium mb-1">Recent entries:</div>
              {Object.entries(data).slice(0, 2).map(([metric, values]) => {
                const latestEntry = Object.entries(values).find(([_, value]) => value !== null);
                if (latestEntry) {
                  return (
                    <div key={metric} className="flex justify-between">
                      <span>{metric}:</span>
                      <span>{latestEntry[1]?.toLocaleString()}</span>
                    </div>
                  );
                }
                return null;
              })}
              {Object.keys(data).length > 2 && (
                <div className="text-xs text-muted-foreground/70 mt-1">
                  ...and {Object.keys(data).length - 2} more metrics
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
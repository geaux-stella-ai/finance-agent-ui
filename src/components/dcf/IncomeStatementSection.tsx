"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { IncomeStatementTable } from "./tables";
import { Edit, Table, ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { incomeStatementAPI, FrontendIncomeStatementData } from "@/lib/api/income-statement";
import { toast } from "sonner";

interface IncomeStatementSectionProps {
  data?: FrontendIncomeStatementData;
  onDataChange?: (data: FrontendIncomeStatementData) => void;
}

export function IncomeStatementSection({
  data = {},
  onDataChange = () => { }
}: IncomeStatementSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const params = useParams();

  const tenantId = params.tenantId as string;
  const projectId = params.projectId as string;

  // Load data from backend on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!tenantId || !projectId) return;

      setIsLoading(true);
      try {
        const loadedData = await incomeStatementAPI.loadFrontendData(tenantId, projectId);
        onDataChange(loadedData);
      } catch (error) {
        console.error('Failed to load income statement data:', error);
        toast.error('Failed to load income statement data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [tenantId, projectId, onDataChange]);

  // Save data to backend
  const handleSave = async () => {
    if (!tenantId || !projectId) return;

    setIsSaving(true);
    try {
      await incomeStatementAPI.saveFrontendData(tenantId, projectId, data);
      toast.success('Income statement data saved successfully');
    } catch (error) {
      console.error('Failed to save income statement data:', error);
      toast.error('Failed to save income statement data');
    } finally {
      setIsSaving(false);
    }
  };

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
        <h2 className="text-2xl font-semibold flex-1">Income Statement</h2>
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

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 flex items-center gap-2"
                  disabled={isLoading}
                >
                  <Edit className="w-4 h-4" />
                  {filledCells > 0 ? 'Edit Income Statement' : 'Enter Income Statement Data'}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>Income Statement Data Entry</DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
                  <IncomeStatementTable
                    data={data}
                    onDataChange={onDataChange}
                    isEditable={true}
                    onSave={handleSave}
                    isSaving={isSaving}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Quick Preview for filled data */}
          {filledCells > 0 && (
            <div className="text-xs text-muted-foreground">
              <div className="font-medium mb-1">Recent entries:</div>
              {Object.entries(data).slice(0, 2).map(([metric, values]) => {
                const latestEntry = Object.entries(values).find(([, value]) => value !== null);
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

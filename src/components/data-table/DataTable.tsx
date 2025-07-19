'use client'

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

export interface TableColumn {
  id: string
  name: string
  type: 'string' | 'number' | 'boolean' | 'date'
}

export interface TableData {
  table_id: string
  table_name: string
  source: 'user_upload' | 'financial_modeling'
  columns: TableColumn[]
  rows: Record<string, any>[]
  row_count: number
}

interface DataTableProps {
  data: TableData
  className?: string
}

const formatCellValue = (value: any, type: string): string => {
  if (value === null || value === undefined) return '-'
  
  switch (type) {
    case 'number':
      if (typeof value === 'number') {
        return value.toLocaleString()
      }
      return String(value)
    case 'boolean':
      return value ? 'Yes' : 'No'
    case 'date':
      if (value instanceof Date) {
        return value.toLocaleDateString()
      }
      return String(value)
    default:
      return String(value)
  }
}

export function DataTable({ data, className }: DataTableProps) {
  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{data.table_name}</h3>
          <p className="text-sm text-muted-foreground">
            {data.row_count} rows • Source: {data.source.replace('_', ' ')}
          </p>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {data.columns.map((column) => (
                <TableHead key={column.id} className="font-medium">
                  {column.name}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({column.type})
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={data.columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No data available
                </TableCell>
              </TableRow>
            ) : (
              data.rows.map((row, index) => (
                <TableRow key={index}>
                  {data.columns.map((column) => (
                    <TableCell key={column.id}>
                      {formatCellValue(row[column.id], column.type)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
'use client'

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { DataTable, TableData } from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// Fake data generator
const generateFakeTableData = (): TableData[] => {
  return [
    {
      table_id: 'financial_statements_2023',
      table_name: 'Income Statement 2023',
      source: 'user_upload',
      columns: [
        { id: 'line_item', name: 'Line Item', type: 'string' },
        { id: 'q1_2023', name: 'Q1 2023', type: 'number' },
        { id: 'q2_2023', name: 'Q2 2023', type: 'number' },
        { id: 'q3_2023', name: 'Q3 2023', type: 'number' },
        { id: 'q4_2023', name: 'Q4 2023', type: 'number' },
        { id: 'full_year', name: 'Full Year', type: 'number' }
      ],
      rows: [
        {
          line_item: 'Revenue',
          q1_2023: 75000000,
          q2_2023: 82000000,
          q3_2023: 89000000,
          q4_2023: 95000000,
          full_year: 341000000
        },
        {
          line_item: 'Cost of Goods Sold',
          q1_2023: -45000000,
          q2_2023: -49000000,
          q3_2023: -52000000,
          q4_2023: -56000000,
          full_year: -202000000
        },
        {
          line_item: 'Gross Profit',
          q1_2023: 30000000,
          q2_2023: 33000000,
          q3_2023: 37000000,
          q4_2023: 39000000,
          full_year: 139000000
        },
        {
          line_item: 'Operating Expenses',
          q1_2023: -18000000,
          q2_2023: -19500000,
          q3_2023: -21000000,
          q4_2023: -22500000,
          full_year: -81000000
        },
        {
          line_item: 'EBITDA',
          q1_2023: 12000000,
          q2_2023: 13500000,
          q3_2023: 16000000,
          q4_2023: 16500000,
          full_year: 58000000
        }
      ],
      row_count: 5
    },
    {
      table_id: 'dcf_assumptions',
      table_name: 'DCF Model Assumptions',
      source: 'financial_modeling',
      columns: [
        { id: 'assumption', name: 'Assumption', type: 'string' },
        { id: 'value', name: 'Value', type: 'number' },
        { id: 'unit', name: 'Unit', type: 'string' },
        { id: 'source', name: 'Source', type: 'string' },
        { id: 'updated', name: 'Last Updated', type: 'date' }
      ],
      rows: [
        {
          assumption: 'Terminal Growth Rate',
          value: 2.5,
          unit: '%',
          source: 'Market Analysis',
          updated: '2024-01-15'
        },
        {
          assumption: 'WACC',
          value: 8.2,
          unit: '%',
          source: 'CAPM Calculation',
          updated: '2024-01-14'
        },
        {
          assumption: 'Revenue Growth (2024)',
          value: 12.5,
          unit: '%',
          source: 'Management Guidance',
          updated: '2024-01-16'
        },
        {
          assumption: 'EBITDA Margin Target',
          value: 18.5,
          unit: '%',
          source: 'Industry Benchmarks',
          updated: '2024-01-12'
        }
      ],
      row_count: 4
    },
    {
      table_id: 'comparables_analysis',
      table_name: 'Comparable Companies',
      source: 'financial_modeling',
      columns: [
        { id: 'company', name: 'Company', type: 'string' },
        { id: 'market_cap', name: 'Market Cap', type: 'number' },
        { id: 'revenue', name: 'Revenue (LTM)', type: 'number' },
        { id: 'ev_revenue', name: 'EV/Revenue', type: 'number' },
        { id: 'ev_ebitda', name: 'EV/EBITDA', type: 'number' },
        { id: 'public', name: 'Public', type: 'boolean' }
      ],
      rows: [
        {
          company: 'Apple Inc.',
          market_cap: 3000000000000,
          revenue: 365817000000,
          ev_revenue: 8.2,
          ev_ebitda: 25.4,
          public: true
        },
        {
          company: 'Microsoft Corp.',
          market_cap: 2800000000000,
          revenue: 198270000000,
          ev_revenue: 14.1,
          ev_ebitda: 32.8,
          public: true
        },
        {
          company: 'Alphabet Inc.',
          market_cap: 1700000000000,
          revenue: 282836000000,
          ev_revenue: 6.0,
          ev_ebitda: 18.2,
          public: true
        }
      ],
      row_count: 3
    }
  ]
}

export default function ProjectTablesPage() {
  const params = useParams()
  const [tables, setTables] = useState<TableData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call delay
    const loadTables = async () => {
      setLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      const fakeData = generateFakeTableData()
      setTables(fakeData)
      setSelectedTable(fakeData[0]?.table_id || null)
      setLoading(false)
    }

    loadTables()
  }, [params.projectId])

  if (loading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-4 w-[500px]" />
        </div>
        <div className="flex gap-4">
          <div className="space-y-2">
            <Skeleton className="h-9 w-[150px]" />
            <Skeleton className="h-9 w-[180px]" />
            <Skeleton className="h-9 w-[160px]" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  const currentTable = tables.find(table => table.table_id === selectedTable)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Project Tables</h1>
        <p className="text-muted-foreground">
          View and analyze data tables for project {params.projectId}
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        {tables.map((table) => (
          <Button
            key={table.table_id}
            variant={selectedTable === table.table_id ? 'destructive' : 'outline'}
            onClick={() => setSelectedTable(table.table_id)}
          >
            {table.table_name}
          </Button>
        ))}
      </div>

      {currentTable ? (
        <DataTable data={currentTable} />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No table selected</p>
        </div>
      )}
    </div>
  )
}
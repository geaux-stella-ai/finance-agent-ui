'use client'

import { DCFModel } from '@/lib/api/dcf'

interface DCFResultsTableProps {
  modelData: DCFModel
}

const formatValue = (value: number | null, formatType: string) => {
  if (value === null || value === undefined) {
    return '-'
  }
  
  switch (formatType) {
    case 'CURRENCY':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    case 'PERCENTAGE':
      return new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value)
    case 'NUMBER':
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 4,
        maximumFractionDigits: 4,
      }).format(value)
    default:
      return value.toString()
  }
}

const getRowStyle = (lineItemName: string) => {
  // Highlight key sections
  if (lineItemName.includes('Total Revenue') || 
      lineItemName.includes('Free Cash Flow') ||
      lineItemName.includes('Terminal Value') ||
      lineItemName.includes('Total Equity Value')) {
    return 'bg-muted/50 font-semibold'
  }
  
  // Percentage rows
  if (lineItemName.includes('%') || lineItemName.includes('Percent')) {
    return 'text-muted-foreground text-sm'
  }
  
  return ''
}

const DCFResultsTable = ({ modelData }: DCFResultsTableProps) => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">DCF Analysis</h3>
        <p className="text-sm text-muted-foreground">
          Projected periods and terminal value calculations
        </p>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left p-3 font-medium min-w-[250px]">
              </th>
              {modelData.periods.map((period, index) => (
                <th key={index} className="text-center p-3 font-medium min-w-[120px]">
                  <div className="text-sm font-medium">{period.label}</div>
                  <div className="text-xs text-muted-foreground">{period.date_end}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modelData.line_items.map((lineItem, rowIndex) => (
              <tr
                key={rowIndex}
                className={`border-b hover:bg-muted/20 ${getRowStyle(lineItem.name)}`}
              >
                <td className="p-3 font-medium text-sm">
                  {lineItem.name}
                </td>
                {lineItem.values.map((value, colIndex) => (
                  <td key={colIndex} className="p-3 text-center text-sm">
                    {value === 0 && !lineItem.name.includes('%') ? 
                      '-' : 
                      formatValue(value, lineItem.format_type)
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary section */}
      <div className="mt-6 p-4 bg-muted/30 rounded-lg">
        <h4 className="font-semibold mb-2">Key Metrics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {modelData.line_items
            .filter(item => 
              item.name.includes('Total Equity Value') || 
              item.name.includes('Sum of Discounted Cash Flows')
            )
            .map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-medium">{item.name}:</span>
                <span className="font-semibold">
                  {formatValue(item.values[0], item.format_type)}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default DCFResultsTable
import apiClient from '@/lib/api-client';
import { TableData } from '@/components/data-table/DataTable';

export interface TableInfo {
  table_id: string;
  table_name: string;
  source: 'user_upload' | 'financial_modeling';
  row_count: number;
  column_count: number;
}

/**
 * Fetch all tables for a project
 */
export async function fetchTables(tenantId: string, projectId: string): Promise<TableInfo[]> {
  try {
    const response = await apiClient.get(
      `/api/v1/tenants/${tenantId}/projects/${projectId}/tables`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching tables:', error);
    throw new Error('Failed to fetch tables');
  }
}

/**
 * Fetch data for a specific table
 */
export async function fetchTableData(
  tenantId: string, 
  projectId: string, 
  tableId: string
): Promise<TableData> {
  try {
    const response = await apiClient.get(
      `/api/v1/tenants/${tenantId}/projects/${projectId}/tables/${tableId}/data`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching table data:', error);
    throw new Error('Failed to fetch table data');
  }
}
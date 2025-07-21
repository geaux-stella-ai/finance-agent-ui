import apiClient from '../api-client';

export interface DCFPeriod {
    label: string;
    date_end: string;
}

export interface DCFLineItem {
    name: string;
    values: number[];
    format_type: 'CURRENCY' | 'PERCENTAGE' | 'NUMBER';
}

export interface DCFModel {
    project_id: string;
    periods: DCFPeriod[];
    line_items: DCFLineItem[];
}

export async function getDcfModel(tenantId: string, projectId: string): Promise<DCFModel> {
    const response = await apiClient.get(`/api/v1/tenants/${tenantId}/projects/${projectId}/dcf-model-results`);
    return response.data;
}
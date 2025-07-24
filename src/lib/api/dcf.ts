import apiClient from '../api-client';

export interface DCFPeriod {
    label: string;
    date_end: string;
}

export interface DCFLineItem {
    name: string;
    values: number[];
    format_type: 'currency' | 'percentage' | 'number';
}

export interface DCFModel {
    project_id: string;
    periods: DCFPeriod[];
    line_items: DCFLineItem[];
}

export async function getDcfModel(tenantId: string, projectId: string): Promise<DCFModel> {
    try {
        const response = await apiClient.get(`/api/v1/tenants/${tenantId}/projects/${projectId}/dcf-model-results`);
        return response.data;
    } catch (error: any) {
        // Extract specific error message from API response
        if (error.response?.data?.detail) {
            const errorMessage = error.response.data.detail;
            const errorStatus = error.response.status;
            
            // Create a more detailed error object
            const enhancedError = new Error(errorMessage);
            (enhancedError as any).status = errorStatus;
            (enhancedError as any).originalError = error;
            
            throw enhancedError;
        }
        
        // Fallback to original error
        throw error;
    }
}
import apiClient from '@/lib/api-client';

export interface BalanceSheetEntry {
    project_id: string;
    metric_name: string;
    date_period: string;
    value: number | null;
    created_at: string;
    updated_at: string;
}

export interface BalanceSheetData {
    project_id: string;
    data: BalanceSheetEntry[];
}

export interface BalanceSheetEntryBase {
    metric_name: string;
    date_period: string;
    value: number | null;
}

export interface BalanceSheetUpsertRequest {
    data: BalanceSheetEntryBase[];
}

// Frontend data format used by components
export interface FrontendBalanceSheetData {
    [metric: string]: {
        [date: string]: number | null;
    };
}

export const balanceSheetAPI = {
    // Get balance sheet data for a project
    async getBalanceSheet(tenantId: string, projectId: string): Promise<BalanceSheetData> {
        const response = await apiClient.get(
            `/api/v1/tenants/${tenantId}/projects/${projectId}/financial-statements/balance-sheet`
        );
        return response.data;
    },

    // Save balance sheet data
    async saveBalanceSheet(
        tenantId: string,
        projectId: string,
        data: BalanceSheetUpsertRequest
    ): Promise<BalanceSheetData> {
        const response = await apiClient.put(
            `/api/v1/tenants/${tenantId}/projects/${projectId}/financial-statements/balance-sheet`,
            data
        );
        return response.data;
    },

    // Transform frontend data format to backend format
    transformToBackend(frontendData: FrontendBalanceSheetData): BalanceSheetEntryBase[] {
        const entries: BalanceSheetEntryBase[] = [];
        
        for (const [metricName, dateValues] of Object.entries(frontendData)) {
            for (const [dateString, value] of Object.entries(dateValues)) {
                entries.push({
                    metric_name: metricName,
                    date_period: dateString,
                    value: value
                });
            }
        }
        
        return entries;
    },

    // Transform backend data format to frontend format
    transformToFrontend(backendData: BalanceSheetData): FrontendBalanceSheetData {
        const frontendData: FrontendBalanceSheetData = {};
        
        for (const entry of backendData.data) {
            if (!frontendData[entry.metric_name]) {
                frontendData[entry.metric_name] = {};
            }
            frontendData[entry.metric_name][entry.date_period] = entry.value;
        }
        
        return frontendData;
    },

    // Save frontend data format directly
    async saveFrontendData(
        tenantId: string,
        projectId: string,
        frontendData: FrontendBalanceSheetData
    ): Promise<BalanceSheetData> {
        const backendEntries = this.transformToBackend(frontendData);
        const request: BalanceSheetUpsertRequest = { data: backendEntries };
        return this.saveBalanceSheet(tenantId, projectId, request);
    },

    // Load data and return in frontend format
    async loadFrontendData(tenantId: string, projectId: string): Promise<FrontendBalanceSheetData> {
        try {
            const backendData = await this.getBalanceSheet(tenantId, projectId);
            return this.transformToFrontend(backendData);
        } catch (error) {
            // If no data exists yet, return empty object
            if ((error as Error & { response?: { status: number } })?.response?.status === 404) {
                return {};
            }
            throw error;
        }
    }
};
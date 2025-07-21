import apiClient from '@/lib/api-client';

export interface IncomeStatementEntry {
    project_id: string;
    line_item_name: string;
    date_period: string;
    value: number | null;
    created_at: string;
    updated_at: string;
}

export interface IncomeStatementData {
    project_id: string;
    data: IncomeStatementEntry[];
}

export interface IncomeStatementEntryBase {
    line_item_name: string;
    date_period: string;
    value: number | null;
}

export interface IncomeStatementUpsertRequest {
    data: IncomeStatementEntryBase[];
}

// Frontend data format used by components
export interface FrontendIncomeStatementData {
    [lineItem: string]: {
        [date: string]: number | null;
    };
}

export const incomeStatementAPI = {
    // Get income statement data for a project
    async getIncomeStatement(tenantId: string, projectId: string): Promise<IncomeStatementData> {
        const response = await apiClient.get(
            `/api/v1/tenants/${tenantId}/projects/${projectId}/financial-statements/income-statement`
        );
        return response.data;
    },

    // Save income statement data
    async saveIncomeStatement(
        tenantId: string,
        projectId: string,
        data: IncomeStatementUpsertRequest
    ): Promise<IncomeStatementData> {
        const response = await apiClient.put(
            `/api/v1/tenants/${tenantId}/projects/${projectId}/financial-statements/income-statement`,
            data
        );
        return response.data;
    },

    // Transform frontend data format to backend format
    transformToBackend(frontendData: FrontendIncomeStatementData): IncomeStatementEntryBase[] {
        const entries: IncomeStatementEntryBase[] = [];
        
        for (const [lineItemName, dateValues] of Object.entries(frontendData)) {
            for (const [dateString, value] of Object.entries(dateValues)) {
                entries.push({
                    line_item_name: lineItemName,
                    date_period: dateString,
                    value: value
                });
            }
        }
        
        return entries;
    },

    // Transform backend data format to frontend format
    transformToFrontend(backendData: IncomeStatementData): FrontendIncomeStatementData {
        const frontendData: FrontendIncomeStatementData = {};
        
        for (const entry of backendData.data) {
            if (!frontendData[entry.line_item_name]) {
                frontendData[entry.line_item_name] = {};
            }
            frontendData[entry.line_item_name][entry.date_period] = entry.value;
        }
        
        return frontendData;
    },

    // Save frontend data format directly
    async saveFrontendData(
        tenantId: string,
        projectId: string,
        frontendData: FrontendIncomeStatementData
    ): Promise<IncomeStatementData> {
        const backendEntries = this.transformToBackend(frontendData);
        const request: IncomeStatementUpsertRequest = { data: backendEntries };
        return this.saveIncomeStatement(tenantId, projectId, request);
    },

    // Load data and return in frontend format
    async loadFrontendData(tenantId: string, projectId: string): Promise<FrontendIncomeStatementData> {
        try {
            const backendData = await this.getIncomeStatement(tenantId, projectId);
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
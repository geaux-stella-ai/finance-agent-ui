import apiClient from '@/lib/api-client';

export interface Parameter {
    project_id: string;
    parameter_key: string;
    parameter_value: number | null;
    parameter_text: string | null;
    data_type: 'decimal' | 'percentage' | 'text' | 'integer' | 'date';
    created_at: string;
    updated_at: string;
}

export interface ParameterUpdate {
    parameter_value?: number;
    parameter_text?: string;
    data_type?: 'decimal' | 'percentage' | 'text' | 'integer' | 'date';
}

// Parameter key mappings between frontend and backend
export const PARAMETER_KEY_MAP = {
    normalizedTaxRate: 'normalized_tax_rate',
    normalizedNetWorkingCapital: 'normalized_net_working_capital',
    exitRevenueMultiple: 'exit_revenue_multiple',
    discountRate: 'discount_rate',
    terminalValueModel: 'terminal_value_model',
    terminalGrowthRate: 'terminal_growth_rate',
    terminalGrowthRateH: 'terminal_growth_rate_h',
    halfLifePeriod: 'half_life_period',
    revenueMultiple: 'revenue_multiple',
    revenueMarketComparables: 'revenue_market_comparables',
    ebitdaMultiple: 'ebitda_multiple',
    ebitdaMarketComparables: 'ebitda_market_comparables',
    valuationDate: 'valuation_date',
} as const;

export const parameterAPI = {
    // Get all parameters for a project
    async getParameters(tenantId: string, projectId: string): Promise<Parameter[]> {
        const response = await apiClient.get(`/api/v1/tenants/${tenantId}/projects/${projectId}/parameters`);
        return response.data;
    },

    // Get a specific parameter
    async getParameter(tenantId: string, projectId: string, parameterKey: string): Promise<Parameter> {
        const response = await apiClient.get(`/api/v1/tenants/${tenantId}/projects/${projectId}/parameters/${parameterKey}`);
        return response.data;
    },

    // Create or update a parameter
    async saveParameter(
        tenantId: string, 
        projectId: string, 
        parameterKey: string, 
        update: ParameterUpdate
    ): Promise<Parameter> {
        const response = await apiClient.put(
            `/api/v1/tenants/${tenantId}/projects/${projectId}/parameters/${parameterKey}`,
            update
        );
        return response.data;
    },

    // Delete a parameter
    async deleteParameter(tenantId: string, projectId: string, parameterKey: string): Promise<void> {
        await apiClient.delete(`/api/v1/tenants/${tenantId}/projects/${projectId}/parameters/${parameterKey}`);
    },

    // Save multiple parameters at once
    async saveParameters(
        tenantId: string,
        projectId: string,
        parameters: Record<string, { value: number | string; dataType: 'decimal' | 'percentage' | 'text' | 'date' }>
    ): Promise<Parameter[]> {
        const results: Parameter[] = [];
        
        for (const [frontendKey, { value, dataType }] of Object.entries(parameters)) {
            const backendKey = PARAMETER_KEY_MAP[frontendKey as keyof typeof PARAMETER_KEY_MAP];
            if (backendKey && value !== undefined) {
                try {
                    const updateData: ParameterUpdate = {
                        data_type: dataType,
                    };
                    
                    // Use parameter_text for text and date data types, parameter_value for numeric types
                    if (dataType === 'text' || dataType === 'date') {
                        updateData.parameter_text = value as string;
                    } else {
                        updateData.parameter_value = value as number;
                    }
                    
                    const result = await this.saveParameter(tenantId, projectId, backendKey, updateData);
                    results.push(result);
                } catch (error) {
                    console.error(`Failed to save parameter ${backendKey}:`, error);
                    throw error;
                }
            }
        }
        
        return results;
    },

    // Load parameters and convert to frontend format
    async loadParametersForForm(tenantId: string, projectId: string): Promise<Record<string, number | string>> {
        const parameters = await this.getParameters(tenantId, projectId);
        const formData: Record<string, number | string> = {};
        
        // Convert backend parameter keys to frontend keys
        const reverseMap = Object.fromEntries(
            Object.entries(PARAMETER_KEY_MAP).map(([frontend, backend]) => [backend, frontend])
        );
        
        parameters.forEach(param => {
            const frontendKey = reverseMap[param.parameter_key];
            if (frontendKey) {
                // Handle text and date parameters
                if ((param.data_type === 'text' || param.data_type === 'date') && param.parameter_text !== null) {
                    formData[frontendKey] = param.parameter_text;
                }
                // Handle numeric parameters
                else if (param.parameter_value !== null) {
                    // Convert percentage values from decimal to percentage for display
                    if (param.data_type === 'percentage') {
                        formData[frontendKey] = param.parameter_value * 100;
                    } else {
                        formData[frontendKey] = param.parameter_value;
                    }
                }
            }
        });
        
        return formData;
    },
};
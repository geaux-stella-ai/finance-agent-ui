export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    email: string;
    avatar?: string;
}

export interface FinancialMetric {
    name: string;
    value: number;
    unit: string;
    trend?: 'up' | 'down' | 'stable';
    change?: number;
}

export interface ProjectMilestone {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    completedAt?: string;
}

export interface ProjectDocument {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'xlsx' | 'pptx' | 'other';
    url: string;
    uploadedAt: string;
    uploadedBy: string;
}

export interface Project {
    id: string;
    tenant_id: string;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
}

export interface ProjectCreate {
    name: string;
    description?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    next_token?: string;
}

// Sample data generator function for development
export function generateSampleProject(id: string): Project {
    return {
        id,
        tenant_id: 'sample-tenant',
        name: 'Sample Project',
        description: 'This is a sample project for development purposes',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
} 
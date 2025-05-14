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
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    client?: {
        name: string;
        industry: string;
    };
}

// Sample data generator function
export function generateSampleProject(id: string): Project {
    return {
        id,
        name: 'OpenAI - 409A ',
        description: 'OpenAI is a company that is valued at $100 billion. We are doing a 409A valuation for them.',
        createdAt: '2024-03-15',
        updatedAt: '2024-03-15',
        client: {
            name: 'OpenAI',
            industry: 'Technology',
        },
    };
} 
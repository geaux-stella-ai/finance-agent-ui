export type FileFormat = 'csv' | 'xlsx';

export type TabularDocumentType = 'balance_sheet' | 'income_statement';

export interface ProjectDocument {
    id: string;
    name: string;
    type: TabularDocumentType;
    company: string;
    annotation?: string;
    file_size_byte: number;
    full_table_name: string;
    project_id: string;
    created_at: string;
}

// Remove fake documents as we'll fetch from backend

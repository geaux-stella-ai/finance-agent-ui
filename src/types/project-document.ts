export type FileFormat = 'csv' | 'xlsx';

export type FinancialDocumentType = 'balance_sheet' | 'income_statement' | 'other';

export interface ProjectDocument {
    id: string;
    fileName: string;
    fileFormat: FileFormat;
    financialDocumentType: FinancialDocumentType;
    url: string;
    uploadedAt: Date;
}

export const fakeProjectDocument1: ProjectDocument = {
    id: '1',
    fileName: 'balance_sheet.csv',
    fileFormat: 'csv',
    financialDocumentType: 'balance_sheet',
    url: 'https://www.google.com',
    uploadedAt: new Date('2025-01-01T00:00:00.000Z'),
}

export const fakeProjectDocument2: ProjectDocument = {
    id: '2',
    fileName: 'income_statement.csv',
    fileFormat: 'csv',
    financialDocumentType: 'income_statement',
    url: 'https://www.google.com',
    uploadedAt: new Date('2025-01-01T00:00:00.000Z'),
}

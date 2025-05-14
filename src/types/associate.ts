export type AssociateSpecialization =
    'Scoping'
    | 'Market Research'
    | 'Information Request'
    | 'PBC extractor'
    | 'Financial Modeling'
    | 'Report drafting'

export interface Associate {
    id: string;
    specialization: AssociateSpecialization;
    description?: string;
}

export const getAllAssociates = (): Associate[] => {
    return [
        {
            id: '0',
            specialization: 'Scoping',
            description: 'Review client\'s data, based on transaction background and fact pattern, make a recommendations of scope of work, and the purpose of the valuation, and applicable financial reporting and tax reporting requirements.',
        },
        {
            id: '1',
            specialization: 'Market Research',
            description: 'Market research, including industry research, economic research, etc.',
        },
        {
            id: '2',
            specialization: 'Information Request',
            description: 'Review client\'s data, transaction background, and scope of work, come up with a list of information needed from the client.',
        },
        {
            id: '3',
            specialization: 'PBC extractor',
            description: 'Extract data provided by client (PBC) and generate a summary.',
        },
        {
            id: '4',
            specialization: 'Financial Modeling',
            description: 'Load data into financial model, run sensitivity analysis, make recommendations of valuation assumptions, lay out thought process, and generate a preliminary financial report, needs to be math error free.',
        },
        {
            id: '5',
            specialization: 'Report drafting',
            description: 'Draft valuation report.',
        },
    ];
};

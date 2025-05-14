export type AssociateSpecialization =
    | 'Investment Analysis'
    | 'Risk Management'
    | 'Financial Planning'
    | 'Market Research'
    | 'Compliance'
    | 'Tax Planning'
    | 'Corporate Finance';

export interface Associate {
    id: string;
    name: string;
    specialization: AssociateSpecialization;
}

// Helper function to generate a sample associate
export const generateSampleAssociate = (id: string): Associate => {
    const specializations: AssociateSpecialization[] = [
        'Investment Analysis',
        'Risk Management',
        'Financial Planning',
        'Market Research',
        'Compliance',
        'Tax Planning',
        'Corporate Finance'
    ];

    return {
        id,
        name: `Associate ${id}`,
        specialization: specializations[Math.floor(Math.random() * specializations.length)],
    };
}; 
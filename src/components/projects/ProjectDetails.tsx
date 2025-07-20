import { Project } from '@/types/project';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { AssumptionsForm, IncomeStatementSection, BalanceSheetSection } from '@/components/dcf';
import { DCFAssumptions } from '@/components/dcf/forms/assumptions-schema';

interface ProjectDetailsProps {
    project: Project;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
    const [dcfOpen, setDcfOpen] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const [dcfResults, setDcfResults] = useState<any>(null);
    const [incomeStatementData, setIncomeStatementData] = useState({});
    const [balanceSheetData, setBalanceSheetData] = useState({});

    const handleDcfSubmit = async (data: DCFAssumptions) => {
        setIsCalculating(true);

        try {
            // TODO: Integrate with backend API to calculate DCF
            console.log("DCF Assumptions:", data);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock results for now
            setDcfResults({
                npv: 1250000,
                irr: 15.3,
                paybackPeriod: 3.2,
                terminalValue: 8500000,
            });

        } catch (error) {
            console.error("Error calculating DCF:", error);
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="space-y-8">
                <div className="bg-card rounded-lg p-6 flex flex-col gap-6 max-w-xl ml-auto">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-4xl font-bold tracking-tight mb-2">{project.name}</h1>
                        <div className="text-muted-foreground text-base mb-2">{project.description}</div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="inline-block"><span className="font-semibold">Created:</span> {new Date(project.created_at).toLocaleDateString()}</span>
                            <span className="inline-block"><span className="font-semibold">Last Updated:</span> {new Date(project.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className={`flex flex-col gap-2 ${dcfOpen ? 'min-h-[80px]' : ''}`}>
                        <button
                            className="flex items-center gap-2 mb-2 w-full text-left focus:outline-none"
                            onClick={() => setDcfOpen((open) => !open)}
                            aria-expanded={dcfOpen}
                        >
                            <h2 className="text-2xl font-semibold flex-1">DCF Assumptions</h2>
                            <ChevronDown className={`transition-transform duration-200 ${dcfOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {dcfOpen && (
                            <div className="space-y-6">
                                <AssumptionsForm
                                    onSubmit={handleDcfSubmit}
                                    isLoading={isCalculating}
                                />

                                {dcfResults && (
                                    <div className="mt-8 p-6 bg-muted border border-border rounded-lg">
                                        <h3 className="text-lg font-semibold text-foreground mb-4">
                                            Valuation Results
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-muted-foreground">Net Present Value:</span>
                                                <div className="text-lg font-bold text-foreground">
                                                    ${dcfResults.npv.toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium text-muted-foreground">IRR:</span>
                                                <div className="text-lg font-bold text-foreground">
                                                    {dcfResults.irr}%
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium text-muted-foreground">Payback Period:</span>
                                                <div className="text-lg font-bold text-foreground">
                                                    {dcfResults.paybackPeriod} years
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-medium text-muted-foreground">Terminal Value:</span>
                                                <div className="text-lg font-bold text-foreground">
                                                    ${dcfResults.terminalValue.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {/* Income Statement Section */}
                    <IncomeStatementSection
                        data={incomeStatementData}
                        onDataChange={setIncomeStatementData}
                    />
                    
                    {/* Balance Sheet Section */}
                    <BalanceSheetSection
                        data={balanceSheetData}
                        onDataChange={setBalanceSheetData}
                    />
                </div>
            </div>
        </div>
    );
}

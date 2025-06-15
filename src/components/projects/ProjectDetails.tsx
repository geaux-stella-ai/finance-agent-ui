import { Project } from '@/types/project';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ProjectDetailsProps {
    project: Project;
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {
    const [scopeOpen, setScopeOpen] = useState(false);
    const [requestedInfoOpen, setRequestedInfoOpen] = useState(false);
    const [deliverablesOpen, setDeliverablesOpen] = useState(false);

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
                    <div className={`flex flex-col gap-2 ${scopeOpen ? 'min-h-[80px]' : ''}`}>
                        <button
                            className="flex items-center gap-2 mb-2 w-full text-left focus:outline-none"
                            onClick={() => setScopeOpen((open) => !open)}
                            aria-expanded={scopeOpen}
                        >
                            <h2 className="text-2xl font-semibold flex-1">Scope of Work</h2>
                            <ChevronDown className={`transition-transform duration-200 ${scopeOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {scopeOpen && (
                            <div className="text-muted-foreground text-base italic">No scope of work details yet. Add project tasks or deliverables here.</div>
                        )}
                    </div>
                    <div className={`flex flex-col gap-2 ${requestedInfoOpen ? 'min-h-[80px]' : ''}`}>
                        <button
                            className="flex items-center gap-2 mb-2 w-full text-left focus:outline-none"
                            onClick={() => setRequestedInfoOpen((open) => !open)}
                            aria-expanded={requestedInfoOpen}
                        >
                            <h2 className="text-2xl font-semibold flex-1">Requested Information</h2>
                            <ChevronDown className={`transition-transform duration-200 ${requestedInfoOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {requestedInfoOpen && (
                            <div className="text-muted-foreground text-base italic">No requested information details yet. Add information requirements here.</div>
                        )}
                    </div>
                    <div className={`flex flex-col gap-2 ${deliverablesOpen ? 'min-h-[80px]' : ''}`}>
                        <button
                            className="flex items-center gap-2 mb-2 w-full text-left focus:outline-none"
                            onClick={() => setDeliverablesOpen((open) => !open)}
                            aria-expanded={deliverablesOpen}
                        >
                            <h2 className="text-2xl font-semibold flex-1">Deliverables</h2>
                            <ChevronDown className={`transition-transform duration-200 ${deliverablesOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {deliverablesOpen && (
                            <div className="text-muted-foreground text-base italic">No deliverables details yet. Add project deliverables here.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 
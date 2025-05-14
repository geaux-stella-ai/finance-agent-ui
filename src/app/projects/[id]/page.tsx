'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Project, generateSampleProject } from '@/types/project';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProjectSidebar from '@/components/projects/ProjectSidebar';

export default function ProjectPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [scopeOpen, setScopeOpen] = useState(false);
    const [requestedInfoOpen, setRequestedInfoOpen] = useState(false);
    const [deliverablesOpen, setDeliverablesOpen] = useState(false);

    useEffect(() => {
        // In a real application, this would be an API call
        // For now, we'll use the sample project generator
        const projectId = params.id as string;
        const sampleProject = generateSampleProject(projectId);
        setProject(sampleProject);
        setLoading(false);
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background/80 flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-background/80 flex items-center justify-center">
                <div className="text-lg">Project not found</div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-background/80">
            <div className="flex flex-col">
                <div className="p-2">
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Projects
                    </Button>
                </div>
                <ProjectSidebar />
            </div>
            <div className="flex-1 overflow-auto">
                <div className="container mx-auto px-4">
                    <div className="space-y-8">
                        <div className="bg-card rounded-lg p-6 flex flex-col gap-6 max-w-xl ml-auto">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-4xl font-bold tracking-tight mb-2">{project.name}</h1>
                                <div className="text-muted-foreground text-base mb-2">{project.description}</div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    {project.client && (
                                        <span className="inline-block"><span className="font-semibold">Client:</span> {project.client.name} ({project.client.industry})</span>
                                    )}
                                    <span className="inline-block"><span className="font-semibold">Created:</span> {new Date(project.createdAt).toLocaleDateString()}</span>
                                    <span className="inline-block"><span className="font-semibold">Last Updated:</span> {new Date(project.updatedAt).toLocaleDateString()}</span>
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
            </div>
        </div>
    );
} 
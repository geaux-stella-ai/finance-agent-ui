'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Project, generateSampleProject } from '@/types/project';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Team from '@/components/projects/ProjectSidebar';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip/tooltip';

export default function ProjectPage() {
    const params = useParams();
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    onClick={() => router.push('/projects')}
                                >
                                    <span className="text-lg font-bold">P</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Projects</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <Team />
            <ProjectDetails project={project} />
        </div>
    );
} 
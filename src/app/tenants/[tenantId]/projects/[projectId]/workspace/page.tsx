'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { getProject } from '@/lib/api/projects';
import Sidebar from '@/components/playground/Sidebar/Sidebar'
import { ChatArea } from '@/components/playground/ChatArea'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProjectWorkspacePage() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);
                setError(null);
                const tenantId = params.tenantId as string;
                const projectId = params.projectId as string;
                const projectData = await getProject(tenantId, projectId);
                setProject(projectData);
            } catch (err) {
                setError('Failed to load project');
                console.error('Error loading project:', err);
            } finally {
                setLoading(false);
            }
        };

        loadProject();
    }, [params.tenantId, params.projectId]);

    if (loading) {
        return (
            <div className="flex h-screen bg-background/80">
                <Sidebar />
                <div className="flex-1">
                    <div className="flex h-full items-center justify-center">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-[200px]" />
                            <Skeleton className="h-4 w-[300px]" />
                        </div>
                    </div>
                </div>
                <div className="w-[400px] border-l border-border p-6">
                    <Skeleton className="h-8 w-[200px] mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-[80%] mb-4" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-background/80">
                <Sidebar />
                <div className="flex-1">
                    <div className="flex h-full items-center justify-center">
                        <div className="text-destructive text-lg">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex h-screen bg-background/80">
                <Sidebar />
                <div className="flex-1">
                    <div className="flex h-full items-center justify-center">
                        <div className="text-lg">Project not found</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={
            <div className="flex h-screen bg-background/80">
                <Sidebar />
                <div className="flex-1">
                    <div className="flex h-full items-center justify-center">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-[200px]" />
                            <Skeleton className="h-4 w-[300px]" />
                        </div>
                    </div>
                </div>
                <div className="w-[400px] border-l border-border p-6">
                    <Skeleton className="h-8 w-[200px] mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-[80%] mb-4" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        }>
            <div className="flex h-screen bg-background/80">
                <Sidebar />
                <ChatArea />
                <div className="flex flex-col w-[400px] border-l border-border overflow-y-auto">
                    <ProjectDetails project={project} />
                </div>
            </div>
        </Suspense>
    )
} 
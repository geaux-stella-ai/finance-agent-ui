'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Project } from '@/types/project';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { getProject } from '@/lib/api/projects';
import Sidebar from '@/components/playground/Sidebar/Sidebar'
import { ChatArea } from '@/components/playground/ChatArea'
import { Suspense } from 'react'

export default function ProjectPage() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProject = async () => {
            try {
                setLoading(true);
                setError(null);
                const tenantId = localStorage.getItem('tenantId');
                if (!tenantId) {
                    throw new Error('Tenant ID not found');
                }
                const projectId = params.id as string;
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
    }, [params.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="text-destructive">{error}</div>;
    }

    if (!project) {
        return <div>Project not found</div>;
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="flex h-screen bg-background/80">
                <Sidebar />
                <ChatArea />
                <div className="flex flex-col w-[400px] border-l border-border">
                    <ProjectDetails project={project} />
                </div>
            </div>
        </Suspense>
    )
}

'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Project, generateSampleProject } from '@/types/project';
import { useRouter } from 'next/navigation';
import ProjectDetails from '@/components/projects/ProjectDetails';

import Sidebar from '@/components/playground/Sidebar/Sidebar'
import { ChatArea } from '@/components/playground/ChatArea'
import { Suspense } from 'react'

export default function Home() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real application, this would be an API call
        // For now, we'll use the sample project generator
        const projectId = params.id as string;
        const sampleProject = generateSampleProject(projectId);
        setProject(sampleProject);
        setLoading(false);
    }, [params.id]);

    if (loading) {
        return <div>Loading...</div>;
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

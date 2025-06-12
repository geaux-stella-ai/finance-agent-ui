'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Project, ProjectCreate } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TextArea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { createProject, listProjects } from '@/lib/api/projects';

export default function ProjectsPage() {
    const router = useRouter();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nextToken, setNextToken] = useState<string | undefined>();
    const [newProject, setNewProject] = useState<ProjectCreate>({
        name: '',
        description: '',
    });

    const loadProjects = async (pageToken?: string) => {
        try {
            setLoading(true);
            setError(null);
            // TODO: Get tenant ID from auth context
            const tenantId = 'current-tenant-id';
            const response = await listProjects(tenantId, 10, pageToken);
            if (pageToken) {
                setProjects(prev => [...prev, ...response.items]);
            } else {
                setProjects(response.items);
            }
            setNextToken(response.next_token);
        } catch (err) {
            setError('Failed to load projects');
            console.error('Error loading projects:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const handleCreateProject = async () => {
        try {
            setError(null);
            // TODO: Get tenant ID from auth context
            const tenantId = 'current-tenant-id';
            const project = await createProject(tenantId, newProject);
            setProjects(prev => [project, ...prev]);
            setNewProject({
                name: '',
                description: '',
            });
            setIsCreateDialogOpen(false);
        } catch (err) {
            setError('Failed to create project');
            console.error('Error creating project:', err);
        }
    };

    const handleLoadMore = () => {
        if (nextToken) {
            loadProjects(nextToken);
        }
    };

    return (
        <div className="min-h-screen bg-background/80">
            <div className="container mx-auto px-4 py-20">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight mb-2">Projects</h1>
                    </div>
                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-brand text-white hover:bg-brand/90">
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Project</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Project Name</Label>
                                    <Input
                                        id="name"
                                        value={newProject.name}
                                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                        placeholder="Enter project name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <TextArea
                                        id="description"
                                        value={newProject.description || ''}
                                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                        placeholder="Enter project description"
                                    />
                                </div>
                                {error && <div className="text-destructive text-sm">{error}</div>}
                                <Button
                                    className="w-full bg-brand text-white hover:bg-brand/90"
                                    onClick={handleCreateProject}
                                >
                                    Create Project
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                {error && <div className="text-destructive mb-4">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow cursor-pointer"
                            onClick={() => router.push(`/projects/${project.id}`)}
                        >
                            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                            <p className="text-muted-foreground mb-4">{project.description}</p>
                            <div className="text-sm text-muted-foreground">
                                Created: {new Date(project.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>

                {loading && <div className="text-center mt-8">Loading...</div>}

                {nextToken && !loading && (
                    <div className="text-center mt-8">
                        <Button
                            variant="outline"
                            onClick={handleLoadMore}
                            disabled={loading}
                        >
                            Load More
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
} 
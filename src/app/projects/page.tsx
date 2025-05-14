'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Project, generateSampleProject } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TextArea } from '@/components/ui/textarea';

// Generate sample projects
const sampleProjects: Project[] = [
    generateSampleProject('1'),
    generateSampleProject('2'),
    generateSampleProject('3'),
];

export default function ProjectsPage() {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>(sampleProjects);
    const [newProject, setNewProject] = useState<Partial<Project>>({
        name: '',
        description: '',
        client: {
            name: '',
            industry: '',
        },
    });

    const handleCreateProject = () => {
        const project: Project = {
            id: Math.random().toString(36).substr(2, 9),
            name: newProject.name || '',
            description: newProject.description || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            client: newProject.client || {
                name: '',
                industry: '',
            },
        };

        setProjects([...projects, project]);
        setNewProject({
            name: '',
            description: '',
            client: {
                name: '',
                industry: '',
            },
        });
        setIsCreateDialogOpen(false);
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
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, name: e.target.value })}
                                        placeholder="Enter project name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <TextArea
                                        id="description"
                                        value={newProject.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProject({ ...newProject, description: e.target.value })}
                                        placeholder="Enter project description"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientName">Client Name</Label>
                                    <Input
                                        id="clientName"
                                        value={newProject.client?.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({
                                            ...newProject,
                                            client: {
                                                name: e.target.value,
                                                industry: newProject.client?.industry || ''
                                            }
                                        })}
                                        placeholder="Enter client name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clientIndustry">Client Industry</Label>
                                    <Input
                                        id="clientIndustry"
                                        value={newProject.client?.industry}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({
                                            ...newProject,
                                            client: {
                                                name: newProject.client?.name || '',
                                                industry: e.target.value
                                            }
                                        })}
                                        placeholder="Enter client industry"
                                    />
                                </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div
                            key={project.id}
                            className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
                        >
                            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                            <p className="text-muted-foreground mb-4">{project.description}</p>

                            {project.client && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-medium mb-1">Client</h3>
                                    <p className="text-muted-foreground text-sm">{project.client.name}</p>
                                </div>
                            )}

                            <div className="text-sm text-muted-foreground">
                                Created: {new Date(project.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import apiClient from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TextArea } from '@/components/ui/textarea'

interface Project {
    id: string
    name: string
    description: string
    created_at: string
}

interface ProjectsResponse {
    items: Project[]
    next_token?: string
}

export default function TenantProjectsPage() {
    const params = useParams()
    const { toast } = useToast()
    const [projects, setProjects] = useState<Project[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [newProject, setNewProject] = useState({ name: '', description: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchProjects = async () => {
        try {
            const response = await apiClient.get<ProjectsResponse>(`/api/v1/tenants/${params.tenantId}/projects`)
            if (response.status === 200) {
                setProjects(response.data.items || [])
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error)
            toast({
                title: "Error",
                description: "Failed to load projects",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchProjects()
    }, [params.tenantId, toast])

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await apiClient.post(
                `/api/v1/tenants/${params.tenantId}/projects`,
                newProject
            )

            if (response.status === 201) {
                toast({
                    title: "Success",
                    description: "Project created successfully",
                })
                setIsCreateModalOpen(false)
                setNewProject({ name: '', description: '' })
                fetchProjects() // Refresh the projects list
            }
        } catch (error) {
            console.error('Failed to create project:', error)
            toast({
                title: "Error",
                description: "Failed to create project",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-center h-64">
                    <p>Loading projects...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Projects</h1>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-brand text-white hover:bg-brand/90">Create Project</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Project</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Project Name</Label>
                                <Input
                                    id="name"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    placeholder="Enter project name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <TextArea
                                    id="description"
                                    value={newProject.description}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                                    required
                                    placeholder="Enter project description"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsCreateModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="bg-brand text-white hover:bg-brand/90">
                                    {isSubmitting ? 'Creating...' : 'Create Project'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-muted-foreground">No projects found</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project: Project) => (
                        <div
                            key={project.id}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                        >
                            <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                            <p className="text-muted-foreground mb-4">{project.description}</p>
                            <p className="text-sm text-muted-foreground">
                                Created: {new Date(project.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
} 
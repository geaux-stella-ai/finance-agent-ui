import apiClient from '../api-client';
import { Project, ProjectCreate, PaginatedResponse } from '@/types/project';

export async function createProject(tenantId: string, project: ProjectCreate): Promise<Project> {
    const response = await apiClient.post(`/api/v1/tenants/${tenantId}/projects`, project);
    return response.data;
}

export async function listProjects(
    tenantId: string,
    pageSize: number = 10,
    pageToken?: string
): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams();
    params.append('page_size', pageSize.toString());
    if (pageToken) {
        params.append('page_token', pageToken);
    }

    const response = await apiClient.get(`/api/v1/tenants/${tenantId}/projects?${params.toString()}`);
    return response.data;
}

export async function getProject(tenantId: string, projectId: string): Promise<Project> {
    const response = await apiClient.get(`/api/v1/tenants/${tenantId}/projects/${projectId}`);
    return response.data;
} 
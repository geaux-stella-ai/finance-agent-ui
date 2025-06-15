import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import { APIRoutes } from './routes'

import { Agent, ComboboxAgent, SessionEntry } from '@/types/playground'
import { useAuthStore } from '@/store/auth'

export const getAllProjectSessionsAPI = async (
  base: string,
  tenantId: string,
  projectId: string,
  agentId: string
): Promise<SessionEntry[]> => {
  const url = APIRoutes.GetProjectSessions(base, tenantId, projectId, agentId)
  try {
    const response = await apiClient.get(url)
    if (response.status !== 200) {
      if (response.status === 404) {
        toast.error('No sessions found for this agent')
        return []
      }
      throw new Error(`Failed to fetch sessions: ${response.statusText}`)
    }
    return response.data as SessionEntry[]
  } catch (error) {
    toast.error('Error fetching project sessions')
    return []
  }
}


export const getProjectAgentsAPI = async (
  endpoint: string,
  tenantId: string,
  projectId: string
): Promise<ComboboxAgent[]> => {
  const url = APIRoutes.GetProjectAgents(endpoint, tenantId, projectId)
  try {
    const { data } = await apiClient.get(url)
    const agents: ComboboxAgent[] = data.map((item: Agent) => ({
      value: item.agent_id || '',
      label: item.name || '',
      model: item.model || '',
      storage: item.storage || false
    }))
    return agents
  } catch (error) {
    toast.error('Error fetching project agents')
    return []
  }
}

export const getPlaygroundAgentsAPI = async (
  endpoint: string
): Promise<ComboboxAgent[]> => {
  const url = APIRoutes.GetPlaygroundAgents(endpoint)
  try {
    const response = await fetch(url, { method: 'GET' })
    if (!response.ok) {
      toast.error(`Failed to fetch playground agents: ${response.statusText}`)
      return []
    }
    const data = await response.json()
    // Transform the API response into the expected shape.
    const agents: ComboboxAgent[] = data.map((item: Agent) => ({
      value: item.agent_id || '',
      label: item.name || '',
      model: item.model || '',
      storage: item.storage || false
    }))
    return agents
  } catch {
    toast.error('Error fetching playground agents')
    return []
  }
}

export const getPlaygroundStatusAPI = async (base: string): Promise<number> => {
  const response = await fetch(APIRoutes.PlaygroundStatus(base), {
    method: 'GET'
  })
  return response.status
}

export const getWorkspaceStatusAPI = async (base: string,
  tenantId: string,
  projectId: string
): Promise<number> => {
  try {
    const response = await fetch(`${base}/api/v1/tenants/${tenantId}/projects/${projectId}/workspace/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${useAuthStore.getState().token}`
      }
    })
    return response.status
  } catch (error) {
    console.error('Error checking workspace status:', error)
    return 500
  }
}

export const getAllPlaygroundSessionsAPI = async (
  base: string,
  agentId: string
): Promise<SessionEntry[]> => {
  try {
    const response = await fetch(
      APIRoutes.GetPlaygroundSessions(base, agentId),
      {
        method: 'GET'
      }
    )
    if (!response.ok) {
      if (response.status === 404) {
        // Return empty array when storage is not enabled
        return []
      }
      throw new Error(`Failed to fetch sessions: ${response.statusText}`)
    }
    return response.json()
  } catch {
    return []
  }
}

export const getPlaygroundSessionAPI = async (
  base: string,
  agentId: string,
  sessionId: string
) => {
  const response = await fetch(
    APIRoutes.GetPlaygroundSession(base, agentId, sessionId),
    {
      method: 'GET'
    }
  )
  return response.json()
}

export const deletePlaygroundSessionAPI = async (
  base: string,
  agentId: string,
  sessionId: string
) => {
  const response = await fetch(
    APIRoutes.DeletePlaygroundSession(base, agentId, sessionId),
    {
      method: 'DELETE'
    }
  )
  return response
}

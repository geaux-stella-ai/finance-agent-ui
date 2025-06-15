export const APIRoutes = {
  GetPlaygroundAgents: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/v1/playground/agents`,
  AgentRun: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/v1/playground/agents/{agent_id}/runs`,
  PlaygroundStatus: (PlaygroundApiUrl: string) =>
    `${PlaygroundApiUrl}/v1/playground/status`,
  GetPlaygroundSessions: (PlaygroundApiUrl: string, agentId: string) =>
    `${PlaygroundApiUrl}/v1/playground/agents/${agentId}/sessions`,
  GetPlaygroundSession: (
    PlaygroundApiUrl: string,
    agentId: string,
    sessionId: string
  ) =>
    `${PlaygroundApiUrl}/v1/playground/agents/${agentId}/sessions/${sessionId}`,

  DeletePlaygroundSession: (
    PlaygroundApiUrl: string,
    agentId: string,
    sessionId: string
  ) =>
    `${PlaygroundApiUrl}/v1/playground/agents/${agentId}/sessions/${sessionId}`,

  GetProjectSessions: (
    BaseUrl: string,
    tenantId: string,
    projectId: string,
    agentId: string
  ) =>
    `${BaseUrl}/api/v1/tenants/${tenantId}/projects/${projectId}/agents/${agentId}/sessions`,

  GetProjectAgents: (BaseUrl: string, tenantId: string, projectId: string) =>
    `${BaseUrl}/api/v1/tenants/${tenantId}/projects/${projectId}/agents`,

  ProjectAgentRun: (BaseUrl: string, tenantId: string, projectId: string, agentId: string) =>
    `${BaseUrl}/api/v1/tenants/${tenantId}/projects/${projectId}/agents/${agentId}/run`,
}

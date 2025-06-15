import { useParams } from 'next/navigation'

export const useWorkspaceParams = () => {
    const params = useParams()

    return {
        tenantId: params?.tenantId as string,
        projectId: params?.projectId as string
    }
} 
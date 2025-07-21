'use client'

import { useEffect } from 'react'
import { useWorkspaceParams } from '@/hooks/useWorkspaceParams'
import { useModel } from '@/contexts/ModelContext'
import { getDcfModel } from '@/lib/api/dcf'
import DCFResultsTable from './DCFResultsTable'

const ModelResultsView = () => {
  const { tenantId, projectId } = useWorkspaceParams()
  const { 
    modelData, 
    setModelData, 
    isModelLoading, 
    setIsModelLoading, 
    modelError, 
    setModelError 
  } = useModel()

  const loadModelData = async () => {
    try {
      setIsModelLoading(true)
      setModelError(null)
      const data = await getDcfModel(tenantId, projectId)
      setModelData(data)
    } catch (error) {
      console.error('Error loading DCF model:', error)
      setModelError('Failed to load model data')
    } finally {
      setIsModelLoading(false)
    }
  }

  // Load model data when component mounts and when switching to this tab
  useEffect(() => {
    if (!modelData) {
      loadModelData()
    }
  }, [])

  return (
    <div className="flex h-full flex-col p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold">DCF Model Results</h2>
        <p className="text-muted-foreground">
          View your discounted cash flow model calculations
        </p>
      </div>

      {!modelData && !isModelLoading && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-muted-foreground">
              No model results available
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Click "Build Model" in the right panel to generate DCF results
            </p>
          </div>
        </div>
      )}

      {isModelLoading && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <div className="mt-4 text-lg font-medium">Building model...</div>
            <p className="text-sm text-muted-foreground">
              This may take a few moments
            </p>
          </div>
        </div>
      )}

      {modelError && (
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-medium text-destructive">
              Error loading model
            </div>
            <p className="text-sm text-muted-foreground mt-2">{modelError}</p>
          </div>
        </div>
      )}

      {modelData && (
        <div className="flex-1 overflow-auto">
          <DCFResultsTable modelData={modelData} />
        </div>
      )}
    </div>
  )
}

export default ModelResultsView
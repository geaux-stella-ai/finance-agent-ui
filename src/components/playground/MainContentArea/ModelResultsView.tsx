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
    } catch (error: any) {
      console.error('Error loading DCF model:', error)
      
      // Use specific error message from API if available
      const errorMessage = error.message || 'Failed to load model data'
      setModelError(errorMessage)
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
          <div className="text-center max-w-md mx-auto">
            <div className="text-lg font-medium text-destructive mb-3">
              Error loading model
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <p className="text-sm text-destructive">{modelError}</p>
            </div>
            <div className="space-y-2">
              <button
                onClick={loadModelData}
                disabled={isModelLoading}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isModelLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Retrying...
                  </>
                ) : (
                  'Try Again'
                )}
              </button>
              <p className="text-xs text-muted-foreground">
                If the error persists, please check your financial data and model parameters
              </p>
            </div>
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
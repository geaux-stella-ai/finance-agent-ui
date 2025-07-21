'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { DCFModel } from '@/lib/api/dcf'

interface ModelContextType {
  activeTab: 'chat' | 'model' | 'reports'
  setActiveTab: (tab: 'chat' | 'model' | 'reports') => void
  modelData: DCFModel | null
  setModelData: (data: DCFModel | null) => void
  isModelLoading: boolean
  setIsModelLoading: (loading: boolean) => void
  modelError: string | null
  setModelError: (error: string | null) => void
  triggerModelBuild: () => void
}

const ModelContext = createContext<ModelContextType | undefined>(undefined)

export function ModelProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<'chat' | 'model' | 'reports'>('chat')
  const [modelData, setModelData] = useState<DCFModel | null>(null)
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [modelError, setModelError] = useState<string | null>(null)

  const triggerModelBuild = () => {
    setActiveTab('model')
  }

  return (
    <ModelContext.Provider
      value={{
        activeTab,
        setActiveTab,
        modelData,
        setModelData,
        isModelLoading,
        setIsModelLoading,
        modelError,
        setModelError,
        triggerModelBuild,
      }}
    >
      {children}
    </ModelContext.Provider>
  )
}

export function useModel() {
  const context = useContext(ModelContext)
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider')
  }
  return context
}
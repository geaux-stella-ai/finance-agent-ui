'use client'

import ChatContent from './ChatContent'
import ModelResultsView from './ModelResultsView'
import { useModel } from '@/contexts/ModelContext'
import { cn } from '@/lib/utils'

const MainContentArea = () => {
  const { activeTab, setActiveTab } = useModel()

  const handleTabChange = (tab: 'chat' | 'model' | 'reports') => {
    setActiveTab(tab)
  }

  return (
    <main className="relative m-1.5 flex flex-grow flex-col rounded-xl bg-background">
      {/* Tab Navigation */}
      <div className="border-b border-border px-4 py-2">
        <div className="flex space-x-1">
          <button
            onClick={() => handleTabChange('chat')}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              "focus:outline-none focus:!bg-white focus:!text-black focus:ring-2 focus:ring-blue-500",
              activeTab === 'chat' 
                ? 'bg-white text-black hover:bg-gray-100 border border-gray-300' 
                : 'bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground'
            )}
          >
            Chat
          </button>
          <button
            onClick={() => handleTabChange('model')}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              "focus:outline-none focus:!bg-white focus:!text-black focus:ring-2 focus:ring-blue-500",
              activeTab === 'model' 
                ? 'bg-white text-black hover:bg-gray-100 border border-gray-300' 
                : 'bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground'
            )}
          >
            Model Results
          </button>
          <button
            onClick={() => handleTabChange('reports')}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              "focus:outline-none focus:!bg-white focus:!text-black focus:ring-2 focus:ring-blue-500",
              activeTab === 'reports' 
                ? 'bg-white text-black hover:bg-gray-100 border border-gray-300' 
                : 'bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground'
            )}
          >
            Reports
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <ChatContent />}
        {activeTab === 'model' && <ModelResultsView />}
        {activeTab === 'reports' && (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Reports coming soon...
          </div>
        )}
      </div>
    </main>
  )
}

export default MainContentArea

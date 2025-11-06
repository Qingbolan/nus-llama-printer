import { useState } from "react"
import { FileIcon, SearchIcon, GitBranchIcon, PackageIcon } from "lucide-react"
import { FileTree } from "./FileTree"
import { FileInfo } from "@/ipc"

interface SidebarTabsProps {
  onFileSelect: (file: FileInfo) => void
}

type TabId = "files" | "search" | "git" | "extensions"

interface Tab {
  id: TabId
  icon: React.ReactNode
  label: string
  content: React.ReactNode
}

export function SidebarTabs({ onFileSelect }: SidebarTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("files")

  const tabs: Tab[] = [
    {
      id: "files",
      icon: <FileIcon className="w-4 h-4" />,
      label: "Explorer",
      content: <FileTree onFileSelect={onFileSelect} />
    },
    {
      id: "search",
      icon: <SearchIcon className="w-4 h-4" />,
      label: "Search",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
          <SearchIcon className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm font-medium">Search functionality</p>
          <p className="text-xs mt-1 opacity-70">Coming soon</p>
        </div>
      )
    },
    {
      id: "git",
      icon: <GitBranchIcon className="w-4 h-4" />,
      label: "Source Control",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
          <GitBranchIcon className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm font-medium">Git integration</p>
          <p className="text-xs mt-1 opacity-70">Coming soon</p>
        </div>
      )
    },
    {
      id: "extensions",
      icon: <PackageIcon className="w-4 h-4" />,
      label: "Extensions",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
          <PackageIcon className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm font-medium">Extensions</p>
          <p className="text-xs mt-1 opacity-70">Coming soon</p>
        </div>
      )
    },
  ]

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Tab buttons - horizontal bar on top */}
      <div className="flex items-center justify-center gap-0.5 px-2 h-10 border-b border-border/50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              group relative p-2 rounded-md transition-all duration-200
              ${
                activeTab === tab.id
                  ? "text-cyan-600 dark:text-cyan-400"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }
            `}
            title={tab.label}
          >
            <div className={`transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-105'}`}>
              {tab.icon}
            </div>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-transparent via-cyan-500 to-transparent rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTabContent}
      </div>
    </div>
  )
}

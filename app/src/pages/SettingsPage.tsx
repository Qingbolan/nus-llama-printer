import { Settings, Terminal } from "lucide-react"
import { PageHeader } from "@/components/PageHeader"
import { usePrinterStore } from "@/store/printer-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { sshConfig, isConnected } = usePrinterStore()

  const handleOpenDevTools = async () => {
    try {
      const window = getCurrentWebviewWindow()
      // @ts-ignore - openDevtools exists but may not be in types
      if (window.openDevtools) {
        // @ts-ignore
        await window.openDevtools()
        toast.success('Developer Tools opened')
      } else {
        toast.error('Developer Tools not available')
      }
    } catch (error) {
      console.error('Failed to open DevTools:', error)
      toast.error('Failed to open Developer Tools: ' + String(error))
    }
  }

  return (
    <div className="h-full overflow-auto">
      {/* Content */}
      <div className="max-w-3xl mx-auto p-8">
        <div className="space-y-8">
          <PageHeader
            title="Settings"
            description="Application preferences and connection information"
            icon={<Settings className="w-8 h-8" />}
          />

          {/* Connection Settings */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Connection</h2>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Status</span>
                  {isConnected ? (
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/30">
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/30">
                      Disconnected
                    </Badge>
                  )}
                </div>
                {sshConfig && (
                  <div className="text-sm text-muted-foreground">
                    <div>Host: {sshConfig.host}</div>
                    <div>Port: {sshConfig.port}</div>
                    <div>Username: {sshConfig.username}</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Print Settings */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Print Settings</h2>
            <p className="text-sm text-muted-foreground">
              Print preferences will be available in future updates
            </p>
          </section>

          {/* Developer Tools */}
          <section>
            <h2 className="text-xl font-semibold mb-4">Developer Tools</h2>
            <div className="space-y-4">
              <div className="p-4 border border-border rounded-lg bg-muted/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Terminal className="w-4 h-4" />
                      <span className="text-sm font-medium">Browser Console</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Open the developer console to view logs, errors, and debug information
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Keyboard shortcut: <kbd className="px-2 py-1 bg-muted border border-border rounded">Cmd/Ctrl+Shift+I</kbd> or <kbd className="px-2 py-1 bg-muted border border-border rounded">F12</kbd>
                    </p>
                  </div>
                  <Button
                    onClick={handleOpenDevTools}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Terminal className="w-4 h-4" />
                    Open Console
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* About */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Print@SoC</strong> v0.1.0
              </p>
              <p className="text-muted-foreground">
                Smart printing for NUS School of Computing
              </p>
              <p className="text-muted-foreground">
                Built with Tauri, React, and Rust
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

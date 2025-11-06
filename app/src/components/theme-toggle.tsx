
import * as React from "react"
import { useTheme } from "@/lib/theme-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Simple icon components
function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  )
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

function MonitorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  )
}

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="w-full justify-start gap-2">
        <MonitorIcon className="h-4 w-4" />
        {!collapsed && <span>Theme</span>}
      </Button>
    )
  }

  // If collapsed, show icon for CURRENT theme
  if (collapsed) {
    const toggleTheme = () => {
      // Cycle through: light → dark → light
      if (theme === "light" || theme === "system") {
        setTheme("dark")
      } else {
        setTheme("light")
      }
    }

    // Show icon for CURRENT theme
    const currentIcon = (theme === "dark")
      ? <MoonIcon className="h-4 w-4" />      // Dark mode (show moon)
      : <SunIcon className="h-4 w-4" />       // Light mode (show sun)

    const tooltipText = (theme === "dark")
      ? "Dark Mode (click to switch to Light)"
      : "Light Mode (click to switch to Dark)"

    return (
      <button
        onClick={toggleTheme}
        title={tooltipText}
        className={cn(
          "w-full flex items-center justify-center px-2 py-2 rounded-lg text-sm transition-all duration-167 fluent-transition",
          "bg-primary/10 text-primary border border-primary/20"
        )}
      >
        {currentIcon}
      </button>
    )
  }

  // Expanded state shows two buttons in a grid
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setTheme("light")}
          title="Light theme"
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg text-xs transition-all duration-167 fluent-transition",
            theme === "light" || theme === "system"
              ? "bg-primary/10 text-primary border border-primary/20 fluent-shadow-xs"
              : "bg-sidebar-accent hover:bg-muted-hover text-muted-foreground border border-transparent"
          )}
        >
          <SunIcon className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium">Light</span>
        </button>

        <button
          onClick={() => setTheme("dark")}
          title="Dark theme"
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg text-xs transition-all duration-167 fluent-transition",
            theme === "dark"
              ? "bg-primary/10 text-primary border border-primary/20 fluent-shadow-xs"
              : "bg-sidebar-accent hover:bg-muted-hover text-muted-foreground border border-transparent"
          )}
        >
          <MoonIcon className="h-4 w-4 flex-shrink-0" />
          <span className="font-medium">Dark</span>
        </button>
      </div>
    </div>
  )
}

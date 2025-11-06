
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type SidebarContextValue = {
  collapsed: boolean
  toggle: () => void
  setCollapsed: (v: boolean) => void
  expandedWidth: number
  collapsedWidth: number
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function useRBSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error("useRBSidebar must be used within RBSidebarProvider")
  return ctx
}

export function RBSidebarProvider({
  children,
  expandedWidth = 260,
  collapsedWidth = 64,
}: {
  children: React.ReactNode
  expandedWidth?: number
  collapsedWidth?: number
}) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false
    try {
      const v = localStorage.getItem("rb_sidebar_collapsed")
      return v === "1"
    } catch {
      return false
    }
  })

  const applyWidthVar = useCallback(
    (isCollapsed: boolean) => {
      const w = isCollapsed ? collapsedWidth : expandedWidth
      if (typeof document !== "undefined") {
        document.documentElement.style.setProperty("--rb-sidebar-width", `${w}px`)
      }
    },
    [collapsedWidth, expandedWidth],
  )

  useEffect(() => {
    applyWidthVar(collapsed)
    try {
      localStorage.setItem("rb_sidebar_collapsed", collapsed ? "1" : "0")
    } catch {}
  }, [collapsed, applyWidthVar])

  useEffect(() => {
    // Ensure initial var is set on mount
    applyWidthVar(collapsed)
  }, [])

  const toggle = useCallback(() => setCollapsed((v) => !v), [])

  const value = useMemo(
    () => ({ collapsed, toggle, setCollapsed, expandedWidth, collapsedWidth }),
    [collapsed, toggle, expandedWidth, collapsedWidth],
  )

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export function RBSidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  // The aside visual shell; width driven by CSS var and transitions
  return (
    <aside
      className={className}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "var(--rb-sidebar-width)",
        height: "100vh",
        zIndex: 30,
        overflow: "hidden",
        backgroundColor: "hsl(var(--background) / 0.7)",
        backdropFilter: "blur(40px) saturate(150%)",
        WebkitBackdropFilter: "blur(40px) saturate(150%)",
        transition: "width 200ms ease",
      }}
    >
      {children}
    </aside>
  )
}
export function RBMainOffset({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={className}
      style={{
        marginLeft: "var(--rb-sidebar-width)",
        transition: "margin-left 200ms ease",
      }}
    >
      {children}
    </div>
  )
}


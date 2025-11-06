
import * as React from "react"
import { FluentProvider } from "@fluentui/react-components"
import { lightTheme, darkTheme } from "@/lib/fluent-theme"
import { useTheme } from "@/lib/theme-context"

interface FluentProviderWrapperProps {
  children: React.ReactNode
}

export function FluentProviderWrapper({ children }: FluentProviderWrapperProps) {
  const { resolvedTheme } = useTheme()

  return (
    <FluentProvider theme={resolvedTheme === "dark" ? darkTheme : lightTheme}>
      {children}
    </FluentProvider>
  )
}

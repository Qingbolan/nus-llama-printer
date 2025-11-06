
import { ConfigProvider } from "antd"
import type React from "react"

export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6366f1",
          borderRadius: 6,
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

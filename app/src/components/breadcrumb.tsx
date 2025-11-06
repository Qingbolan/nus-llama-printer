import { Link, useLocation } from "react-router-dom"
import { Breadcrumb } from "antd"
import { HomeOutlined } from "@ant-design/icons"
import { useI18n } from "@/lib/i18n"
import { useProjectStore } from "@/store"
import type { BreadcrumbItemType } from "antd/es/breadcrumb/Breadcrumb"

export function BreadcrumbNav() {
  const location = useLocation()
  const pathname = location.pathname
  const { t } = useI18n()
  const { projectName } = useProjectStore()

  // Route name mapping
  const routeNames: Record<string, string> = {
    "/": t("nav.welcome"),
    "/easypaper/projects": t("nav.projects"),
    "/easypaper/settings": t("nav.settings"),
  }

  // Generate breadcrumb items
  const items: BreadcrumbItemType[] = []

  // Add home icon (always linked to home unless we're on home)
  if (pathname === "/") {
    items.push({
      title: <HomeOutlined />,
    })
  } else {
    items.push({
      title: <Link to="/"><HomeOutlined /></Link>,
    })

    // Handle different routes
    if (pathname.startsWith("/easypaper/project/") && projectName) {
      // Add Projects link
      items.push({
        title: <Link to="/easypaper/projects">{t("nav.projects")}</Link>,
      })
      // Add project name (non-editable)
      items.push({
        title: projectName,
      })
    } else if (pathname === "/easypaper/projects") {
      items.push({
        title: routeNames[pathname],
      })
    } else if (pathname === "/easypaper/settings") {
      items.push({
        title: routeNames[pathname],
      })
    }
  }

  return (
    <Breadcrumb
      items={items}
      separator="/"
      style={{
        fontSize: '14px',
        color: '#888',
      }}
      className="[&_*]:!text-[#888] [&_a]:hover:!text-[#555]"
    />
  )
}

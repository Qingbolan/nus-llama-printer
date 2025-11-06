import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Locale = "en" | "zh"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations = {
  en: {
    // Navigation
    "nav.welcome": "Welcome",
    "nav.projects": "Projects",
    "nav.editor": "Editor",
    "nav.settings": "Settings",

    // Welcome Page
    "welcome.title": "Welcome to EasyPaper",
    "welcome.description": "A modern LaTeX editor with AI-powered features",
    "welcome.newProject": "New Project",
    "welcome.openProject": "Open Project",
    "welcome.recentProjects": "Recent Projects",

    // Editor
    "editor.file": "File",
    "editor.edit": "Edit",
    "editor.view": "View",
    "editor.build": "Build",
    "editor.compile": "Compile",
    "editor.compiling": "Compiling...",
    "editor.preview": "Preview",
    "editor.save": "Save",
    "editor.saveAll": "Save All",
    "editor.close": "Close",

    // Project
    "project.new": "New Project",
    "project.open": "Open Project",
    "project.save": "Save Project",
    "project.settings": "Project Settings",
    "project.name": "Project Name",
    "project.template": "Template",

    // Templates
    "template.article": "Article",
    "template.ieeetran": "IEEE Conference",
    "template.acmart": "ACM Article",
    "template.basic": "Basic Document",

    // Build
    "build.success": "Build Successful",
    "build.failed": "Build Failed",
    "build.errors": "Errors",
    "build.warnings": "Warnings",
    "build.viewLog": "View Log",

    // Common
    "common.cancel": "Cancel",
    "common.ok": "OK",
    "common.yes": "Yes",
    "common.no": "No",
    "common.delete": "Delete",
    "common.rename": "Rename",
    "common.create": "Create",
    "common.search": "Search",
  },
  zh: {
    // Navigation
    "nav.welcome": "欢迎",
    "nav.projects": "项目",
    "nav.editor": "编辑器",
    "nav.settings": "设置",

    // Welcome Page
    "welcome.title": "欢迎使用 EasyPaper",
    "welcome.description": "一个现代化的 LaTeX 编辑器，具有 AI 功能",
    "welcome.newProject": "新建项目",
    "welcome.openProject": "打开项目",
    "welcome.recentProjects": "最近项目",

    // Editor
    "editor.file": "文件",
    "editor.edit": "编辑",
    "editor.view": "视图",
    "editor.build": "构建",
    "editor.compile": "编译",
    "editor.compiling": "编译中...",
    "editor.preview": "预览",
    "editor.save": "保存",
    "editor.saveAll": "全部保存",
    "editor.close": "关闭",

    // Project
    "project.new": "新建项目",
    "project.open": "打开项目",
    "project.save": "保存项目",
    "project.settings": "项目设置",
    "project.name": "项目名称",
    "project.template": "模板",

    // Templates
    "template.article": "文章",
    "template.ieeetran": "IEEE 会议",
    "template.acmart": "ACM 文章",
    "template.basic": "基础文档",

    // Build
    "build.success": "构建成功",
    "build.failed": "构建失败",
    "build.errors": "错误",
    "build.warnings": "警告",
    "build.viewLog": "查看日志",

    // Common
    "common.cancel": "取消",
    "common.ok": "确定",
    "common.yes": "是",
    "common.no": "否",
    "common.delete": "删除",
    "common.rename": "重命名",
    "common.create": "创建",
    "common.search": "搜索",
  },
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(() => {
    const stored = localStorage.getItem("locale")
    return (stored === "zh" ? "zh" : "en") as Locale
  })

  useEffect(() => {
    localStorage.setItem("locale", locale)
  }, [locale])

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations["en"]] || key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider")
  }
  return context
}

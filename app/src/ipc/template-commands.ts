import { invoke } from "@tauri-apps/api/core"
import type { ApiResponse, Template } from "./types"

export async function templateList(): Promise<Template[]> {
  try {
    const response = await invoke<ApiResponse<Template[]>>("template_list")
    if (!response.ok || !response.data) {
      throw new Error(response.error || "Failed to list templates")
    }
    return response.data
  } catch (error) {
    // Fallback to mock data if Tauri is not available
    console.warn("Tauri invoke failed, using mock templates:", error)
    return [
      { id: "article", name: "Article", description: "Basic LaTeX article" },
      { id: "ieee", name: "IEEE Conference", description: "IEEE conference paper" },
      { id: "acm", name: "ACM Article", description: "ACM article format" },
    ]
  }
}

export async function templateApply(
  projectDir: string,
  templateId: string,
  projectName: string
): Promise<void> {
  const response = await invoke<ApiResponse<void>>("template_apply", {
    projectDir,
    templateId,
    projectName,
  })
  if (!response.ok) {
    throw new Error(response.error || "Failed to apply template")
  }
}

export async function templateGetContent(templateId: string): Promise<string> {
  const response = await invoke<ApiResponse<string>>("template_get_content", {
    templateId,
  })
  if (!response.ok || !response.data) {
    throw new Error(response.error || "Failed to get template content")
  }
  return response.data
}

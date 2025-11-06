import { invoke } from "@tauri-apps/api/core"
import type { ApiResponse, BuildResult } from "./types"

export async function buildCompile(projectDir: string): Promise<BuildResult> {
  const response = await invoke<ApiResponse<BuildResult>>("build_compile", {
    projectDir,
  })
  if (!response.ok || !response.data) {
    throw new Error(response.error || "Failed to compile")
  }
  return response.data
}

export async function buildClean(projectDir: string): Promise<void> {
  const response = await invoke<ApiResponse<void>>("build_clean", {
    projectDir,
  })
  if (!response.ok) {
    throw new Error(response.error || "Failed to clean build")
  }
}

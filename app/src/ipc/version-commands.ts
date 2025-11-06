import { invoke } from "@tauri-apps/api/core"
import type { ApiResponse } from "./types"

export interface VersionCommit {
  id: string
  timestamp: number
  message: string
  type: "save" | "compile"
  files: string[]
}

export interface VersionHistory {
  commits: VersionCommit[]
  currentCommit: string | null
}

/**
 * Initialize version control for a project
 * Creates .easypaper directory if it doesn't exist
 */
export async function versionInit(projectDir: string): Promise<void> {
  const response = await invoke<ApiResponse<void>>("version_init", {
    projectDir,
  })
  if (!response.ok) {
    throw new Error(response.error || "Failed to initialize version control")
  }
}

/**
 * Create a snapshot when user saves
 */
export async function versionSave(
  projectDir: string,
  filePath: string,
  content: string
): Promise<string> {
  const response = await invoke<ApiResponse<string>>("version_save", {
    projectDir,
    filePath,
    content,
  })
  if (!response.ok || !response.data) {
    throw new Error(response.error || "Failed to create save snapshot")
  }
  return response.data
}

/**
 * Create a commit when user compiles
 */
export async function versionCommit(
  projectDir: string,
  message: string,
  buildSuccess: boolean
): Promise<string> {
  const response = await invoke<ApiResponse<string>>("version_commit", {
    projectDir,
    message,
    buildSuccess,
  })
  if (!response.ok || !response.data) {
    throw new Error(response.error || "Failed to create compile commit")
  }
  return response.data
}

/**
 * Get version history
 */
export async function versionHistory(
  projectDir: string
): Promise<VersionHistory> {
  const response = await invoke<ApiResponse<VersionHistory>>("version_history", {
    projectDir,
  })
  if (!response.ok || !response.data) {
    throw new Error(response.error || "Failed to get version history")
  }
  return response.data
}

/**
 * Restore to a specific commit
 */
export async function versionRestore(
  projectDir: string,
  commitId: string
): Promise<void> {
  const response = await invoke<ApiResponse<void>>("version_restore", {
    projectDir,
    commitId,
  })
  if (!response.ok) {
    throw new Error(response.error || "Failed to restore version")
  }
}

/**
 * Get diff between current state and a commit
 */
export async function versionDiff(
  projectDir: string,
  commitId: string
): Promise<string> {
  const response = await invoke<ApiResponse<string>>("version_diff", {
    projectDir,
    commitId,
  })
  if (!response.ok || !response.data) {
    throw new Error(response.error || "Failed to get version diff")
  }
  return response.data
}

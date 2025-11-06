import { invoke } from "@tauri-apps/api/core"
import type { ApiResponse, FileInfo } from "./types"

export async function fileRead(path: string): Promise<string> {
  const response = await invoke<ApiResponse<string>>("file_read", { path })
  if (!response.ok || response.data === undefined || response.data === null) {
    throw new Error(response.error || "Failed to read file")
  }
  return response.data
}

export async function fileWrite(
  path: string,
  content: string,
  create?: boolean
): Promise<void> {
  const response = await invoke<ApiResponse<void>>("file_write", {
    path,
    content,
    create,
  })
  if (!response.ok) {
    throw new Error(response.error || "Failed to write file")
  }
}

export async function fileList(
  dir: string,
  recursive?: boolean
): Promise<FileInfo[]> {
  const response = await invoke<ApiResponse<FileInfo[]>>("file_list", {
    dir,
    recursive,
  })
  if (!response.ok || response.data === undefined || response.data === null) {
    throw new Error(response.error || "Failed to list files")
  }
  return response.data
}

export async function fileDelete(path: string): Promise<void> {
  const response = await invoke<ApiResponse<void>>("file_delete", { path })
  if (!response.ok) {
    throw new Error(response.error || "Failed to delete file")
  }
}

export async function fileRename(
  oldPath: string,
  newPath: string
): Promise<void> {
  const response = await invoke<ApiResponse<void>>("file_rename", {
    oldPath,
    newPath,
  })
  if (!response.ok) {
    throw new Error(response.error || "Failed to rename file")
  }
}

export async function fileExists(path: string): Promise<boolean> {
  const response = await invoke<ApiResponse<boolean>>("file_exists", { path })
  if (!response.ok) {
    return false
  }
  return response.data ?? false
}

export async function createDir(path: string): Promise<void> {
  const response = await invoke<ApiResponse<void>>("create_dir", { path })
  if (!response.ok) {
    throw new Error(response.error || "Failed to create directory")
  }
}

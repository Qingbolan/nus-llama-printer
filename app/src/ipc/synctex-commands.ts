import { invoke } from "@tauri-apps/api/core"
import type { ApiResponse, SyncTexResult, SyncTexPdfPos } from "./types"

export async function synctexForward(
  pdfPath: string,
  page: number,
  x: number,
  y: number
): Promise<SyncTexResult> {
  const response = await invoke<ApiResponse<SyncTexResult>>("synctex_forward", {
    pdfPath,
    page,
    x,
    y,
  })
  if (!response.ok || response.data === undefined || response.data === null) {
    throw new Error(response.error || "Failed to query SyncTeX")
  }
  return response.data
}

export async function synctexBackward(
  sourcePath: string,
  line: number,
  column: number,
  pdfPath: string
): Promise<SyncTexPdfPos> {
  const response = await invoke<ApiResponse<SyncTexPdfPos>>("synctex_backward", {
    sourcePath,
    line,
    column,
    pdfPath,
  })
  if (!response.ok || response.data === undefined || response.data === null) {
    throw new Error(response.error || "Failed to query SyncTeX (backward)")
  }
  return response.data
}

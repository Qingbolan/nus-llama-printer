// API Response type
export interface ApiResponse<T> {
  ok: boolean
  data?: T
  error?: string
}

// File types
export interface FileInfo {
  name: string
  path: string
  is_dir: boolean
  size: number
}

// Build types
export interface BuildResult {
  success: boolean
  pdf_path?: string
  log_path?: string
  errors: BuildError[]
  warnings: BuildWarning[]
  duration_ms: number
}

export interface BuildError {
  file?: string
  line?: number
  message: string
}

export interface BuildWarning {
  file?: string
  line?: number
  message: string
}

// Template types
export interface Template {
  id: string
  name: string
  description: string
  author?: string
}

// Project Config
export interface ProjectConfig {
  version: number
  name: string
  main: string
  engine: EngineConfig
  compile: CompileConfig
}

export interface EngineConfig {
  type: string
  args: string[]
}

export interface CompileConfig {
  synctex: boolean
  shell_escape: boolean
  outdir: string
  min_interval_ms: number
}

// SyncTeX types
export interface SyncTexResult {
  file: string
  line: number
  column: number
}

export interface SyncTexPdfPos {
  page: number
  x: number
  y: number
}

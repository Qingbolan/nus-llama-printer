import { useMemo, useState } from "react"
import { useProjectStore, useEditorStore } from "@/store"
import { FileInfo, fileDelete, fileRename, createDir, fileWrite, fileList } from "@/ipc"
import { FileIcon, FolderIcon, FolderOpenIcon, FilePlusIcon, FolderPlusIcon, RefreshCwIcon, Trash2Icon, Edit2Icon, PencilIcon, CheckIcon, XIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"
import { Dropdown } from "antd"
import type { MenuProps } from "antd"

interface FileTreeProps {
  onFileSelect: (file: FileInfo) => void
}

interface TreeNode {
  file: FileInfo
  // Normalized path with '/' separators for tree logic
  path: string
  children: TreeNode[]
  depth: number
}

export function FileTree({ onFileSelect }: FileTreeProps) {
  const { files, projectDir, projectName, setFiles, setProjectName } = useProjectStore()
  const { activeFile } = useEditorStore()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([""]))
  const [selectedFolder, setSelectedFolder] = useState<string>("") // Empty string means root
  const [renamingPath, setRenamingPath] = useState<string | null>(null)
  const [newName, setNewName] = useState("")
  const [isEditingProjectName, setIsEditingProjectName] = useState(false)
  const [editedProjectName, setEditedProjectName] = useState(projectName || "")
  const [isCreatingFile, setIsCreatingFile] = useState(false)
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newItemName, setNewItemName] = useState("")

  // Derive the active file path relative to project root for highlighting
  const activeRelPath = useMemo(() => {
    if (!activeFile || !projectDir) return null as string | null
    const normActive = activeFile.replace(/\\/g, "/")
    const normProject = projectDir.replace(/\\/g, "/")
    const prefix = `${normProject}/`
    return normActive.startsWith(prefix) ? normActive.slice(prefix.length) : null
  }, [activeFile, projectDir])

  // Refresh file list
  const refreshFiles = async () => {
    if (!projectDir) return
    try {
      const updatedFiles = await fileList(projectDir, true)
      setFiles(updatedFiles)
    } catch (error) {
      console.error("Failed to refresh files:", error)
    }
  }

  // Handle project name edit
  const handleStartEditProjectName = () => {
    setEditedProjectName(projectName || "")
    setIsEditingProjectName(true)
  }

  const handleSaveProjectName = () => {
    if (editedProjectName.trim() && editedProjectName.trim() !== projectName) {
      setProjectName(editedProjectName.trim())
      // Note: We don't update the URL to avoid route mismatch issues
      // The URL serves as the initial identifier, but the project name can be changed independently
    }
    setIsEditingProjectName(false)
  }

  const handleCancelEditProjectName = () => {
    setEditedProjectName(projectName || "")
    setIsEditingProjectName(false)
  }

  // Start creating new file
  const handleStartNewFile = (folderPath?: string) => {
    setIsCreatingFile(true)
    setIsCreatingFolder(false)
    setNewItemName("")

    // If folderPath is explicitly provided (from context menu), use it
    if (folderPath !== undefined) {
      setSelectedFolder(folderPath)
      if (folderPath) {
        setExpandedFolders(prev => new Set(prev).add(folderPath))
      }
    } else {
      // From top button: use current selectedFolder and expand if needed
      if (selectedFolder) {
        setExpandedFolders(prev => new Set(prev).add(selectedFolder))
      }
    }
  }

  // Start creating new folder
  const handleStartNewFolder = (folderPath?: string) => {
    setIsCreatingFolder(true)
    setIsCreatingFile(false)
    setNewItemName("")

    // If folderPath is explicitly provided (from context menu), use it
    if (folderPath !== undefined) {
      setSelectedFolder(folderPath)
      if (folderPath) {
        setExpandedFolders(prev => new Set(prev).add(folderPath))
      }
    } else {
      // From top button: use current selectedFolder and expand if needed
      if (selectedFolder) {
        setExpandedFolders(prev => new Set(prev).add(selectedFolder))
      }
    }
  }

  // Confirm create file
  const handleConfirmCreateFile = async () => {
    if (!projectDir || !newItemName.trim()) return

    try {
      const fileName = newItemName.trim()
      // Create in selected folder
      const basePath = selectedFolder ? `${projectDir}/${selectedFolder}` : projectDir
      const filePath = `${basePath}/${fileName}`

      await fileWrite(filePath, "", true)
      await refreshFiles()

      // Expand the folder if needed
      if (selectedFolder) {
        setExpandedFolders(prev => new Set(prev).add(selectedFolder))
      }

      setIsCreatingFile(false)
      setNewItemName("")
    } catch (error) {
      console.error("Failed to create file:", error)
      alert(`Failed to create file: ${error}`)
    }
  }

  // Confirm create folder
  const handleConfirmCreateFolder = async () => {
    if (!projectDir || !newItemName.trim()) return

    try {
      const folderName = newItemName.trim()
      // Create in selected folder
      const basePath = selectedFolder ? `${projectDir}/${selectedFolder}` : projectDir
      const folderPath = `${basePath}/${folderName}`

      await createDir(folderPath)
      await refreshFiles()

      // Expand the parent folder if needed
      if (selectedFolder) {
        setExpandedFolders(prev => new Set(prev).add(selectedFolder))
      }

      setIsCreatingFolder(false)
      setNewItemName("")
    } catch (error) {
      console.error("Failed to create folder:", error)
      alert(`Failed to create folder: ${error}`)
    }
  }

  // Cancel create
  const handleCancelCreate = () => {
    setIsCreatingFile(false)
    setIsCreatingFolder(false)
    setNewItemName("")
  }

  // Delete file or folder
  const handleDelete = async (filePath: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) return

    try {
      const fullPath = `${projectDir}/${filePath}`
      await fileDelete(fullPath)
      await refreshFiles()
    } catch (error) {
      console.error("Failed to delete:", error)
      alert(`Failed to delete: ${error}`)
    }
  }

  // Start renaming
  const handleStartRename = (filePath: string, fileName: string) => {
    setRenamingPath(filePath)
    setNewName(fileName)
  }

  // Confirm rename
  const handleRename = async (oldPath: string) => {
    if (!newName || !projectDir) return

    try {
      const pathParts = oldPath.split("/")
      pathParts[pathParts.length - 1] = newName
      const newPath = pathParts.join("/")

      const fullOldPath = `${projectDir}/${oldPath}`
      const fullNewPath = `${projectDir}/${newPath}`

      await fileRename(fullOldPath, fullNewPath)
      await refreshFiles()
      setRenamingPath(null)
    } catch (error) {
      console.error("Failed to rename:", error)
      alert(`Failed to rename: ${error}`)
    }
  }

  // Cancel rename
  const handleCancelRename = () => {
    setRenamingPath(null)
    setNewName("")
  }

  // Build tree structure from flat file list
  const buildTree = (fileList: FileInfo[]): TreeNode[] => {
    const tree: TreeNode[] = []
    const pathMap = new Map<string, TreeNode>()

    // Hidden file extensions (LaTeX temporary/build files)
    const hiddenExtensions = [
      '.aux', '.log', '.out', '.toc', '.lof', '.lot',
      '.fls', '.fdb_latexmk', '.synctex.gz', '.bbl', '.blg',
      '.run.xml', '.bcf', '.nav', '.snm', '.vrb',
      '.xdv', '.synctex(busy)', '.pdfsync'
    ]

    // Hidden directories
    const hiddenDirs = ['.git', 'node_modules', '__pycache__', '.DS_Store', '.easypaper']

    // Filter out hidden files and LaTeX temporary files
    const visibleFiles = fileList.filter((f) => {
      // Hide files/folders inside hidden directories
      const pathParts = f.path.split('/').filter(Boolean)
      if (pathParts.some(part => hiddenDirs.includes(part))) {
        return false
      }

      // Hide specific directories
      if (f.is_dir && hiddenDirs.includes(f.name)) {
        return false
      }

      // Hide files with hidden extensions
      if (!f.is_dir && hiddenExtensions.some(ext => f.name.endsWith(ext))) {
        return false
      }

      // Hide files starting with .
      if (f.name.startsWith('.') && f.name !== '.gitignore') {
        return false
      }

      return true
    })

    // Sort: directories first, then alphabetically
    const sortedFiles = [...visibleFiles].sort((a, b) => {
      if (a.is_dir && !b.is_dir) return -1
      if (!a.is_dir && b.is_dir) return 1
      return a.name.localeCompare(b.name)
    })

    // Create nodes for all files (normalize path separators for cross-platform)
    sortedFiles.forEach((file) => {
      const normPath = file.path.replace(/\\/g, "/")
      const pathParts = normPath.split("/").filter(Boolean)
      const depth = pathParts.length - 1

      const node: TreeNode = {
        file,
        path: normPath,
        children: [],
        depth,
      }
      pathMap.set(normPath, node)
    })

    // Build parent-child relationships
    sortedFiles.forEach((file) => {
      const normPath = file.path.replace(/\\/g, "/")
      const node = pathMap.get(normPath)!
      const pathParts = normPath.split("/").filter(Boolean)

      if (pathParts.length === 1) {
        // Root level file
        tree.push(node)
      } else {
        // Find parent
        const parentPath = pathParts.slice(0, -1).join("/")
        const parent = pathMap.get(parentPath)
        if (parent) {
          parent.children.push(node)
        } else {
          // If parent not found, add to root
          tree.push(node)
        }
      }
    })

    return tree
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(path)) {
        next.delete(path)
      } else {
        next.add(path)
      }
      return next
    })
  }

  const renderTree = (nodes: TreeNode[]): JSX.Element[] => {
    return nodes.map((node) => {
      const { file, children, depth, path } = node
      const isExpanded = expandedFolders.has(path)
      const isActive = !file.is_dir && activeRelPath === path
      const isFolderSelected = file.is_dir && selectedFolder === path
      // Check if currently creating in this folder
      const isCreatingInThisFolder = (isCreatingFile || isCreatingFolder) && selectedFolder === path
      // Show children indicator if folder has any children (files or folders) OR if we're creating in it
      const hasChildren = children.length > 0 || isCreatingInThisFolder
      const isRenaming = renamingPath === path

      // Context menu items
      const menuItems: MenuProps['items'] = file.is_dir ? [
        {
          key: 'newFile',
          label: 'New File',
          icon: <FilePlusIcon className="w-3.5 h-3.5" />,
          onClick: () => {
            handleStartNewFile(path)
          },
        },
        {
          key: 'newFolder',
          label: 'New Folder',
          icon: <FolderPlusIcon className="w-3.5 h-3.5" />,
          onClick: () => {
            handleStartNewFolder(path)
          },
        },
        { type: 'divider' as const },
        {
          key: 'rename',
          label: 'Rename',
          icon: <Edit2Icon className="w-3.5 h-3.5" />,
          onClick: () => handleStartRename(path, file.name),
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: <Trash2Icon className="w-3.5 h-3.5" />,
          danger: true,
          onClick: () => handleDelete(path, file.name),
        },
      ] : [
        {
          key: 'rename',
          label: 'Rename',
          icon: <Edit2Icon className="w-3.5 h-3.5" />,
          onClick: () => handleStartRename(path, file.name),
        },
        {
          key: 'delete',
          label: 'Delete',
          icon: <Trash2Icon className="w-3.5 h-3.5" />,
          danger: true,
          onClick: () => handleDelete(path, file.name),
        },
      ]

      const fileElement = (
        <div
          onClick={() => {
            if (isRenaming) return
            if (file.is_dir) {
              // Select the folder
              setSelectedFolder(path)
              // Toggle expansion if it has children
              if (hasChildren) {
                toggleFolder(path)
              }
            } else {
              // Select file and clear folder selection
              setSelectedFolder("")
              onFileSelect(file)
            }
          }}
          className={`
            group flex items-center px-2 py-1.5 rounded-md
            transition-all duration-200
            cursor-pointer
            ${
              isActive || isFolderSelected
                ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                : "hover:bg-accent/50 text-foreground"
            }
          `}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
        >
          {/* Expand/Collapse indicator - folders with children show arrow, others show dot */}
          <div className="w-4 h-4 mr-0.5 flex items-center justify-center flex-shrink-0">
            {file.is_dir && hasChildren ? (
              <svg
                className={`w-2.5 h-2.5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                fill="currentColor"
                viewBox="0 0 6 10"
              >
                <path d="M0.5 0.5L5.5 5L0.5 9.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg className="w-1.5 h-1.5 text-muted-foreground/50" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            )}
          </div>

          {/* Folder/File icon */}
          <div className="w-4 h-4 mr-2 flex items-center justify-center flex-shrink-0">
            {file.is_dir ? (
              isExpanded || isFolderSelected || isCreatingInThisFolder ? (
                <FolderOpenIcon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              ) : (
                <FolderIcon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              )
            ) : (
              <FileIcon className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          {isRenaming ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleRename(path)
                } else if (e.key === "Escape") {
                  handleCancelRename()
                }
              }}
              onBlur={() => handleRename(path)}
              className="flex-1 text-sm font-medium text-foreground bg-background border border-cyan-500 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="text-sm truncate font-medium flex-1">{file.name}</span>
          )}
        </div>
      )

      return (
        <div key={path}>
          <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
            {fileElement}
          </Dropdown>

          {/* Show children and/or new item input for this folder */}
          {file.is_dir && (isExpanded || ((isCreatingFile || isCreatingFolder) && selectedFolder === path)) && (
            <div>
              {/* New item input - show when creating in this folder */}
              {(isCreatingFile || isCreatingFolder) && selectedFolder === path && (
                <div
                  className="flex items-center px-2 py-1.5 rounded-md bg-cyan-500/10"
                  style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}
                >
                  <div className="w-4 h-4 mr-0.5 flex items-center justify-center flex-shrink-0">
                    {isCreatingFolder ? (
                      <svg
                        className="w-2.5 h-2.5 text-muted-foreground/50"
                        fill="currentColor"
                        viewBox="0 0 6 10"
                      >
                        <path d="M0.5 0.5L5.5 5L0.5 9.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg className="w-1.5 h-1.5 text-muted-foreground/50" fill="currentColor" viewBox="0 0 8 8">
                        <circle cx="4" cy="4" r="3" />
                      </svg>
                    )}
                  </div>
                  <div className="w-4 h-4 mr-2 flex items-center justify-center flex-shrink-0">
                    {isCreatingFolder ? (
                      <FolderIcon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                    ) : (
                      <FileIcon className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        if (isCreatingFile) {
                          handleConfirmCreateFile()
                        } else {
                          handleConfirmCreateFolder()
                        }
                      } else if (e.key === "Escape") {
                        e.preventDefault()
                        handleCancelCreate()
                      }
                    }}
                    placeholder={isCreatingFile ? "file.tex" : "folder-name"}
                    className="flex-1 text-sm font-medium text-foreground bg-background border border-cyan-500 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (isCreatingFile) {
                        handleConfirmCreateFile()
                      } else {
                        handleConfirmCreateFolder()
                      }
                    }}
                    className="p-1 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded transition-colors flex-shrink-0"
                    title="Create (Enter)"
                  >
                    <CheckIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCancelCreate()
                    }}
                    className="p-1 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded transition-colors flex-shrink-0"
                    title="Cancel (Esc)"
                  >
                    <XIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Render children */}
              {hasChildren && renderTree(children)}
            </div>
          )}
        </div>
      )
    })
  }

  const tree = buildTree(files)

  return (
    <div className="file-tree h-full flex flex-col">
      {/* Header with action buttons */}
      <div
        className="flex items-center justify-between px-3 py-3 gap-2 border-b border-border/50"
        onClick={(e) => e.stopPropagation()}
      >
        {isEditingProjectName ? (
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <input
              type="text"
              value={editedProjectName}
              onChange={(e) => setEditedProjectName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleSaveProjectName()
                } else if (e.key === "Escape") {
                  e.preventDefault()
                  handleCancelEditProjectName()
                }
              }}
              onBlur={handleSaveProjectName}
              className="flex-1 min-w-0 text-sm font-semibold text-foreground bg-background border border-cyan-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
              autoFocus
            />
            <button
              onClick={handleSaveProjectName}
              className="p-1 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded transition-colors flex-shrink-0"
              title="Save (Enter)"
            >
              <CheckIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCancelEditProjectName}
              className="p-1 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded transition-colors flex-shrink-0"
              title="Cancel (Esc)"
            >
              <XIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            className="flex items-center gap-1.5 group cursor-pointer flex-1 min-w-0"
            onClick={(e) => {
              e.stopPropagation()
              handleStartEditProjectName()
            }}
          >
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {projectName || "Project"}
            </h3>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <PencilIcon className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
        )}
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleStartNewFile()
            }}
            className="p-1.5 hover:bg-accent/50 rounded-md transition-all duration-200 group"
            title={`New File in ${selectedFolder || '(root)'}`}
          >
            <FilePlusIcon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleStartNewFolder()
            }}
            className="p-1.5 hover:bg-accent/50 rounded-md transition-all duration-200 group"
            title={`New Folder in ${selectedFolder || '(root)'}`}
          >
            <FolderPlusIcon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              refreshFiles()
            }}
            className="p-1.5 hover:bg-accent/50 rounded-md transition-all duration-200 group"
            title="Refresh"
          >
            <RefreshCwIcon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all" />
          </button>
        </div>
      </div>

      {/* File tree */}
      <div
        className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2"
        onClick={(e) => {
          // If clicking on the empty area (not on a file/folder item), clear selection
          if (e.target === e.currentTarget) {
            setSelectedFolder("")
            handleCancelCreate()
          }
        }}
      >
        <div
          className="space-y-0.5"
          onClick={(e) => {
            // Check if click is on the container itself (empty space)
            if (e.target === e.currentTarget) {
              setSelectedFolder("")
              handleCancelCreate()
            }
          }}
        >
          {/* Show new item input at root level only if no folder selected */}
          {(isCreatingFile || isCreatingFolder) && !selectedFolder && (
            <div className="flex items-center px-2 py-1.5 rounded-md bg-cyan-500/10" style={{ paddingLeft: '8px' }}>
              <div className="w-4 h-4 mr-0.5 flex items-center justify-center flex-shrink-0">
                {isCreatingFolder ? (
                  <svg
                    className="w-2.5 h-2.5 text-muted-foreground/50"
                    fill="currentColor"
                    viewBox="0 0 6 10"
                  >
                    <path d="M0.5 0.5L5.5 5L0.5 9.5" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg className="w-1.5 h-1.5 text-muted-foreground/50" fill="currentColor" viewBox="0 0 8 8">
                    <circle cx="4" cy="4" r="3" />
                  </svg>
                )}
              </div>
              <div className="w-4 h-4 mr-2 flex items-center justify-center flex-shrink-0">
                {isCreatingFolder ? (
                  <FolderIcon className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                ) : (
                  <FileIcon className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (isCreatingFile) {
                      handleConfirmCreateFile()
                    } else {
                      handleConfirmCreateFolder()
                    }
                  } else if (e.key === "Escape") {
                    e.preventDefault()
                    handleCancelCreate()
                  }
                }}
                placeholder={isCreatingFile ? "file.tex" : "folder-name"}
                className="flex-1 text-sm font-medium text-foreground bg-background border border-cyan-500 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                autoFocus
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (isCreatingFile) {
                    handleConfirmCreateFile()
                  } else {
                    handleConfirmCreateFolder()
                  }
                }}
                className="p-1 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded transition-colors flex-shrink-0"
                title="Create (Enter)"
              >
                <CheckIcon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleCancelCreate()
                }}
                className="p-1 hover:bg-red-500/10 text-red-600 dark:text-red-400 rounded transition-colors flex-shrink-0"
                title="Cancel (Esc)"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {tree.length === 0 && !isCreatingFile && !isCreatingFolder ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FolderIcon className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm font-medium">No files</p>
              <p className="text-xs mt-1 opacity-70">Click + to create files or folders</p>
            </div>
          ) : (
            renderTree(tree)
          )}
        </div>
      </div>
    </div>
  )
}

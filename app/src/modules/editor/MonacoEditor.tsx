import { Editor, loader } from "@monaco-editor/react"
import { useEditorStore } from "@/store"
import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/lib/theme-context"
import { FileTextIcon } from "lucide-react"
import * as Diff from "diff"

interface MonacoEditorProps {
  value: string
  onChange?: (value: string) => void
  onSave?: () => void
  fileName?: string
  onEditorReady?: (editor: any) => void
  originalContent?: string
  onRequestSyncToPdf?: (line: number, column: number) => void
}

export function MonacoEditor({ value, onChange, onSave, fileName, onEditorReady, originalContent, onRequestSyncToPdf }: MonacoEditorProps) {
  const { fontSize, wordWrap, showLineNumbers } = useEditorStore()
  const { theme } = useTheme()
  const editorRef = useRef<any>(null)
  const [monacoTheme, setMonacoTheme] = useState<string>("vs-dark")
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [totalLines, setTotalLines] = useState(0)
  const diffDecorationsRef = useRef<string[]>([])
  const highlightDecorationRef = useRef<string[]>([])

  // Update theme based on system theme
  useEffect(() => {
    setMonacoTheme(theme === "dark" ? "vs-dark" : "vs")
  }, [theme])

  // Calculate and apply diff decorations with character-level precision
  useEffect(() => {
    if (!editorRef.current || !originalContent) {
      // Clear decorations if no original content
      if (editorRef.current && diffDecorationsRef.current.length > 0) {
        diffDecorationsRef.current = editorRef.current.deltaDecorations(diffDecorationsRef.current, [])
      }
      return
    }

    const editor = editorRef.current
    const model = editor.getModel()
    if (!model) return

    const decorations: any[] = []

    // Use line-level diff to identify changed regions with accurate pairing
    const lineChanges = Diff.diffLines(originalContent, value)

    let origLineIdx = 0
    let currLineIdx = 0

    const splitNoTrail = (text: string) => {
      const arr = text.split('\n')
      if (arr[arr.length - 1] === '') arr.pop()
      return arr
    }

    for (let idx = 0; idx < lineChanges.length; idx++) {
      const change = lineChanges[idx]

      // Case 1: modification block -> a removed chunk followed by an added chunk
      if (change.removed && idx + 1 < lineChanges.length && lineChanges[idx + 1].added) {
        const removedLines = splitNoTrail(change.value)
        const addedLines = splitNoTrail(lineChanges[idx + 1].value)

        const pairCount = Math.min(removedLines.length, addedLines.length)

        // Pair lines by order for char-level diff (precise added highlighting)
        for (let j = 0; j < pairCount; j++) {
          const origLine = removedLines[j]
          const newLine = addedLines[j]
          const lineNum = currLineIdx + j + 1

          if (lineNum > model.getLineCount()) continue
          if (newLine.trim() === '') continue // don't mark empty lines

          const charChanges = Diff.diffChars(origLine, newLine)
          let charPos = 0 // position in new line

          charChanges.forEach((c) => {
            if (c.added) {
              const startCol = charPos + 1
              const endCol = startCol + c.value.length
              decorations.push({
                range: {
                  startLineNumber: lineNum,
                  startColumn: startCol,
                  endLineNumber: lineNum,
                  endColumn: endCol
                },
                options: {
                  inlineClassName: 'diff-added-inline',
                  overviewRuler: { color: 'rgba(34, 197, 94, 0.6)', position: 2 }
                }
              })
            }
            if (!c.removed) charPos += c.value.length
          })

          // Add glyph for modified line
          decorations.push({
            range: {
              startLineNumber: lineNum,
              startColumn: 1,
              endLineNumber: lineNum,
              endColumn: 1
            },
            options: { glyphMarginClassName: 'diff-modified-glyph' }
          })
        }

        // Extra added lines beyond pairs => brand-new lines
        for (let j = pairCount; j < addedLines.length; j++) {
          const lineNum = currLineIdx + j + 1
          const line = addedLines[j]
          if (line.trim() === '') continue
          if (lineNum > model.getLineCount()) continue
          decorations.push({
            range: {
              startLineNumber: lineNum,
              startColumn: 1,
              endLineNumber: lineNum,
              endColumn: model.getLineMaxColumn(lineNum)
            },
            options: {
              isWholeLine: true,
              className: 'diff-added-line',
              glyphMarginClassName: 'diff-added-glyph',
              overviewRuler: { color: 'rgba(34, 197, 94, 0.6)', position: 2 }
            }
          })
        }

        // Extra removed lines beyond pairs => show deletion marker on next visible line
        if (removedLines.length > pairCount) {
          const leftover = removedLines.slice(pairCount)
          const removedText = leftover.filter(l => l.trim() !== '').join('\n')
          const anchorLine = Math.min(currLineIdx + pairCount + 1, Math.max(1, model.getLineCount()))
          if (removedText && anchorLine <= model.getLineCount()) {
            decorations.push({
              range: { startLineNumber: anchorLine, startColumn: 1, endLineNumber: anchorLine, endColumn: 1 },
              options: {
                glyphMarginClassName: 'diff-removed-glyph',
                glyphMarginHoverMessage: {
                  value: `🗑️ ${leftover.length} line(s) deleted:\n${removedText.substring(0, 200)}${removedText.length > 200 ? '...' : ''}`
                }
              }
            })
          }
        }

        // Advance indices and skip the paired added block
        origLineIdx += removedLines.length
        currLineIdx += addedLines.length
        idx++
        continue
      }

      // Case 2: added-only block (brand new lines)
      if (change.added) {
        const addedLines = splitNoTrail(change.value)
        for (let j = 0; j < addedLines.length; j++) {
          const line = addedLines[j]
          const lineNum = currLineIdx + 1
          if (line.trim() === '') {
            currLineIdx++
            continue
          }
          if (lineNum > model.getLineCount()) {
            currLineIdx++
            continue
          }
          decorations.push({
            range: {
              startLineNumber: lineNum,
              startColumn: 1,
              endLineNumber: lineNum,
              endColumn: model.getLineMaxColumn(lineNum)
            },
            options: {
              isWholeLine: true,
              className: 'diff-added-line',
              glyphMarginClassName: 'diff-added-glyph',
              overviewRuler: { color: 'rgba(34, 197, 94, 0.6)', position: 2 }
            }
          })
          currLineIdx++
        }
        continue
      }

      // Case 3: removed-only block (pure deletions)
      if (change.removed) {
        const removedLines = splitNoTrail(change.value)
        const removedText = removedLines.filter(l => l.trim() !== '').join('\n')
        if (removedText && currLineIdx + 1 <= model.getLineCount()) {
          decorations.push({
            range: { startLineNumber: currLineIdx + 1, startColumn: 1, endLineNumber: currLineIdx + 1, endColumn: 1 },
            options: {
              glyphMarginClassName: 'diff-removed-glyph',
              glyphMarginHoverMessage: {
                value: `🗑️ ${removedLines.length} line(s) deleted:\n${removedText.substring(0, 200)}${removedText.length > 200 ? '...' : ''}`
              }
            }
          })
        }
        origLineIdx += removedLines.length
        continue
      }

      // Case 4: unchanged block
      const unchangedLines = splitNoTrail(change.value)
      origLineIdx += unchangedLines.length
      currLineIdx += unchangedLines.length
    }

    // Apply decorations
    diffDecorationsRef.current = editor.deltaDecorations(diffDecorationsRef.current, decorations)
  }, [originalContent, value])

  // Expose method to highlight a line (for SyncTeX)
  useEffect(() => {
    if (editorRef.current && onEditorReady) {
      const editor = editorRef.current

      // Add highlight method to editor
      editor.highlightLine = (lineNumber: number) => {
        const model = editor.getModel()
        if (!model) return

        const decoration = [{
          range: {
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: model.getLineMaxColumn(lineNumber)
          },
          options: {
            isWholeLine: true,
            className: 'synctex-highlight-line',
            glyphMarginClassName: 'synctex-highlight-glyph'
          }
        }]

        highlightDecorationRef.current = editor.deltaDecorations(highlightDecorationRef.current, decoration)
      }

      // Add clear highlight method
      editor.clearHighlight = () => {
        if (highlightDecorationRef.current.length > 0) {
          highlightDecorationRef.current = editor.deltaDecorations(highlightDecorationRef.current, [])
        }
      }
    }
  }, [onEditorReady])

  useEffect(() => {
    // Setup keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        onSave?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onSave])

  // Configure Monaco for LaTeX
  useEffect(() => {
    loader.init().then((monaco) => {
      // Register LaTeX language if not already registered
      const languages = monaco.languages.getLanguages()
      if (!languages.find((lang) => lang.id === "latex")) {
        monaco.languages.register({ id: "latex" })

        monaco.languages.setMonarchTokensProvider("latex", {
          tokenizer: {
            root: [
              // Commands
              [/\\[a-zA-Z@]+/, "keyword"],
              // Math delimiters
              [/\$\$|\$/, "string"],
              // Comments
              [/%.*$/, "comment"],
              // Braces
              [/[{}]/, "delimiter.bracket"],
              // Brackets
              [/[\[\]]/, "delimiter.square"],
            ],
          },
        })
      }
    })
  }, [])

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor

    // Notify parent that editor is ready
    onEditorReady?.(editor)

    // Configure LaTeX-specific settings
    editor.updateOptions({
      fontSize,
      wordWrap: wordWrap ? "on" : "off",
      lineNumbers: showLineNumbers ? "on" : "off",
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      automaticLayout: true,
    })

    // Update total lines
    setTotalLines(editor.getModel()?.getLineCount() || 0)

    // Track cursor position
    editor.onDidChangeCursorPosition((e: any) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column
      })
    })

    // Track content changes for line count
    editor.onDidChangeModelContent(() => {
      setTotalLines(editor.getModel()?.getLineCount() || 0)
    })

    // Clear highlight on click
    editor.onMouseDown(() => {
      if (highlightDecorationRef.current.length > 0) {
        highlightDecorationRef.current = editor.deltaDecorations(highlightDecorationRef.current, [])
      }
    })

    // Add comment toggle keybinding (Cmd+/ or Ctrl+/)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      const selection = editor.getSelection()
      const model = editor.getModel()
      if (!model || !selection) return

      const startLine = selection.startLineNumber
      const endLine = selection.endLineNumber

      // Check if all selected lines are commented
      let allCommented = true
      for (let i = startLine; i <= endLine; i++) {
        const lineContent = model.getLineContent(i).trim()
        if (lineContent && !lineContent.startsWith('%')) {
          allCommented = false
          break
        }
      }

      editor.executeEdits('toggle-comment', [{
        range: new monaco.Range(startLine, 1, endLine + 1, 1),
        text: null,
        forceMoveMarkers: true
      }])

      // Toggle comments
      const edits = []
      for (let i = startLine; i <= endLine; i++) {
        const line = model.getLineContent(i)
        const firstNonWhitespace = line.search(/\S/)

        if (allCommented) {
          // Remove comment
          const commentIndex = line.indexOf('%')
          if (commentIndex !== -1) {
            edits.push({
              range: new monaco.Range(i, commentIndex + 1, i, commentIndex + 2),
              text: ''
            })
          }
        } else {
          // Add comment
          const insertPos = firstNonWhitespace === -1 ? 1 : firstNonWhitespace + 1
          edits.push({
            range: new monaco.Range(i, insertPos, i, insertPos),
            text: '% '
          })
        }
      }

      editor.executeEdits('toggle-comment', edits)
    })

    // Add Sync to PDF keybinding (Cmd/Ctrl+Alt+J)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KeyJ, () => {
      if (!onRequestSyncToPdf) return
      const pos = editor.getPosition()
      if (!pos) return
      onRequestSyncToPdf(pos.lineNumber, pos.column)
    })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Editor Status Bar */}
      <div className="flex items-center justify-between px-4 h-10 border-b border-border bg-card text-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <FileTextIcon className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{fileName || "Untitled"}</span>
          </div>
          <div className="text-muted-foreground">
            Line {cursorPosition.line}, Col {cursorPosition.column}
          </div>
          {onRequestSyncToPdf && (
            <button
              onClick={() => onRequestSyncToPdf(cursorPosition.line, cursorPosition.column)}
              className="px-2 py-0.5 text-xs border border-border rounded hover:bg-accent hover:text-accent-foreground"
              title="Sync to PDF (Cmd/Ctrl+Alt+J)"
            >
              Sync to PDF
            </button>
          )}
          <div className="text-muted-foreground">
            UTF-8
          </div>
          <div className="text-muted-foreground">
            {totalLines} lines
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language="latex"
          value={value}
          onChange={(value) => onChange?.(value || "")}
          onMount={handleEditorDidMount}
          theme={monacoTheme}
          options={{
            fontSize,
            wordWrap: wordWrap ? "on" : "off",
            lineNumbers: showLineNumbers ? "on" : "off",
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            bracketPairColorization: { enabled: true },
            guides: {
              bracketPairs: true,
            },
          }}
        />
      </div>
    </div>
  )
}

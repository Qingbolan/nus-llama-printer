import { useEffect, useRef, useState } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"
import "./katex-theme.css"

interface KaTeXPreviewProps {
  content: string
}

export function KaTeXPreview({ content }: KaTeXPreviewProps) {
  const [renderedContent, setRenderedContent] = useState<string>("")
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Throttle rendering to avoid excessive updates
    const timeoutId = setTimeout(() => {
      try {
        const rendered = renderLaTeXContent(content)
        setRenderedContent(rendered)
      } catch (error) {
        console.error("KaTeX rendering error:", error)
        setRenderedContent("<p>Error rendering LaTeX content</p>")
      }
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [content])

  return (
    <div
      ref={containerRef}
      className="katex-preview p-8 overflow-auto h-full bg-background text-foreground"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  )
}

function renderLaTeXContent(content: string): string {
  // Simple LaTeX to HTML conversion
  // This is a basic implementation - a full converter would be much more complex

  let html = content

  // Extract and render display math ($$...$$)
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    try {
      return katex.renderToString(math, { displayMode: true })
    } catch (e) {
      return `<span class="katex-error">${match}</span>`
    }
  })

  // Extract and render inline math ($...$)
  html = html.replace(/\$([^\$]+?)\$/g, (match, math) => {
    try {
      return katex.renderToString(math, { displayMode: false })
    } catch (e) {
      return `<span class="katex-error">${match}</span>`
    }
  })

  // Convert LaTeX commands to HTML
  html = html.replace(/\\title\{([^}]+)\}/g, "<h1 class='text-3xl font-bold mb-4 text-foreground'>$1</h1>")
  html = html.replace(/\\author\{([^}]+)\}/g, "<p class='text-lg mb-2 text-foreground'>$1</p>")
  html = html.replace(/\\date\{([^}]+)\}/g, "<p class='text-sm text-muted-foreground mb-4'>$1</p>")

  html = html.replace(/\\section\{([^}]+)\}/g, "<h2 class='text-2xl font-bold mt-6 mb-3 text-foreground'>$1</h2>")
  html = html.replace(/\\subsection\{([^}]+)\}/g, "<h3 class='text-xl font-semibold mt-4 mb-2 text-foreground'>$1</h3>")
  html = html.replace(/\\subsubsection\{([^}]+)\}/g, "<h4 class='text-lg font-medium mt-3 mb-2 text-foreground'>$1</h4>")

  html = html.replace(/\\textbf\{([^}]+)\}/g, "<strong>$1</strong>")
  html = html.replace(/\\textit\{([^}]+)\}/g, "<em>$1</em>")
  html = html.replace(/\\emph\{([^}]+)\}/g, "<em>$1</em>")

  // Convert environments
  html = html.replace(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/g,
    "<div class='abstract p-4 bg-muted text-foreground rounded-lg mb-4'><h3 class='font-semibold mb-2'>Abstract</h3>$1</div>")

  // Convert paragraphs (double newlines)
  html = html.replace(/\n\n/g, "</p><p class='mb-4 text-foreground'>")
  html = "<p class='mb-4 text-foreground'>" + html + "</p>"

  // Remove LaTeX commands that we don't render
  html = html.replace(/\\(documentclass|usepackage|maketitle|bibliographystyle|bibliography)\{[^}]*\}/g, "")
  html = html.replace(/\\(begin|end)\{document\}/g, "")

  // Remove comments
  html = html.replace(/%.*$/gm, "")

  return html
}

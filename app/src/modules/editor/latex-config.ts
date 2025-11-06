// LaTeX language configuration for Monaco
// This provides basic syntax highlighting and auto-completion

export const latexLanguageConfig = {
  comments: {
    lineComment: "%",
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "$", close: "$" },
    { open: "$$", close: "$$" },
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: "$", close: "$" },
  ],
}

export const latexTokenProvider = {
  defaultToken: "",
  tokenPostfix: ".latex",

  keywords: [
    "documentclass",
    "usepackage",
    "begin",
    "end",
    "section",
    "subsection",
    "subsubsection",
    "title",
    "author",
    "date",
    "maketitle",
    "abstract",
    "cite",
    "ref",
    "label",
    "includegraphics",
    "textbf",
    "textit",
    "emph",
    "item",
    "caption",
    "bibliography",
    "bibliographystyle",
  ],

  tokenizer: {
    root: [
      [/%.*$/, "comment"],
      [/\\[a-zA-Z@]+/, "keyword"],
      [/\{/, "delimiter.curly"],
      [/\}/, "delimiter.curly"],
      [/\[/, "delimiter.square"],
      [/\]/, "delimiter.square"],
      [/\$\$/, "string.math"],
      [/\$/, "string.math"],
    ],
  },
}

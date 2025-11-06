
import { useMemo } from "react"

interface WordCloudProps {
  words: Array<{ text: string; value: number }>
  height?: number
}

export function WordCloud({ words, height = 400 }: WordCloudProps) {
  const sortedWords = useMemo(() => {
    return [...words].sort((a, b) => b.value - a.value)
  }, [words])

  const maxValue = sortedWords[0]?.value || 1
  const minValue = sortedWords[sortedWords.length - 1]?.value || 1

  const getFontSize = (value: number) => {
    const ratio = (value - minValue) / (maxValue - minValue)
    return 12 + ratio * 32 // Font size range: 12px - 44px
  }

  const getColor = (index: number) => {
    const colors = [
      'hsl(var(--primary))',
      '#3b82f6', // blue
      '#10b981', // green
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
    ]
    return colors[index % colors.length]
  }

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3 p-6"
      style={{ height }}
    >
      {sortedWords.map((word, index) => (
        <span
          key={word.text}
          className="font-semibold transition-transform hover:scale-110 cursor-default select-none"
          style={{
            fontSize: `${getFontSize(word.value)}px`,
            color: getColor(index),
            opacity: 0.7 + (word.value / maxValue) * 0.3,
            lineHeight: 1.2,
          }}
          title={`${word.text}: ${word.value}`}
        >
          {word.text}
        </span>
      ))}
    </div>
  )
}

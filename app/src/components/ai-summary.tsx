
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import SpotlightCard from "./ui/card/SpotlightCard"
import { useI18n } from "@/lib/i18n"

interface AISummaryProps {
  summary: string
  className?: string
  typingSpeed?: number
}

export function AISummary({ summary, className = "", typingSpeed = 30 }: AISummaryProps) {
  const { t } = useI18n()
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    let currentIndex = 0
    setDisplayedText("")
    setIsTyping(true)

    const typingInterval = setInterval(() => {
      if (currentIndex < summary.length) {
        setDisplayedText(summary.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(typingInterval)
      }
    }, typingSpeed)

    return () => clearInterval(typingInterval)
  }, [summary, typingSpeed])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <SpotlightCard className="p-6">
        <div className="flex items-start gap-4">
          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">{t("summary.brandSummary")}</h3>
              {/* {isTyping && (
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-1.5 h-5 bg-primary rounded-sm"
                />
              )} */}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {displayedText}
              {isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 bg-primary ml-0.5 align-middle"
                />
              )}
            </p>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  )
}

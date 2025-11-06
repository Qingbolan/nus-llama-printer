
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GradientHeadingProps {
  children: React.ReactNode
  className?: string
  as?: "h1" | "h2" | "h3" | "h4"
}

export function GradientHeading({ children, className, as: Comp = "h1" }: GradientHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <Comp
        className={cn(
          "bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent font-semibold",
          className
        )}
      >
        {children}
      </Comp>
    </motion.div>
  )
}

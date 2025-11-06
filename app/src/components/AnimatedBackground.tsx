import { motion, useReducedMotion } from 'framer-motion'
import { memo } from 'react'

interface AnimatedBackgroundProps {
  variant?: 'default' | 'simple'
}

/**
 * Optimized animated background component with reduced animation complexity
 * for better performance across devices
 */
export const AnimatedBackground = memo(function AnimatedBackground({
  variant = 'default'
}: AnimatedBackgroundProps) {
  // Respect system reduced‑motion preference and use simpler animations
  const prefersReduced = useReducedMotion()
  const animationConfig = prefersReduced
    ? { duration: 0, repeat: 0 as const, ease: 'linear' as const }
    : {
        duration: variant === 'simple' ? 26 : 22,
        ease: 'easeInOut' as const,
      }

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Adaptive base gradient - dark in dark mode, light in light mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background dark:from-[#07090F] dark:via-[#0B0F1A] dark:to-[#07090F]" />

      {/* Brand glows: warm (llama) + cool (printer) */}
      <motion.div
        className="absolute top-1/4 -left-1/4 w-[620px] h-[620px] rounded-full bg-gradient-to-r from-orange-500/15 to-amber-500/10 dark:from-orange-500/25 dark:to-amber-500/20 blur-[90px]"
        animate={prefersReduced ? undefined : {
          x: [0, 60, 0],
          y: [0, -35, 0],
          scale: [1, 1.06, 1],
        }}
        transition={animationConfig}
      />

      <motion.div
        className="absolute bottom-1/4 -right-1/4 w-[620px] h-[620px] rounded-full bg-gradient-to-l from-sky-500/15 to-cyan-500/10 dark:from-sky-500/25 dark:to-cyan-500/20 blur-[90px]"
        animate={prefersReduced ? undefined : {
          x: [0, -60, 0],
          y: [0, 35, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          ...animationConfig,
          duration: prefersReduced ? 0 : variant === 'simple' ? 22 : 18,
        }}
      />

      {/* Subtle center highlight for depth without heavy blur - adapted for both themes */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(100,100,100,0.04),transparent_55%)] dark:bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.06),transparent_55%)]" />
    </div>
  )
})

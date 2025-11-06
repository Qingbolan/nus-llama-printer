
import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

export type MicaVariant = "base" | "alt"

export interface MicaProps extends HTMLAttributes<HTMLDivElement> {
  variant?: MicaVariant
  noise?: boolean
}

const Mica = forwardRef<HTMLDivElement, MicaProps>(
  ({ className, variant = "base", noise = true, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-xl relative overflow-hidden", className)}
        style={{
          position: "relative",
          isolation: "isolate",
          ...style,
        }}
        {...props}
      >
        {/* Backdrop blur - Mica uses stronger blur */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: "blur(80px) saturate(120%)",
            WebkitBackdropFilter: "blur(80px) saturate(120%)",
          }}
        />

        {/* Base tint - Dark semi-transparent background */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: variant === "base"
              ? "rgba(var(--mica-tint, 245 245 245), 0.9)"
              : "rgba(var(--mica-alt-tint, 240 240 245), 0.92)",
          }}
        />

        {/* Luminosity gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.05) 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Noise texture - Mica has finer noise */}
        {noise && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: "300px 300px",
              mixBlendMode: "overlay",
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)

Mica.displayName = "Mica"

export { Mica }

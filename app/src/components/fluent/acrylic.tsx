
import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

export type AcrylicVariant = "default" | "strong" | "thin"

export interface AcrylicProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AcrylicVariant
  tintOpacity?: number
  noise?: boolean
}

const Acrylic = forwardRef<HTMLDivElement, AcrylicProps>(
  ({ className, variant = "default", tintOpacity = 0.7, noise = true, children, style, ...props }, ref) => {
    // Blur and saturation configurations for different variants
    const variantConfig = {
      thin: {
        blur: 12,
        saturate: 140,
        tint: 0.5,
      },
      default: {
        blur: 30,
        saturate: 180,
        tint: 0.7,
      },
      strong: {
        blur: 50,
        saturate: 200,
        tint: 0.85,
      },
    }

    const config = variantConfig[variant]

    return (
      <div
        ref={ref}
        className={cn("rounded-xl relative overflow-hidden border border-white/10", className)}
        style={{
          position: "relative",
          isolation: "isolate",
          ...style,
        }}
        {...props}
      >
        {/* Backdrop blur layer */}
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${config.blur}px) saturate(${config.saturate}%)`,
            WebkitBackdropFilter: `blur(${config.blur}px) saturate(${config.saturate}%)`,
          }}
        />

        {/* Tint overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(var(--acrylic-tint, 255 255 255), ${tintOpacity * config.tint})`,
            mixBlendMode: "normal",
          }}
        />

        {/* Luminosity layer for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
            mixBlendMode: "overlay",
          }}
        />

        {/* Noise texture */}
        {noise && (
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: "200px 200px",
              mixBlendMode: "soft-light",
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    )
  }
)

Acrylic.displayName = "Acrylic"

export { Acrylic }

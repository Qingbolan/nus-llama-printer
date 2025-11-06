import React, { CSSProperties } from "react"
import { cn } from "@/lib/utils"

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = "#ffffff",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background = "rgba(0, 0, 0, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--shimmer-color": shimmerColor,
            "--shimmer-size": shimmerSize,
            "--shimmer-duration": shimmerDuration,
            "--border-radius": borderRadius,
            "--background": background,
          } as CSSProperties
        }
        className={cn(
          "group relative overflow-hidden whitespace-nowrap px-6 py-2",
          "[background:var(--background)] [border-radius:var(--border-radius)]",
          "transition-all duration-300 hover:scale-105 active:scale-95",
          className
        )}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "absolute inset-0 overflow-visible [border-radius:var(--border-radius)]",
            "before:absolute before:inset-[-100%] before:animate-[spin_var(--shimmer-duration)_linear_infinite]",
            "before:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--shimmer-color)_10%,transparent_60%)]",
            "group-hover:before:bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,var(--shimmer-color)_20%,transparent_70%)]"
          )}
        />
        <div
          className={cn(
            "absolute inset-[var(--shimmer-size)]",
            "[background:var(--background)] [border-radius:calc(var(--border-radius)-var(--shimmer-size))]",
            "z-10"
          )}
        />
        <span className="z-20 relative flex items-center gap-2">{children}</span>
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"

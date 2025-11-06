
import { useAccentColor, ACCENT_COLORS, AccentColorKey } from "@/lib/accent-color"
import { cn } from "@/lib/utils"
import { CheckIcon } from "@/components/icons"

export function AccentColorPicker() {
  const { accentColor, setAccentColor } = useAccentColor()

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Accent Color</h3>
      <div className="grid grid-cols-7 gap-2">
        {Object.entries(ACCENT_COLORS).map(([key, color]) => {
          const isSelected = accentColor === key
          const colorKey = key as AccentColorKey

          return (
            <button
              key={key}
              onClick={() => setAccentColor(colorKey)}
              className={cn(
                "relative h-10 w-10 rounded-md border-2 transition-all",
                "hover:scale-110 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isSelected ? "border-foreground shadow-lg" : "border-transparent"
              )}
              style={{
                backgroundColor: color.light,
                transitionDuration: "var(--duration-fast)",
                transitionTimingFunction: "var(--motion-standard)",
              }}
              aria-label={`Select ${color.name} accent color`}
            >
              {isSelected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckIcon className="h-5 w-5 text-white drop-shadow-lg" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

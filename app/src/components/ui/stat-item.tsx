/**
 * StatItem - Lightweight statistics display component
 * Inspired by Overleaf's minimal design philosophy
 * Replaces heavy Card-based statistics
 */

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItemProps {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatItem({ value, label, icon: Icon, trend, className }: StatItemProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="text-2xl font-semibold text-foreground">{value}</span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "+" : ""}{trend.value}%
          </span>
        )}
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}

interface StatGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function StatGroup({ children, className }: StatGroupProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-8 py-4 px-6 bg-muted/30 rounded-lg border border-border/50",
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatGrid({ children, columns = 3, className }: StatGridProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        {
          "grid-cols-1 md:grid-cols-2": columns === 2,
          "grid-cols-1 md:grid-cols-3": columns === 3,
          "grid-cols-2 md:grid-cols-4": columns === 4,
        },
        className
      )}
    >
      {children}
    </div>
  );
}

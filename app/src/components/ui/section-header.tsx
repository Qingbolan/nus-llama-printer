/**
 * SectionHeader - Clean section divider component
 * Inspired by Overleaf's content organization
 * Replaces Card-based section wrappers
 */

import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  icon: Icon,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-1 pb-4 border-b border-border/50", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon className="h-5 w-5 text-primary" />}
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
        </div>
        {action && <div>{action}</div>}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function Section({ children, className, noPadding = false }: SectionProps) {
  return (
    <section
      className={cn(
        "space-y-6",
        !noPadding && "py-6",
        className
      )}
    >
      {children}
    </section>
  );
}

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export function PageContainer({ children, maxWidth = 'xl', className }: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-6 py-8",
        {
          "max-w-3xl": maxWidth === 'sm',
          "max-w-5xl": maxWidth === 'md',
          "max-w-6xl": maxWidth === 'lg',
          "max-w-7xl": maxWidth === 'xl',
          "max-w-full": maxWidth === 'full',
        },
        className
      )}
    >
      {children}
    </div>
  );
}

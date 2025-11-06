/**
 * Document Layout - Pure PDF/academic paper style
 * Zero decorative elements, maximum readability
 */

import { cn } from '@/lib/utils';

interface DocumentPageProps {
  children: React.ReactNode;
  maxWidth?: 'narrow' | 'medium' | 'wide';
  className?: string;
}

export function DocumentPage({ children, maxWidth = 'medium', className }: DocumentPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <div
        className={cn(
          "mx-auto px-12 py-10",
          {
            "max-w-3xl": maxWidth === 'narrow',   // 768px - 类似A4纸宽度
            "max-w-4xl": maxWidth === 'medium',   // 896px
            "max-w-6xl": maxWidth === 'wide',     // 1152px
          },
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface DocumentTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function DocumentTitle({ children, className }: DocumentTitleProps) {
  return (
    <h1 className={cn("text-3xl font-bold text-center text-gray-900 mb-8", className)}>
      {children}
    </h1>
  );
}

interface DocumentSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function DocumentSection({ title, children, className }: DocumentSectionProps) {
  return (
    <section className={cn("mb-8", className)}>
      {title && (
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

interface DocumentSubsectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function DocumentSubsection({ title, children, className }: DocumentSubsectionProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h3 className="text-base font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

interface DocumentParagraphProps {
  children: React.ReactNode;
  indent?: boolean;
  className?: string;
}

export function DocumentParagraph({ children, indent = false, className }: DocumentParagraphProps) {
  return (
    <p className={cn(
      "text-base text-gray-800 leading-relaxed mb-4",
      indent && "pl-6",
      className
    )}>
      {children}
    </p>
  );
}

interface DocumentListProps {
  items: React.ReactNode[];
  ordered?: boolean;
  className?: string;
}

export function DocumentList({ items, ordered = false, className }: DocumentListProps) {
  const ListComponent = ordered ? 'ol' : 'ul';

  return (
    <ListComponent className={cn(
      "space-y-2 mb-4",
      ordered ? "list-decimal" : "list-disc",
      "list-inside text-gray-800",
      className
    )}>
      {items.map((item, index) => (
        <li key={index} className="text-base leading-relaxed">
          {item}
        </li>
      ))}
    </ListComponent>
  );
}

interface DocumentTableProps {
  children: React.ReactNode;
  className?: string;
}

export function DocumentTable({ children, className }: DocumentTableProps) {
  return (
    <div className={cn("mb-6 overflow-x-auto", className)}>
      <table className="min-w-full border-collapse">
        {children}
      </table>
    </div>
  );
}

export function DocumentTableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b-2 border-gray-900">
        {children}
      </tr>
    </thead>
  );
}

export function DocumentTableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function DocumentTableRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <tr className={cn("border-b border-gray-300", className)}>
      {children}
    </tr>
  );
}

export function DocumentTableCell({
  children,
  header,
  align = 'left',
  className
}: {
  children: React.ReactNode;
  header?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
}) {
  const Component = header ? 'th' : 'td';

  return (
    <Component
      className={cn(
        "px-4 py-2 text-base",
        header ? "font-semibold text-gray-900" : "text-gray-800",
        {
          "text-left": align === 'left',
          "text-center": align === 'center',
          "text-right": align === 'right',
        },
        className
      )}
    >
      {children}
    </Component>
  );
}

interface DocumentDividerProps {
  className?: string;
}

export function DocumentDivider({ className }: DocumentDividerProps) {
  return <hr className={cn("my-6 border-t border-gray-300", className)} />;
}

interface DocumentMetaProps {
  label: string;
  value: React.ReactNode;
}

export function DocumentMeta({ label, value }: DocumentMetaProps) {
  return (
    <div className="flex gap-2 mb-2">
      <span className="font-medium text-gray-900">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

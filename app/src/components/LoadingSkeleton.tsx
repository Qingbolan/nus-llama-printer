import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'
import { memo } from 'react'

/**
 * Loading skeleton for PDF preview
 */
export const PDFPreviewSkeleton = memo(function PDFPreviewSkeleton() {
  return (
    <Card className="p-6 bg-gray-900/30 backdrop-blur-xl border-gray-800">
      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
      <div className="flex items-center justify-between mt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-24" />
      </div>
    </Card>
  )
})

/**
 * Loading skeleton for print job card
 */
export const PrintJobSkeleton = memo(function PrintJobSkeleton() {
  return (
    <div className="p-3 rounded-lg bg-gray-800/50">
      <div className="flex items-start gap-3">
        <Skeleton className="w-10 h-10 rounded-lg flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="w-16 h-6 rounded-full" />
      </div>
    </div>
  )
})

/**
 * Loading skeleton for recent jobs list
 */
export const RecentJobsListSkeleton = memo(function RecentJobsListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <PrintJobSkeleton key={i} />
      ))}
    </div>
  )
})

/**
 * Loading skeleton for stat card
 */
export const StatCardSkeleton = memo(function StatCardSkeleton() {
  return (
    <Card className="p-6 text-center bg-gray-900/30 backdrop-blur-xl border-gray-800">
      <Skeleton className="h-8 w-16 mx-auto mb-2" />
      <Skeleton className="h-4 w-24 mx-auto" />
    </Card>
  )
})

/**
 * Loading skeleton for printer card
 */
export const PrinterCardSkeleton = memo(function PrinterCardSkeleton() {
  return (
    <Card className="p-6 bg-gray-900/30 backdrop-blur-xl border-gray-800">
      <div className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </Card>
  )
})

/**
 * Loading skeleton for settings panel
 */
export const SettingsPanelSkeleton = memo(function SettingsPanelSkeleton() {
  return (
    <Card className="p-6 space-y-6 bg-gray-900/30 backdrop-blur-xl border-gray-800">
      <div className="flex items-center gap-2">
        <Skeleton className="w-5 h-5 rounded" />
        <Skeleton className="h-6 w-32" />
      </div>

      {/* Copies slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-8 w-12" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
      </div>

      {/* Options */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-3">
            <Skeleton className="w-5 h-5 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <Skeleton className="w-11 h-6 rounded-full" />
        </div>
      ))}
    </Card>
  )
})

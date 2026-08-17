export default function SummaryTableSkeleton({ count = 10 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <tr key={index} className="border-b border-border">
          {/* Operator (Avatar + Name & NIK) */}
          <td className="px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="size-9 shrink-0 animate-pulse rounded-full bg-card-secondary" />
              <div className="space-y-1.5">
                <div className="h-4 w-28 animate-pulse rounded bg-card-secondary" />
                <div className="h-3 w-20 animate-pulse rounded bg-card-secondary" />
              </div>
            </div>
          </td>

          {/* Group Badge */}
          <td className="px-5 py-4">
            <div className="h-6 w-16 animate-pulse rounded-md bg-card-secondary" />
          </td>

          {/* Total OK */}
          <td className="px-5 py-4">
            <div className="h-4 w-16 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Total WIP */}
          <td className="px-5 py-4">
            <div className="h-4 w-16 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Total Output */}
          <td className="px-5 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Total Target */}
          <td className="px-5 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Achievement (%) */}
          <td className="px-5 py-4">
            <div className="h-4 w-12 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Detail Logs Link */}
          <td className="px-5 py-4 text-right">
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-card-secondary" />
          </td>
        </tr>
      ))}
    </>
  )
}
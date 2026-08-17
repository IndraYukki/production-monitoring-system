

export default function DetailLogsTableSkeleton({ count = 10 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <tr key={index} className="border-b border-border">
          {/* Lot Date */}
          <td className="px-5 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Part Product (Name & Part No) */}
          <td className="px-5 py-4">
            <div className="space-y-1.5">
              <div className="h-4 w-32 animate-pulse rounded bg-card-secondary" />
              <div className="h-3 w-24 animate-pulse rounded bg-card-secondary" />
            </div>
          </td>

          {/* Machine & Shift */}
          <td className="px-5 py-4">
            <div className="space-y-1.5">
              <div className="h-4 w-16 animate-pulse rounded bg-card-secondary" />
              <div className="h-3 w-14 animate-pulse rounded bg-card-secondary" />
            </div>
          </td>

          {/* OK / WIP */}
          <td className="px-5 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Total NG */}
          <td className="px-5 py-4">
            <div className="h-4 w-12 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Total Output */}
          <td className="px-5 py-4">
            <div className="h-4 w-16 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Target */}
          <td className="px-5 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Uptime */}
          <td className="px-5 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Achieve (%) */}
          <td className="px-5 py-4">
            <div className="h-4 w-12 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Status Badge */}
          <td className="px-5 py-4">
            <div className="h-6 w-24 animate-pulse rounded-full bg-card-secondary" />
          </td>
        </tr>
      ))}
    </>
  )
}
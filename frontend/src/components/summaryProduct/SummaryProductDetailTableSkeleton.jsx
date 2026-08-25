export default function SummaryProductDetailTableSkeleton({ count = 10 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <tr key={index} className="border-b border-border">
          {/* Lot Date + Lot ID */}
          <td className="px-5 py-4">
            <div className="space-y-1.5">
              <div className="h-4 w-24 animate-pulse rounded bg-card-secondary" />
              <div className="h-3 w-16 animate-pulse rounded bg-card-secondary" />
            </div>
          </td>

          {/* Mesin / Shift */}
          <td className="px-5 py-4">
            <div className="h-6 w-28 animate-pulse rounded-md bg-card-secondary" />
          </td>

          {/* Operator Shift */}
          <td className="px-5 py-4">
            <div className="space-y-1.5">
              <div className="h-3 w-24 animate-pulse rounded bg-card-secondary" />
              <div className="h-3 w-20 animate-pulse rounded bg-card-secondary" />
            </div>
          </td>

          {/* Uptime */}
          <td className="px-5 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Qty OK / WIP */}
          <td className="px-5 py-4">
            <div className="space-y-1.5">
              <div className="h-4 w-24 animate-pulse rounded bg-card-secondary" />
              <div className="h-3 w-16 animate-pulse rounded bg-card-secondary" />
            </div>
          </td>

          {/* Total NG */}
          <td className="px-5 py-4">
            <div className="h-4 w-14 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Output / Target */}
          <td className="px-5 py-4">
            <div className="space-y-1.5">
              <div className="h-4 w-20 animate-pulse rounded bg-card-secondary" />
              <div className="h-3 w-24 animate-pulse rounded bg-card-secondary" />
            </div>
          </td>

          {/* % Achieve */}
          <td className="px-5 py-4">
            <div className="h-4 w-12 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* NG Rate */}
          <td className="px-5 py-4">
            <div className="h-4 w-12 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Detail */}
          <td className="px-5 py-4 text-right">
            <div className="ml-auto h-4 w-14 animate-pulse rounded bg-card-secondary" />
          </td>
        </tr>
      ))}
    </>
  )
}

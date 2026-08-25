export default function SummaryProductTableSkeleton({ count = 10 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <tr key={index} className="border-b border-border">
          {/* Customer */}
          <td className="px-5 py-4">
            <div className="h-6 w-24 animate-pulse rounded-md bg-card-secondary" />
          </td>

          {/* Part No & Name */}
          <td className="px-5 py-4">
            <div className="space-y-1.5">
              <div className="h-4 w-28 animate-pulse rounded bg-card-secondary" />
              <div className="h-3 w-20 animate-pulse rounded bg-card-secondary" />
            </div>
          </td>

          {/* Total Output */}
          <td className="px-5 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Total Target */}
          <td className="px-5 py-4">
            <div className="h-4 w-20 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Uptime */}
          <td className="px-5 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Total NG */}
          <td className="px-5 py-4">
            <div className="h-4 w-14 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* NG Rate */}
          <td className="px-5 py-4">
            <div className="h-4 w-12 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* % Achieve */}
          <td className="px-5 py-4">
            <div className="h-4 w-12 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Logs Link */}
          <td className="px-5 py-4 text-right">
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-card-secondary" />
          </td>
        </tr>
      ))}
    </>
  )
}

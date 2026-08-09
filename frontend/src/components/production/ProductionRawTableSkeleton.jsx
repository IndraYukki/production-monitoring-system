function ProductionRawTableSkeleton() {
  return (
    <tbody className="divide-y divide-border">
      {Array.from({ length: 10 }).map((_, index) => (
        <tr key={index}>
          
          {/* Customer */}
          <td className="px-5 py-4">
            <div className="h-4 w-24 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Part No */}
          <td className="px-5 py-4">
            <div className="h-4 w-28 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Part Name */}
          <td className="px-5 py-4">
            <div className="h-4 w-32 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Machine */}
          <td className="px-5 py-4">
            <div className="mx-auto h-4 w-16 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Operator */}
          <td className="px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 animate-pulse rounded-full bg-card-secondary" />
              <div className="h-4 w-20 animate-pulse rounded bg-card-secondary" />
            </div>
          </td>

          {/* Uptime */}
          <td className="px-5 py-4">
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* OK */}
          <td className="px-5 py-4">
            <div className="ml-auto h-4 w-14 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* NG */}
          <td className="px-5 py-4">
            <div className="ml-auto h-4 w-14 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Total Production */}
          <td className="px-5 py-4">
            <div className="ml-auto h-4 w-20 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Target */}
          <td className="px-5 py-4">
            <div className="ml-auto h-4 w-20 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Achievement */}
          <td className="px-5 py-4">
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-card-secondary" />
          </td>

          {/* Status */}
          <td className="px-5 py-4">
            <div className="mx-auto h-7 w-24 animate-pulse rounded-full bg-card-secondary" />
          </td>

          {/* Action */}
          <td className="px-5 py-4">
            <div className="mx-auto h-8 w-16 animate-pulse rounded-lg bg-card-secondary" />
          </td>

        </tr>
      ))}
    </tbody>
  )
}

export default ProductionRawTableSkeleton
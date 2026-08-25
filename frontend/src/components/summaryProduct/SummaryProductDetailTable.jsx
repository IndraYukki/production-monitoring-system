import React from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { formatPercent } from '../../utils/format'
import SummaryProductDetailTableSkeleton from './SummaryProductDetailTableSkeleton'

export default function SummaryProductDetailTable({
  pageData,
  loading,
  halaman,
  setHalaman,
  jumlah,
  setJumlah,
  onRowClick,
  sortConfig,
  onSort,
}) {
  const content = pageData?.content || []
  const totalPages = pageData?.totalPages || 0

  // Render Ikon Sorting di Header (Identik dengan SummaryProductTable)
  const renderSortIcon = (columnName) => {
    if (sortConfig?.sortBy !== columnName) return null
    return (
      <span className="ml-1 text-[10px] text-info">
        {sortConfig.sortDir === 'asc' ? '▲' : '▼'}
      </span>
    )
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Table Header Controls */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 className="font-semibold text-foreground">Histori Transaksi Produksi</h2>
          <p className="mt-1 text-xs text-muted">
            {pageData.totalElements ?? 0} log transaksi ditemukan pada periode ini
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2 text-sm text-muted">
            <span>Rows</span>
            <div className="relative">
              <select
                value={jumlah}
                onChange={(e) => {
                  setJumlah(Number(e.target.value))
                  setHalaman(0)
                }}
                className="appearance-none rounded-lg border border-border bg-background py-2 pl-3 pr-8 text-foreground outline-none focus:border-info"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="max-h-125 overflow-auto">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="sticky top-0 z-20 bg-card-secondary text-xs uppercase tracking-[0.08em] text-muted">
            <tr>
              {/* Lot Date */}
              <th
                onClick={() => onSort('productionLot')}
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                Lot Date {renderSortIcon('productionLot')}
              </th>

              {/* Machine & Shift */}
              <th className="px-5 py-3 font-medium">Mesin / Shift</th>

              {/* Operators */}
              <th className="px-5 py-3 font-medium">Operator Shift</th>

              {/* Uptime */}
              <th
                onClick={() => onSort('uptimeMc')}
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                Uptime {renderSortIcon('uptimeMc')}
              </th>

              {/* Qty OK / WIP */}
              <th
                onClick={() => onSort('qtyOk')}
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                Qty OK / WIP {renderSortIcon('qtyOk')}
              </th>

              {/* Total NG */}
              <th className="px-5 py-3 font-medium">Total NG</th>

              {/* Output / Target */}
              <th
                onClick={() => onSort('totalOutput')}
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                Output / Target {renderSortIcon('totalOutput')}
              </th>

              {/* % Achieve */}
              <th className="px-5 py-3 font-medium">% Achieve</th>

              {/* NG Rate */}
              <th
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                NG Rate {renderSortIcon('ngRate')}
              </th>

              {/* Detail Action */}
              <th className="px-5 py-3 text-right font-medium">Detail</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading ? (
              <SummaryProductDetailTableSkeleton count={jumlah} />
            ) : content.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-5 py-8 text-center text-muted">
                  Tidak ada histori log produksi ditemukan.
                </td>
              </tr>
            ) : (
              content.map((log) => {
                const isTargetAchieved = (log.achievePct || 0) >= 100
                const operators = [log.operator1Name, log.operator2Name, log.operator3Name]
                  .filter(Boolean)
                  .join(', ')

                return (
                  <tr
                    key={log.productionId}
                    onClick={() => onRowClick(log)}
                    className="transition hover:bg-card-secondary/40 cursor-pointer"
                  >
                    {/* Lot Date + Avatar Initials */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-foreground hover:text-info">
                            {log.productionLot}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Machine & Shift */}
                    <td className="px-5 py-4">
                      <span className="rounded-md px-2.5 py-1 text-xs font-semibold text-foreground">
                        {log.machineName || '-'}
                      </span>
                      <span>{log.shift}</span>
                    </td>

                    {/* Operators */}
                        <td className="px-5 py-4 text-xs text-muted">
                        {operators ? (
                            <div className="flex flex-col gap-0.5 font-medium text-foreground">
                            {[log.operator1Name, log.operator2Name, log.operator3Name]
                                .filter(Boolean)
                                .map((name, idx) => (
                                <span key={idx} className="block truncate max-w-36">
                                    {name}
                                </span>
                                ))}
                            </div>
                        ) : (
                            <span>-</span>
                        )}
                        </td>

                    {/* Uptime */}
                    <td className="px-5 py-4 font-mono text-xs text-foreground">
                      {log.uptimeDisplay || '-'}
                    </td>

                    {/* Qty OK / WIP */}
                    <td className="px-5 py-4 text-xs">
                      <span className="block font-medium text-success">
                        {(log.qtyOk || 0).toLocaleString('id-ID')} OK
                      </span>
                      {(log.qtyWip || 0) > 0 && (
                        <span className="block text-warning">
                          {(log.qtyWip || 0).toLocaleString('id-ID')} WIP
                        </span>
                      )}
                    </td>

                    {/* Total NG */}
                    <td className="px-5 py-4 font-medium text-danger">
                      {(log.totalNg || 0).toLocaleString('id-ID')}
                    </td>

                    {/* Output / Target */}
                    <td className="px-5 py-4">
                      <span className="block font-medium text-foreground">
                        {(log.totalOutput || 0).toLocaleString('id-ID')}
                      </span>
                      <span className="block text-xs text-muted">
                        Target: {(log.target || 0).toLocaleString('id-ID')}
                      </span>
                    </td>

                    {/* % Achieve */}
                    <td className="px-5 py-4">
                      <span
                        className={
                          isTargetAchieved
                            ? 'font-semibold text-success'
                            : 'font-semibold text-danger'
                        }
                      >
                        {formatPercent(log.achievePct)}
                      </span>
                    </td>

                    {/* NG Rate */}
                    <td className="px-5 py-4 font-mono text-xs text-warning">
                      {formatPercent(log.ngRate)}
                    </td>                    

                    {/* Action Link */}
                    <td className="px-5 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 font-medium text-info hover:underline">
                        <span>Detail</span>
                        <ArrowRight className="size-4" />
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted">
        <span>
          Halaman {halaman + 1} dari {Math.max(totalPages, 1)}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={halaman === 0 || loading}
            onClick={() => setHalaman((prev) => Math.max(prev - 1, 0))}
            className="rounded-lg border border-border bg-card-secondary px-3 py-1.5 font-medium text-foreground transition hover:bg-background disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={halaman >= totalPages - 1 || loading}
            onClick={() => setHalaman((prev) => prev + 1)}
            className="rounded-lg border border-border bg-card-secondary px-3 py-1.5 font-medium text-foreground transition hover:bg-background disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  )
}
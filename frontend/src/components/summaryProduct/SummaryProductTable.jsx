import React, { useState, useEffect } from 'react'
import { Search, ArrowRight, ChevronDown } from 'lucide-react'
import { formatPercent } from '../../utils/format'
import SummaryProductTableSkeleton from './SummaryProductTableSkeleton'

export default function SummaryProductTable({
  pageData,
  loading,
  keyword,
  setKeyword,
  halaman,
  setHalaman,
  jumlah,
  setJumlah,
  onRowClick,
  sortConfig,
  onSort,
}) {
  const [searchTerm, setSearchTerm] = useState(keyword || '')

  // Debounce Search untuk menghemat panggilan API
  useEffect(() => {
    const handler = setTimeout(() => {
      setKeyword(searchTerm)
      setHalaman(0)
    }, 400)

    return () => clearTimeout(handler)
  }, [searchTerm, setKeyword, setHalaman])

  const content = pageData?.content || []
  const totalPages = pageData?.totalPages || 0

  // Render Ikon Sorting di Header
  const renderSortIcon = (columnName) => {
    if (sortConfig.sortBy !== columnName) return null
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
          <h2 className="font-semibold text-foreground">Product Performance</h2>
          <p className="mt-1 text-xs text-muted">
            {pageData.totalElements ?? 0} produk ditemukan
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Bar (hanya refresh tabel) */}
          <div className="relative min-w-60">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
                setHalaman(0)
              }}
              placeholder="Cari Part No atau Part Name..."
              className="h-10 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-info"
            />
          </div>

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
        <table className="w-full min-w-200 text-left text-sm">
          <thead className="sticky top-0 z-20 bg-card-secondary text-xs uppercase tracking-[0.08em] text-muted">
            <tr>
              {/* Customer */}
              <th
                onClick={() => onSort('customerName')}
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                Customer {renderSortIcon('customerName')}
              </th>
              {/* Part No / Name */}
              <th
                onClick={() => onSort('partNo')}
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                Part No / Name {renderSortIcon('partNo')}
              </th>


              {/* Total Output */}
              <th
                onClick={() => onSort('totalOutput')}
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                Total Output {renderSortIcon('totalOutput')}
              </th>

              {/* Total Target */}
              <th
                onClick={() => onSort('totalTarget')}
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                Total Target {renderSortIcon('totalTarget')}
              </th>

              {/* Uptime */}
              <th className="px-5 py-3 font-medium">Uptime</th>

              {/* Total NG */}
              <th
                onClick={() => onSort('totalNg')}
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                Total NG {renderSortIcon('totalNg')}
              </th>

              {/* NG Rate */}
              <th
                onClick={() => onSort('ngRate')}
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                NG Rate {renderSortIcon('ngRate')}
              </th>

              {/* % Achieve */}
              <th
                onClick={() => onSort('achievePct')}
                className="px-5 py-3 font-medium cursor-pointer select-none hover:text-info transition"
              >
                % Achieve {renderSortIcon('achievePct')}
              </th>

              {/* Total Logs */}
              <th
                onClick={() => onSort('totalLogs')}
                className="px-5 py-3 text-right font-medium cursor-pointer select-none hover:text-info transition"
              >
                Logs {renderSortIcon('totalLogs')}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading ? (
              <SummaryProductTableSkeleton count={jumlah} />
            ) : content.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-8 text-center text-muted">
                  Tidak ada data produk ditemukan.
                </td>
              </tr>
            ) : (
              content.map((row) => {
                const isTargetAchieved = (row.achievePct || 0) >= 100

                return (
                  <tr
                    key={row.productId}
                    onClick={() => onRowClick(row.productId)}
                    className="transition hover:bg-card-secondary/40 cursor-pointer"
                  >
                    {/* Customer Name */}
                    <td className="px-5 py-4 wrap-break-word max-w-30 flex justify-center">
                      <span className="px-2.5 py-1 text-xs font-semibold text-foreground ">
                        {row.customerName || '-'}
                      </span>
                    </td>

                    {/* Part No & Name */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="block font-medium text-foreground hover:text-info">
                            {row.partNo}
                          </span>
                          <span className="block text-xs text-muted">
                            {row.partName || '-'}
                          </span>
                        </div>
                      </div>
                    </td>


                    {/* Total Output */}
                    <td className="px-5 py-4 font-medium text-foreground">
                      {(row.totalOutput || 0).toLocaleString('id-ID')}
                    </td>

                    {/* Total Target */}
                    <td className="px-5 py-4 text-muted">
                      {(row.totalTarget || 0).toLocaleString('id-ID')}
                    </td>

                    {/* Uptime */}
                    <td className="px-5 py-4 text-xs text-muted">
                      {row.uptimeDisplay || `${(row.totalUptime ?? 0).toLocaleString('id-ID')} mnt`}
                    </td>

                    {/* Total NG */}
                    <td className="px-5 py-4 font-medium text-danger">
                      {(row.totalNg || 0).toLocaleString('id-ID')}
                    </td>

                    {/* NG Rate */}
                    <td className="px-5 py-4 font-mono text-xs text-warning">
                      {formatPercent(row.ngRate)}
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
                        {formatPercent(row.achievePct)}
                      </span>
                    </td>

                    {/* Total Logs */}
                    <td className="px-5 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 font-medium text-info hover:underline">
                        <span>{row.totalLogs ?? 0} Logs</span>
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

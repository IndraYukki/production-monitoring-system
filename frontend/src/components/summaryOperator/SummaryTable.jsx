import React from 'react'
import { Search, ChevronDown, ArrowRight } from 'lucide-react'

const SummaryTable = ({
  pageData,
  loading,
  keyword,
  setKeyword,
  halaman,
  setHalaman,
  jumlah,
  setJumlah,
  onRowClick,
}) => {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Table Header Controls */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 className="font-semibold text-foreground">Operator Performance</h2>
          <p className="mt-1 text-xs text-muted">
            {pageData.totalElements ?? 0} operator ditemukan
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search Bar (hanya refresh tabel) */}
          <div className="relative min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
                setHalaman(0)
              }}
              placeholder="Cari nama atau NIK operator"
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
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-card-secondary text-xs uppercase tracking-[0.08em] text-muted sticky top-0">
            <tr>
              <th className="px-5 py-3 font-medium">Operator</th>
              <th className="px-5 py-3 font-medium">Group</th>
              <th className="px-5 py-3 font-medium">Total OK</th>
              <th className="px-5 py-3 font-medium">Total WIP</th>
              <th className="px-5 py-3 font-medium">Total Output</th>
              <th className="px-5 py-3 font-medium">Total Target</th>
              <th className="px-5 py-3 font-medium">Achievement</th>
              <th className="px-5 py-3 text-right font-medium">Detail Log</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-muted">
                  Memuat data operator...
                </td>
              </tr>
            ) : pageData.content?.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-muted">
                  Tidak ada data operator ditemukan.
                </td>
              </tr>
            ) : (
              pageData.content?.map((op) => (
                <tr
                  key={op.operatorId}
                  onClick={() => onRowClick(op.operatorId)}
                  className="transition hover:bg-card-secondary/40 cursor-pointer"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-info/10 text-xs font-semibold text-info">
                        {(op.operatorName || 'OP')
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </span>
                      <div>
                        <span className="block font-medium text-foreground hover:text-info">
                          {op.operatorName}
                        </span>
                        <span className="block text-xs text-muted">
                          NIK {op.nik || '-'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-card-secondary border border-border px-2.5 py-1 text-xs font-semibold text-foreground">
                      Group {op.groub}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-success">
                    {(op.totalOk ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="px-5 py-4 font-medium text-warning">
                    {(op.totalWip ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="px-5 py-4 font-medium text-foreground">
                    {(op.totalOutput ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="px-5 py-4 text-muted">
                    {(op.totalTarget ?? 0).toLocaleString('id-ID')}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={
                        (op.achievePercent ?? 0) >= 100
                          ? 'font-semibold text-success'
                          : 'font-semibold text-danger'
                      }
                    >
                      {op.achievePercent ?? 0}%
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="inline-flex items-center gap-1.5 font-medium text-info hover:underline">
                        <span>{op.totalLogs ?? 0} Logs</span>
                        <ArrowRight className="size-4" />
                    </span>
                 </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted">
        <span>
          Halaman {halaman + 1} dari {pageData.totalPages || 1}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={halaman === 0 || loading}
            onClick={() => setHalaman((prev) => prev - 1)}
            className="rounded-lg border border-border bg-card-secondary px-3 py-1.5 font-medium text-foreground transition hover:bg-background disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={halaman >= pageData.totalPages - 1 || loading}
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

export default SummaryTable
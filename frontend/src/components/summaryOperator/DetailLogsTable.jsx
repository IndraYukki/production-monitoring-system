import { ChevronDown } from 'lucide-react'
import DetailLogsTableSkeleton from './DetailLogsTableSkeleton'

export default function DetailLogsTable({
  pageData,
  loading,
  halaman,
  setHalaman,
  jumlah,
  setJumlah,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Table Header Controls */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 className="font-semibold text-foreground">Production Logs</h2>
          <p className="mt-1 text-xs text-muted">
            {pageData.totalElements ?? 0} log produksi tercatat untuk operator ini
          </p>
        </div>

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

      {/* Data Table */}
      <div className="max-h-125 overflow-auto">
        <table className="w-full min-w-205 text-left text-sm">
          <thead className="bg-card-secondary text-xs uppercase tracking-[0.08em] text-muted sticky top-0">
            <tr>
              <th className="px-5 py-3 font-medium">Lot Date</th>
              <th className="px-5 py-3 font-medium">Part Product</th>
              <th className="px-5 py-3 font-medium">Machine & Shift</th>
              <th className="px-5 py-3 font-medium">OK / WIP</th>
              <th className="px-5 py-3 font-medium text-danger">Total NG</th>
              <th className="px-5 py-3 font-medium">Total Output</th>
              <th className="px-5 py-3 font-medium">Target</th>
              <th className="px-5 py-3 font-medium">Uptime</th>
              <th className="px-5 py-3 font-medium">Achieve (%)</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <DetailLogsTableSkeleton count={jumlah} />
            ) : pageData.content?.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-5 py-8 text-center text-muted">
                  Belum ada log produksi pada rentang tanggal ini.
                </td>
              </tr>
            ) : (
              pageData.content?.map((log) => {
                const isTercapai = log.status === 'Tercapai' || (log.achievePercent ?? 0) >= 100

                return (
                  <tr key={log.productionId} className="hover:bg-card-secondary/40 transition">
                    <td className="px-5 py-4 text-xs text-muted">
                      {log.productionLot || '-'}
                    </td>
                    <td className="px-5 py-4">
                      <span className="block font-medium text-foreground">
                        {log.partName || '-'}
                      </span>
                      <span className="text-xs text-muted">
                        {log.partNo || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="block font-medium text-foreground">
                        {log.machineName || '-'}
                      </span>
                      <span className="text-xs text-muted">
                        {log.shift || '-'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <span className="text-success font-medium">
                        {(log.qtyOk ?? 0).toLocaleString('id-ID')} OK
                      </span>
                      <span className="text-muted"> / </span>
                      <span className="text-warning font-medium">
                        {(log.qtyWip ?? 0).toLocaleString('id-ID')} WIP
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-danger">
                      {((log.totalOutput ?? 0) - ((log.qtyOk ?? 0) + (log.qtyWip ?? 0))).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-4 font-medium text-foreground">
                      {(log.totalOutput ?? 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-4 text-muted">
                      {(log.target ?? 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted">
                      {log.uptimeDisplay || `${log.uptimeMc ?? 0} mnt`}
                    </td>
                    <td className="px-5 py-4">
                      <span className={isTercapai ? 'font-semibold text-success' : 'font-semibold text-danger'}>
                        {log.achievePercent ?? 0}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isTercapai
                            ? 'bg-accent text-success'
                            : 'bg-danger/15 text-danger'
                        }`}
                      >
                        <span className="size-1.5 rounded-full bg-current" />
                        {log.status || (isTercapai ? 'Tercapai' : 'Tidak Target')}
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
import React from 'react'
import { AlertTriangle } from 'lucide-react'

export default function SummaryProductNgChart({ data = [], loading = false }) {
  // Hitung angka NG tertinggi untuk menentukan persentase tinggi batang chart
  const maxNg = Math.max(...data.map((item) => item.totalNg || 0), 1)
  const totalAllNg = data.reduce((acc, curr) => acc + (curr.totalNg || 0), 0)

  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-danger">
            <AlertTriangle className="size-4" /> Pareto NG Defect
          </div>
          <h2 className="mt-1 text-lg font-bold text-foreground">
            Distribusi Jenis Defect (NG)
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-muted">Total NG Accumulation</span>
          <p className="text-lg font-extrabold text-danger">
            {loading ? '...' : totalAllNg.toLocaleString('id-ID')} <span className="text-xs font-normal text-muted">pcs</span>
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted">
          Memuat diagram defect...
        </div>
      ) : data.length === 0 ? (
        <div className="flex h-48 items-center justify-center text-sm text-muted">
          Tidak ada data defect (NG) pada periode ini.
        </div>
      ) : (
        <div className="flex h-56 items-end gap-3 overflow-x-auto pb-2 pt-6">
          {data.map((item, index) => {
            const heightPercent = Math.round(((item.totalNg || 0) / maxNg) * 100)
            const percentageFromTotal = totalAllNg > 0 
              ? (((item.totalNg || 0) / totalAllNg) * 100).toFixed(1) 
              : 0

            return (
              <div
                key={index}
                className="group flex flex-1 min-w-[60px] max-w-[90px] flex-col items-center h-full justify-end"
              >
                {/* Tooltip Hover Value */}
                <span className="mb-1 text-[11px] font-bold text-foreground opacity-80 group-hover:opacity-100 transition">
                  {(item.totalNg || 0).toLocaleString('id-ID')}
                </span>

                {/* Vertical Bar */}
                <div className="relative w-full rounded-t-xl bg-card-secondary h-full flex items-end overflow-hidden p-1">
                  <div
                    style={{ height: `${Math.max(heightPercent, 6)}%` }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-danger/60 to-danger transition-all duration-500 group-hover:brightness-125"
                  />
                </div>

                {/* Label Defect Name */}
                <span className="mt-2 text-center text-[11px] font-medium text-muted truncate w-full group-hover:text-foreground">
                  {item.defectName}
                </span>
                <span className="text-[10px] text-muted/70">{percentageFromTotal}%</span>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
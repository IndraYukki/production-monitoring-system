import React from 'react'
import { Package, Target, AlertOctagon, TrendingUp, Percent, Clock } from 'lucide-react'

export default function SummaryProductCards({ cardsData, loading }) {
  const {
    totalOutput = 0,
    totalTarget = 0,
    totalNg = 0,
    totalNgRate = 0,
    totalAchieve = 0,
    totalUptime = 0,
    uptimeDisplay = '',
  } = cardsData || {}

  const isTargetAchieved = totalAchieve >= 100

  return (
    <section aria-label="Product Summary Cards" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* 1. Total Output */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-border/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">Total Output</span>
          <div className="rounded-xl bg-info/10 p-2 text-info">
            <Package className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {loading ? '...' : totalOutput.toLocaleString('id-ID')}
          </p>
          <span className="text-xs text-muted">pcs akumulasi</span>
        </div>
      </div>

      {/* 2. Total Target */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-border/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">Total Target</span>
          <div className="rounded-xl bg-accent/10 p-2 text-accent">
            <Target className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {loading ? '...' : totalTarget.toLocaleString('id-ID')}
          </p>
          <span className="text-xs text-muted">pcs target terhitung</span>
        </div>
      </div>

      {/* 3. Total NG */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-border/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">Total Defect (NG)</span>
          <div className="rounded-xl bg-danger/10 p-2 text-danger">
            <AlertOctagon className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-danger">
            {loading ? '...' : totalNg.toLocaleString('id-ID')}
          </p>
          <span className="text-xs text-muted">pcs produk reject</span>
        </div>
      </div>

      {/* 4. NG Rate */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-border/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">NG Rate</span>
          <div className="rounded-xl bg-warning/10 p-2 text-warning">
            <Percent className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-warning">
            {loading ? '...' : `${totalNgRate}%`}
          </p>
          <span className="text-xs text-muted">persentase reject</span>
        </div>
      </div>

      {/* 5. Target Achieved */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-border/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">% Achieved</span>
          <div className={`rounded-xl p-2 ${isTargetAchieved ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
            <TrendingUp className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className={`text-2xl font-bold tracking-tight ${isTargetAchieved ? 'text-success' : 'text-danger'}`}>
            {loading ? '...' : `${totalAchieve}%`}
          </p>
          <span className="text-xs text-muted">
            {isTargetAchieved ? '✓ Memenuhi Target' : '✕ Di Bawah Target'}
          </span>
        </div>
      </div>

      {/* 6. Total Uptime */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-border/80">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">Total Uptime</span>
          <div className="rounded-xl bg-success/10 p-2 text-success">
            <Clock className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {loading ? '...' : (uptimeDisplay || `${totalUptime.toLocaleString('id-ID')} mnt`)}
          </p>
          <span className="text-xs text-muted">total jam mesin produksi</span>
        </div>
      </div>
    </section>
  )
}
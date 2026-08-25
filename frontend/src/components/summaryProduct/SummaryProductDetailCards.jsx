import React from 'react'
import { Package, CheckCircle2, Clock, AlertOctagon, Target, Percent, FileText, Hourglass, TrendingUp } from 'lucide-react'

export default function SummaryProductDetailCards({ cardsData, loading }) {
  const {
    totalOutput = 0,
    totalTarget = 0,
    totalOk = 0,
    totalWip = 0,
    totalNg = 0,
    ngRate = 0,
    achievePct = 0,
    totalLogs = 0,
    totalLogsAchieve = 0,
    totalUptime = 0,
    uptimeDisplay = '',
  } = cardsData || {}

  const isTargetAchieved = achievePct >= 100

  return (
    <section aria-label="Product Detail Cards" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* 1. Total Output */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
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
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
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

      {/* 3. Qty OK */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">Qty OK</span>
          <div className="rounded-xl bg-success/10 p-2 text-success">
            <CheckCircle2 className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-success">
            {loading ? '...' : totalOk.toLocaleString('id-ID')}
          </p>
          <span className="text-xs text-muted">pcs baik</span>
        </div>
      </div>

      {/* 4. Qty WIP */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">Qty WIP</span>
          <div className="rounded-xl bg-warning/10 p-2 text-warning">
            <Hourglass className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-warning">
            {loading ? '...' : totalWip.toLocaleString('id-ID')}
          </p>
          <span className="text-xs text-muted">pcs work in progress</span>
        </div>
      </div>

      {/* 5. Total NG */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">Total NG</span>
          <div className="rounded-xl bg-danger/10 p-2 text-danger">
            <AlertOctagon className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-danger">
            {loading ? '...' : totalNg.toLocaleString('id-ID')}
          </p>
          <span className="text-xs text-muted">pcs rijek</span>
        </div>
      </div>

      {/* 6. NG Rate */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">NG Rate</span>
          <div className="rounded-xl bg-warning/10 p-2 text-warning">
            <Percent className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-warning">
            {loading ? '...' : `${ngRate}%`}
          </p>
          <span className="text-xs text-muted">persentase reject</span>
        </div>
      </div>

      {/* 7. % Achieve */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">% Achieve</span>
          <div className={`rounded-xl p-2 ${isTargetAchieved ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
            <TrendingUp className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className={`text-2xl font-bold tracking-tight ${isTargetAchieved ? 'text-success' : 'text-danger'}`}>
            {loading ? '...' : `${achievePct}%`}
          </p>
          <span className="text-xs text-muted">
            {isTargetAchieved ? '✓ Target Tercapai' : '✕ Tidak Target'}
          </span>
        </div>
      </div>

      {/* 8. Total Uptime */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
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
          <span className="text-xs text-muted">total mesin produksi</span>
        </div>
      </div>

      {/* 9. Total Logs */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted">Total Logs</span>
          <div className="rounded-xl bg-info/10 p-2 text-info">
            <FileText className="size-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {loading ? '...' : totalLogs.toLocaleString('id-ID')}
          </p>
          <span className="text-xs text-muted">{totalLogsAchieve} log mencapai target</span>
        </div>
      </div>
    </section>
  )
}

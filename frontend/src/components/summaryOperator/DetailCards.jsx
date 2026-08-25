import React from 'react'
import {
  ClipboardList,
  Target,
  TrendingUp,
  PackageSearch,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { formatPercent } from '../../utils/format'

function MiniStatCard({ label, value, detail, icon: Icon, tone = 'blue' }) {
  const toneClasses = {
    blue: 'bg-info/15 text-info',
    violet: 'bg-accent/15 text-accent',
    green: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
    danger: 'bg-danger/15 text-danger',
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className={`rounded-xl p-2 ${toneClasses[tone] || toneClasses.blue}`}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-3">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
          {label}
        </p>
        <p className="mt-1 text-xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="mt-0.5 text-[11px] text-muted">{detail}</p>
      </div>
    </div>
  )
}

export default function DetailCards({ cardsData, loading }) {
  if (loading) {
    return (
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-28 rounded-2xl border border-border bg-card p-4 animate-pulse"
          />
        ))}
      </section>
    )
  }

  const output = cardsData?.totalOutput ?? 0
  const target = cardsData?.totalTarget ?? 0
  const ok = cardsData?.totalOk ?? 0
  const wip = cardsData?.totalWip ?? 0
  const ng = cardsData?.totalNg ?? 0
  const achievePercent = cardsData?.achievePercent ?? 0
  const uptime = cardsData?.uptimeDisplay ?? 0
  const logs = cardsData?.totalLogs ?? 0
  const logsAchieve = cardsData?.totalLogsAchieve ?? 0

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      <MiniStatCard
        label="Total Output"
        value={output.toLocaleString('id-ID')}
        detail={`OK: ${ok.toLocaleString('id-ID')} | WIP: ${wip.toLocaleString('id-ID')} | NG: ${ng.toLocaleString('id-ID')}`}
        icon={ClipboardList}
        tone="blue"
      />
      <MiniStatCard
        label="Total Target"
        value={target.toLocaleString('id-ID')}
        detail="Target akumulasi"
        icon={Target}
        tone="violet"
      />
      <MiniStatCard
        label="Achievement"
        value={formatPercent(achievePercent)}
        detail="Total pencapaian"
        icon={TrendingUp}
        tone={achievePercent >= 100 ? 'green' : 'danger'}
      />
      <MiniStatCard
        label="Total NG"
        value={ng.toLocaleString('id-ID')}
        detail="Jumlah defect"
        icon={AlertTriangle}
        tone={ng > 0 ? 'danger' : 'blue'}
      />
      <MiniStatCard
        label="Total Log"
        value={`${logs}`}
        detail="Shift terekam"
        icon={PackageSearch}
        tone="blue"
      />
      <MiniStatCard
        label="Log Tercapai"
        value={`${logsAchieve} / ${logs}`}
        detail="Memenuhi target"
        icon={CheckCircle2}
        tone="green"
      />
      <MiniStatCard
        label="Total Uptime"
        value={uptime}
        detail="Waktu mesin jalan"
        icon={Clock}
        tone="violet"
      />
    </section>
  )
}
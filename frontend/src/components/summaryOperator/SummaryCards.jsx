import React from 'react'
import { ClipboardList, Target, CheckCircle2 } from 'lucide-react'

function StatCard({ label, value, detail, icon: Icon, tone }) {
  const toneClasses = {
    blue: 'bg-info/15 text-info',
    violet: 'bg-accent/15 text-accent',
    green: 'bg-success/15 text-success',
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs text-muted">{detail}</p>
        </div>
        <span className={`rounded-xl p-2.5 ${toneClasses[tone] || toneClasses.blue}`}>
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
    </div>
  )
}

export default function SummaryCards({ cardsData, loading }) {
  return (
    <section className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Total output"
        value={loading ? '...' : (cardsData?.totalOutput ?? 0).toLocaleString('id-ID')}
        detail="Unit diproduksi"
        icon={ClipboardList}
        tone="blue"
      />
      <StatCard
        label="Total target"
        value={loading ? '...' : (cardsData?.totalTarget ?? 0).toLocaleString('id-ID')}
        detail="Target periode aktif"
        icon={Target}
        tone="violet"
      />
      <StatCard
        label="Achievement"
        value={loading ? '...' : `${cardsData?.totalAchieve ?? 0}%`}
        detail="Rata-rata pencapaian"
        icon={CheckCircle2}
        tone="green"
      />
    </section>
  )
}
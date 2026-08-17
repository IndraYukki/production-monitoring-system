import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PlusCircle,
  Users,
  ClipboardList,
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Activity,
} from 'lucide-react'

export default function DashboardLandingPage() {
  const navigate = useNavigate()

  const getTodayFormatted = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        
        {/* Header Landing Page */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-info">
              <span className="size-2 rounded-full bg-success animate-pulse" /> Live Production System
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl text-foreground">
              Production Control Center
            </h1>
            <p className="mt-1 text-sm text-muted">
              Sistem Pemantauan Produksi & Performance Plastic Injection Molding.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-muted">
            <Calendar className="size-4 text-info" />
            <span>{getTodayFormatted()}</span>
          </div>
        </header>

        {/* Quick Action Navigation Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          <div
            onClick={() => navigate('/add-production')}
            className="group cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-info hover:bg-card-secondary/60"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-info/15 p-3 text-info group-hover:bg-info group-hover:text-white transition">
                <PlusCircle className="size-6" />
              </span>
              <ArrowRight className="size-5 text-muted group-hover:text-info transition transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">Input Produksi</h3>
            <p className="mt-1 text-xs text-muted">Form pencatatan hasil output & defect shift</p>
          </div>

          <div
            onClick={() => navigate('/operator-summary')}
            className="group cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-info hover:bg-card-secondary/60"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-accent/15 p-3 text-accent group-hover:bg-accent group-hover:text-white transition">
                <Users className="size-6" />
              </span>
              <ArrowRight className="size-5 text-muted group-hover:text-info transition transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">Performance Operator</h3>
            <p className="mt-1 text-xs text-muted">Analisis output & pencapaian target operator</p>
          </div>

          <div
            onClick={() => navigate('/production-logs')}
            className="group cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-info hover:bg-card-secondary/60"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-success/15 p-3 text-success group-hover:bg-success group-hover:text-white transition">
                <ClipboardList className="size-6" />
              </span>
              <ArrowRight className="size-5 text-muted group-hover:text-info transition transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">Production Logs</h3>
            <p className="mt-1 text-xs text-muted">Histori seluruh transaksi produksi mesin</p>
          </div>

          <div
            onClick={() => navigate('/product')}
            className="group cursor-pointer rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-info hover:bg-card-secondary/60"
          >
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-warning/15 p-3 text-warning group-hover:bg-warning group-hover:text-white transition">
                <Package className="size-6" />
              </span>
              <ArrowRight className="size-5 text-muted group-hover:text-info transition transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground">Master Data</h3>
            <p className="mt-1 text-xs text-muted">Kelola data Product, Customer & Operator</p>
          </div>

        </section>

        {/* Section Dashboard Status Preview (Placeholder Data Sementara) */}
        <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Ringkasan Sistem</h2>
              <p className="text-xs text-muted">Status integrasi modul monitoring saat ini</p>
            </div>
            <span className="rounded-full bg-info/15 px-3 py-1 text-xs font-semibold text-info flex items-center gap-1.5">
              <Activity className="size-3.5" /> Operational
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card-secondary p-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="size-5 text-success" />
                <div>
                  <p className="text-xs text-muted">Master Data</p>
                  <p className="text-sm font-semibold text-foreground">Product & Operator Stabil</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card-secondary p-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="size-5 text-info" />
                <div>
                  <p className="text-xs text-muted">Modul Summary</p>
                  <p className="text-sm font-semibold text-foreground">Operator Summary Active</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card-secondary p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="size-5 text-warning" />
                <div>
                  <p className="text-xs text-muted">Next Milestone</p>
                  <p className="text-sm font-semibold text-foreground">Production Summary & Refactor</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
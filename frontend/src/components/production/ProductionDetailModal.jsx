import { formatPercent, formatDateTime } from '../../utils/format'

function ProductionDetailModal({
  open,
  onClose,
  production,
}) {
  if (!open || !production) return null

  const defects = production?.defects || []

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">

      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">

          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Production Detail
            </h2>

            <p className="mt-1 text-sm text-muted">
              Complete production report information.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition hover:bg-card-secondary hover:text-foreground"
          >
            ✕
          </button>

        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6">

          {/* =============================== */}
          {/* Production Information */}
          {/* =============================== */}

          <section className="mb-8">

            <h3 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground">
              Production Information
            </h3>

            <div className="grid gap-4 md:grid-cols-3">

              <div>
                <p className="text-xs uppercase text-muted">Customer</p>
                <p className="mt-1 font-medium text-foreground">
                  {production.customerName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-muted">Part Number</p>
                <p className="mt-1 font-bold text-accent">
                  {production.partNo}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-muted">Part Name</p>
                <p className="mt-1 font-bold text-info">
                  {production.partName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-muted">Machine</p>
                <p className="mt-1 font-medium text-foreground">
                  {production.machineName}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-muted">Shift</p>
                <p className="mt-1 font-medium text-foreground">
                  {production.shift}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-muted">Group</p>
                <p className="mt-1 font-medium text-foreground">
                  {production.groub1 === "RESIGN" ? (production.groub2) : (production.groub1)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-muted">Production Lot</p>
                <p className="mt-1 font-medium text-foreground">
                  {production.productionLot}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase text-muted">Di Rekap</p>
                <p className="mt-1 font-medium text-foreground">
                  {formatDateTime(production.createdAt)}
                </p>
              </div>

            </div>

          </section>

          {/* =============================== */}
          {/* Operator */}
          {/* =============================== */}

          <section className="mb-8">

            <h3 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground">
              Operator Information
            </h3>

            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-xl bg-card-secondary p-4">
                <p className="text-xs text-muted">Operator 1</p>
                <p className="mt-2 font-semibold text-foreground">
                  {production.operator1Name ?? "-"}
                </p>
              </div>

              <div className="rounded-xl bg-card-secondary p-4">
                <p className="text-xs text-muted">Operator 2</p>
                <p className="mt-2 font-semibold text-foreground">
                  {production.operator2Name ?? "-"}
                </p>
              </div>

              <div className="rounded-xl bg-card-secondary p-4">
                <p className="text-xs text-muted">Operator 3</p>
                <p className="mt-2 font-semibold text-muted">
                  {production.operator3Name ?? "-"}
                </p>
              </div>

            </div>

          </section>

          {/* =============================== */}
          {/* Production Result */}
          {/* =============================== */}

          <section className="mb-8">

            <h3 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground">
              Production Result
            </h3>

            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-xl bg-card-secondary p-4">
                <p className="text-xs text-muted">Uptime</p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {production.uptimeDisplay || '-'}
                </p>
              </div>

              <div className="rounded-xl bg-card-secondary p-4">
                <p className="text-xs text-muted">OK Qty</p>
                <p className="mt-2 text-lg font-semibold text-success">
                  {production.qtyOk}
                </p>
              </div>

              <div className="rounded-xl bg-card-secondary p-4">
                <p className="text-xs text-muted">WIP Qty</p>
                <p className="mt-2 text-lg font-semibold text-warning">
                  {production.qtyWip}
                </p>
              </div>

              <div className="rounded-xl bg-card-secondary p-4">
                <p className="text-xs text-muted">Total NG</p>
                <p className="mt-2 text-lg font-semibold text-danger">
                  {production.totalNg}
                </p>
                <p className="mt-1 text-xs text-muted">
                  Rate: {formatPercent(production.ngRate)}
                </p>
              </div>

              <div className="rounded-xl bg-card-secondary p-4">
                <p className="text-xs text-muted">Total Production</p>
                <p className="mt-2 text-lg font-semibold text-foreground">
                  {production.totalOutput?.toLocaleString('id-ID') ?? '0'}
                </p>
              </div>

              <div className="rounded-xl bg-card-secondary p-4">
                <p className="text-xs text-muted">Target</p>
                <p className="mt-2 text-lg font-semibold text-info">
                  {production.target}
                </p>
              </div>

              <div className="rounded-xl bg-card-secondary p-4">
                <p className="text-xs text-muted">Achievement</p>
                <p className="mt-2 text-lg font-semibold text-warning">
                  {formatPercent(production.achievePercent)}
                </p>
              </div>

              <div className="rounded-xl bg-card-secondary p-4">
                <p className="text-xs text-muted">Status</p>

                <span className="mt-2 inline-flex rounded-full bg-danger/10 px-3 py-1 text-sm font-semibold text-danger">
                  {production.productionStatus === 'Tercapai' || (production.achievePercent || 0) >= 100 ? (
                    <span className="text-success">TERCAPAI</span>
                  ) : (
                    <span className="text-danger">{production.productionStatus || 'TIDAK TARGET'}</span>
                  )}
                </span>

              </div>

            </div>

          </section>

          {/* =============================== */}
          {/* NG Breakdown */}
          {/* =============================== */}

          <section className="mb-8">

            <h3 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground">
              NG Defect Breakdown
            </h3>

            <div className="rounded-xl bg-card-secondary text-foreground">

              {production.defects.length === 0 ? (

                    <div className="px-5 py-4 text-center text-muted">
                        No defect data.
                    </div>

                ) : (

                    production.defects.map((defect) => (

                        <div
                            key={defect.id}
                            className="flex justify-between border-b border-border px-5 py-3"
                        >
                            <span>{defect.ngDefectName}</span>

                            <span className="font-semibold">
                                {defect.qtyNg} pcs
                            </span>

                        </div>

                    ))

                )}

            </div>

          </section>

          {/* =============================== */}
          {/* Remark */}
          {/* =============================== */}

          <section className="mb-8">
            <h3 className="mb-4 border-b border-border pb-2 text-lg font-semibold text-foreground">
              Remark
            </h3>
            <div className="rounded-xl bg-card-secondary p-4 text-sm text-foreground">
              {production.remark || '-'}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">

          <div className="flex justify-end gap-3">

            <button
              onClick={onClose}
              className="rounded-xl bg-info px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ProductionDetailModal
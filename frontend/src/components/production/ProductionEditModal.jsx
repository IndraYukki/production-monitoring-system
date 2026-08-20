import { useState, useEffect } from 'react'


const MACHINES = [
  { id: 1, name: 'WIP' },
  { id: 2, name: 'MC-1' },
  { id: 3, name: 'MC-2' },
  { id: 4, name: 'MC-3' },
  { id: 5, name: 'MC-4' },
  { id: 6, name: 'MC-5' },
  { id: 7, name: 'MC-6' },
  { id: 8, name: 'MC-7' },
  { id: 9, name: 'MC-8' },
  { id: 10, name: 'MC-9' },
  { id: 11, name: 'MC-10' },
  { id: 12, name: 'MC-11' },
  { id: 13, name: 'MC-12' },
  { id: 14, name: 'MC-13' },
  { id: 15, name: 'MC-14' },
  { id: 16, name: 'MC-15' },
  { id: 17, name: 'MC-16' },
  { id: 18, name: 'MC-17' },
  { id: 19, name: 'MC-18' },
  { id: 20, name: 'MC-19' },
  { id: 21, name: 'MC-20' },
  { id: 22, name: 'MC-21' },
  { id: 23, name: 'MC-22' },
  { id: 24, name: 'MC-23' },
  { id: 25, name: 'MC-24' },
  { id: 26, name: 'MC-25' },
  { id: 27, name: 'MC-26' },
]

const SHIFTS = ['SHIFT 1', 'SHIFT 2', 'SHIFT 3']

const ngDefectsList = [

  { id: 4, name: 'BURRY' },
  { id: 5, name: 'OVERCUT' },
  { id: 6, name: 'DIRTY' },
  { id: 7, name: 'DISCOLOR' },
  { id: 8, name: 'BUBBLE' },
  { id: 9, name: 'BROCKEN' },
  { id: 10, name: 'BLACKDOT' },
  { id: 11, name: 'SHORTMOLD' },
  { id: 12, name: 'DENTED' },
  { id: 13, name: 'SHINNING' },
  { id: 14, name: 'BENDING' },
  { id: 15, name: 'BURAM' },
  { id: 16, name: 'WELDLINE' },
  { id: 17, name: 'SILVER' },
  { id: 18, name: 'LAIN-LAIN' },
]

function ProductionEditModal({
  open,
  onClose,
  production,
  onSave,
  onDelete,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    productionLot: '',
    productId: null,
    machineId: null,
    shift: '',
    operator1Id: null,
    operator2Id: null,
    operator3Id: null,
    inputJam: 0,
    inputMenit: 0,
    qtyOk: 0,
    qtyWip: 0,
    remark: '',
    defects: [],
  })

  const [op1Name, setOp1Name] = useState('')
  const [op2Name, setOp2Name] = useState('')
  const [op3Name, setOp3Name] = useState('')

  useEffect(() => {
    if (production && open) {
      // Mengurai total menit dari BE (uptimeMc / uptimeDisplay) ke jam & menit
      const totalMinutes = production.uptimeMc || 0

      setFormData({
        productionLot: production.productionLot || '',
        productId: production.productId || null,
        machineId: production.machineId || null,
        shift: production.shift || '',
        operator1Id: production.operator1Id || null,
        operator2Id: production.operator2Id || null,
        operator3Id: production.operator3Id || null,
        inputJam: production.inputJam ?? 0,     
        inputMenit: production.inputMenit ?? 0,
        qtyOk: production.qtyOk || 0,
        qtyWip: production.qtyWip || 0,
        remark: production.remark || '',
        defects: (production.defects || []).map((d) => ({
          ngDefectId: d.ngDefectId,
          qtyNg: d.qtyNg,
        })),
      })

      setOp1Name(production.operator1Name || '')
      setOp2Name(production.operator2Name || '')
      setOp3Name(production.operator3Name || '')
    }
  }, [production, open])

  if (!open || !production) return null

  // Handler Jam (Maksimal 8)
  const handleJamChange = (e) => {
    let val = e.target.value
    if (val !== '') {
      let num = Number(val)
      if (num > 8) num = 8
      if (num < 0) num = 0
      val = num
    }
    setFormData((prev) => ({ ...prev, inputJam: val }))
  }

  // Handler Menit (Maksimal 59)
  const handleMenitChange = (e) => {
    let val = e.target.value
    if (val !== '') {
      let num = Number(val)
      if (num > 59) num = 59
      if (num < 0) num = 0
      val = num
    }
    setFormData((prev) => ({ ...prev, inputMenit: val }))
  }

  // Handler Defect Quantity
  const handleDefectChange = (defectId, value) => {
    const qty = Number(value)

    setFormData((prev) => {
      if (!qty || qty <= 0) {
        return {
          ...prev,
          defects: prev.defects.filter((item) => item.ngDefectId !== defectId),
        }
      }

      const existingDefect = prev.defects.find(
        (item) => item.ngDefectId === defectId
      )

      if (existingDefect) {
        return {
          ...prev,
          defects: prev.defects.map((item) =>
            item.ngDefectId === defectId ? { ...item, qtyNg: qty } : item
          ),
        }
      }

      return {
        ...prev,
        defects: [...prev.defects, { ngDefectId: defectId, qtyNg: qty }],
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.operator1Id) {
      alert('Operator 1 wajib diisi!')
      return
    }

    const payload = {
      productId: formData.productId,
      machineId: formData.machineId,
      shift: formData.shift,
      operator1Id: formData.operator1Id,
      operator2Id: formData.operator2Id,
      operator3Id: formData.operator3Id,
      inputJam: Number(formData.inputJam) || 0,
      inputMenit: Number(formData.inputMenit) || 0,
      qtyOk: Number(formData.qtyOk) || 0,
      qtyWip: Number(formData.qtyWip) || 0,
      productionLot: formData.productionLot,
      remark: formData.remark || '',
      defects: formData.defects,
    }

    onSave(production.id, payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-card shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Edit Production Record
            </h2>
            <p className="mt-1 text-sm text-muted">
              {production.partName} ({production.partNo}) — {production.machineName} ({production.shift})
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted transition hover:bg-card-secondary hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
                    <div className="overflow-y-auto p-6 space-y-6">
            {/* 1. Basic Info - Product & Date (Readonly) */}
            <div className="grid grid-cols-1 gap-4 rounded-xl bg-card-secondary p-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted uppercase">Customer / Product</p>
                <p className="font-semibold text-foreground mt-0.5">
                  {production.customerName} - {production.partName}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase">Lot Date</p>
                <p className="font-mono font-semibold text-foreground mt-0.5">{production.productionLot}</p>
              </div>
            </div>

            
            {/* 3. Operators (Read-only Labels) */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-muted tracking-wider">
                Operator Assignment
              </h3>
              <div className="grid grid-cols-1 gap-4 rounded-xl bg-card-secondary p-4 md:grid-cols-3">
                {/* Operator 1 */}
                <div>
                  <p className="text-xs text-muted uppercase">Operator 1</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {op1Name || '-'}
                  </p>
                </div>

                {/* Operator 2 */}
                <div>
                  <p className="text-xs text-muted uppercase">Operator 2</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {op2Name || '-'}
                  </p>
                </div>

                {/* Operator 3 */}
                <div>
                  <p className="text-xs text-muted uppercase">Operator 3</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {op3Name || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Machine & Shift (Editable) */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-muted tracking-wider">
                Machine & Shift Selection
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Machine <span className="text-danger">*</span>
                  </label>
                  <select
                    value={formData.machineId || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, machineId: Number(e.target.value) }))}
                    className="w-full rounded-xl border border-border bg-card-secondary px-3 py-2.5 text-sm text-foreground outline-none focus:border-info"
                  >
                    {MACHINES.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Shift <span className="text-danger">*</span>
                  </label>
                  <select
                    value={formData.shift || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value }))}
                    className="w-full rounded-xl border border-border bg-card-secondary px-3 py-2.5 text-sm text-foreground outline-none focus:border-info"
                  >
                    {SHIFTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

                        


            {/* 4. Uptime & Production Quantities */}

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-muted tracking-wider">
                Production Quantities & Uptime
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Uptime Jam & Menit */}
                <div className="sm:col-span-1">
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Uptime MC <span className="text-danger">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="8"
                        value={formData.inputJam}
                        onChange={handleJamChange}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="Jam"
                        className="w-full rounded-xl border border-border bg-card-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-info"
                      />
                      <span className="mt-1 block text-[10px] text-muted">Jam (Maks 8)</span>
                    </div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={formData.inputMenit}
                        onChange={handleMenitChange}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="Menit"
                        className="w-full rounded-xl border border-border bg-card-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-info"
                      />
                      <span className="mt-1 block text-[10px] text-muted">Menit (Maks 59)</span>
                    </div>
                  </div>
                </div>

                {/* Qty OK */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Qty OK
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.qtyOk}
                    onChange={(e) => setFormData((prev) => ({ ...prev, qtyOk: e.target.value }))}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full rounded-xl border border-border bg-card-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-info font-mono"
                  />
                </div>

                {/* Qty WIP */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-foreground">
                    Qty WIP
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.qtyWip}
                    onChange={(e) => setFormData((prev) => ({ ...prev, qtyWip: e.target.value }))}
                    onWheel={(e) => e.currentTarget.blur()}
                    className="w-full rounded-xl border border-border bg-card-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-info font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 4. NG Defects Breakdown */}
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase text-muted tracking-wider">
                NG Defect Breakdown
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                {ngDefectsList.map((defect) => {
                  const activeDefect = formData.defects.find((d) => d.ngDefectId === defect.id)

                  return (
                    <div key={defect.id}>
                      <label className="mb-1 block text-xs text-muted truncate" title={defect.name}>
                        {defect.name}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={activeDefect?.qtyNg ?? ''}
                        onChange={(e) => handleDefectChange(defect.id, e.target.value)}
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        className="w-full rounded-xl border border-border bg-card-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-info font-mono"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 5. Remark */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                Remark / Catatan Shift
              </label>
              <textarea
                rows="2"
                value={formData.remark}
                onChange={(e) => setFormData((prev) => ({ ...prev, remark: e.target.value }))}
                placeholder="Catatan kendala mesin, penggantian mold, dll..."
                className="w-full rounded-xl border border-border bg-card-secondary p-3 text-sm text-foreground outline-none focus:border-info resize-none"
              />
            </div>
          </div>

          {/* Modal Footer (Action Buttons) */}
          <div className="flex items-center justify-between border-t border-border px-6 py-4 bg-card-secondary/40">
            {/* Tombol Delete di Kiri */}
            <button
              type="button"
              onClick={() => onDelete(production)}
              className="rounded-xl bg-danger px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Delete
            </button>

            {/* Tombol Cancel & Save di Kanan */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-card-secondary"
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductionEditModal
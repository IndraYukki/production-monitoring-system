import { useState, useEffect } from 'react'
import PartNoAutocomplete from './PartNoAutocomplete'
import OperatorAutoComplete from './OperatorAutoComplete'

const ngDefects = [
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


function ShiftForm({ shift, data, setData, isSelected}) {

    const [op1Name, setOp1Name] = useState('')
    const [op2Name, setOp2Name] = useState('')
    const [op3Name, setOp3Name] = useState('')

    useEffect(() => {
      if (!data.operator1Id) setOp1Name('')
      if (!data.operator2Id) setOp2Name('')
      if (!data.operator3Id) setOp3Name('')
    }, [data.operator1Id, data.operator2Id, data.operator3Id])




    // Validasi Jam (Maksimal 8 Jam)
      const handleJamChange = (e) => {
        let val = e.target.value
        if (val !== '') {
          let num = Number(val)
          if (num > 8) num = 8   // Tahan di angka 8 jika melebihi
          if (num < 0) num = 0
          val = num
        }
        setData((prev) => ({ ...prev, inputJam: val }))
      }

      // Validasi Menit (Maksimal 59 Menit)
      const handleMenitChange = (e) => {
        let val = e.target.value
        if (val !== '') {
          let num = Number(val)
          if (num > 59) num = 59 // Tahan di angka 59 jika melebihi
          if (num < 0) num = 0
          val = num
        }
        setData((prev) => ({ ...prev, inputMenit: val }))
      }

    const handleDefectChange = (defectId, value) => {
      const qty = Number(value)

      setData((prev) => {
        if (!qty || qty <= 0) {
          return {
            ...prev,
            defects: prev.defects.filter(
              (defect) => defect.ngDefectId !== defectId
            ),
          }
        }

        const existingDefect = prev.defects.find(
          (defect) => defect.ngDefectId === defectId
        )

        if (existingDefect) {
          return {
            ...prev,
            defects: prev.defects.map((defect) =>
              defect.ngDefectId === defectId
                ? { ...defect, qtyNg: qty }
                : defect
            ),
          }
        }

        return {
          ...prev,
          defects: [
            ...prev.defects,
            {
              ngDefectId: defectId,
              qtyNg: qty,
            },
          ],
        }
      })
    }


  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">
          {shift}
        </h2>

        <p className="mt-1 text-sm text-muted">
          Enter production data for {shift}.
        </p>
      </div>

      {/* Operators */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                {/* Operator 1 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Operator 1
            <span className="ml-1 text-danger">*</span>
          </label>
          <OperatorAutoComplete
              value={op1Name}
              isSelected={Boolean(data.operator1Id)}
              onChange={(val) => {
                setOp1Name(val)
                setData(prev => ({ ...prev, operator1Id: null }))
              }}
              onSelect={(op) => {
                setOp1Name(op.name)
                setData(prev => ({ ...prev, operator1Id: op.id }))
              }}
            />
        </div>

        {/* Operator 2 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Operator 2
          </label>

          <OperatorAutoComplete
            value={op2Name}
            isSelected={Boolean(data.operator2Id)}
            onChange={(val) => {
              setOp2Name(val)
              setData(prev => ({ ...prev, operator2Id: null }))
            }}
            onSelect={(op) => {
              setOp2Name(op.name)
              setData(prev => ({ ...prev, operator2Id: op.id }))
            }}
          />
        </div>

        {/* Operator 3 */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Operator 3
          </label>

          <OperatorAutoComplete
            value={op3Name}
            isSelected={Boolean(data.operator3Id)}
            onChange={(val) => {
              setOp3Name(val)
              setData(prev => ({ ...prev, operator3Id: null }))
            }}
            onSelect={(op) => {
              setOp3Name(op.name)
              setData(prev => ({ ...prev, operator3Id: op.id }))
            }}
          />
        </div>


      </div>

      {/* Production Result */}

      <div>
           {/* Uptime MC */}
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Uptime MC
                  <span className="ml-1 text-danger">*</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {/* Hour */}
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="8"
                      value={data.inputJam ?? ''}
                      onChange={handleJamChange}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="Hour (0-8)"
                      className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-info"
                    />
                    <p className="mt-1 text-xs text-muted">
                      Jam (Maks 8)
                    </p>
                  </div>

                  {/* Minute */}
                  <div>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={data.inputMenit ?? ''}
                      onChange={handleMenitChange}
                      onWheel={(e) => e.currentTarget.blur()}
                      placeholder="Minute (0-59)"
                      className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-info"
                    />
                    <p className="mt-1 text-xs text-muted">
                      Menit (Maks 59)
                    </p>
                  </div>
                </div>
              </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">

        {/* Qty OK */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Qty OK
          </label>

          <input
            type="number"
            min="0"
            value={data.qtyOk}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                qtyOk: e.target.value,
              }))
            }
            onWheel={(e) => e.currentTarget.blur()}
            placeholder="Quantity"
            className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-info"
          />
        </div>

        {/* Qty WIP */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Qty WIP
          </label>

          <input
            type="number"
            min="0"
            value={data.qtyWip}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                qtyWip: e.target.value,
              }))
            }
            onWheel={(e) => e.currentTarget.blur()}
            placeholder="Quantity"
            className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-info"
          />
        </div>
      </div>
        <div>
            {/* NG Defect */}
            <div className="mt-6 border-t border-border pt-6 w-full">

            <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">
                NG Defect
                </h3>

                <p className="mt-1 text-sm text-muted">
                Enter the quantity for each defect found during this shift.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {ngDefects.map((defect) => {
                const currentDefect = data.defects.find(
                    (item) => item.ngDefectId === defect.id
                )

                return (
                    <div key={defect.id}>
                    <label className="mb-2 block text-sm font-medium text-foreground">
                        {defect.name}
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={currentDefect?.qtyNg ?? ''}
                        onChange={(e) =>
                        handleDefectChange(defect.id, e.target.value)
                        }
                        onWheel={(e) => e.currentTarget.blur()}
                        placeholder="0"
                        className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-info"
                    />
                    </div>
                )
                })}
            </div>

            </div>


            <div>
              {/* Remark / Catatan */}
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Remark / Catatan Shift
                  </label>
                  <textarea
                    rows="2"
                    value={data.remark ?? ''}
                    onChange={(e) =>
                      setData((prev) => ({
                        ...prev,
                        remark: e.target.value,
                      }))
                    }
                    placeholder="Contoh: Mold problem 30 min, ganti material, dll..."
                    className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-info resize-none"
                  />
                </div>
            </div>
        </div>

    </section>
  )
}

export default ShiftForm
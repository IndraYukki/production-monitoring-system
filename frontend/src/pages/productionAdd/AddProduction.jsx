import { useState } from 'react'
import api from '../../services/api'
import ProductionHeader from '../../components/production/ProductionHeader'

import ProductionInfo from '../../components/production/ProductionInfo'
import ShiftForm from '../../components/production/ShiftForm'

const initialShift = {
  operator1Id: null,
  operator2Id: null,
  operator3Id: null,

  qtyOk: '',
  qtyWip: '',

  uptimeHours: '',
  uptimeMinutes: '',

  defects: [],
}

const initialProductionInfo = {
  productionLot: '',
  productId: null,
  machineId: null,
}


function AddProduction() {
  const [submitting, setSubmitting] = useState(false)

  const [productionInfo, setProductionInfo] = useState(initialProductionInfo);

  const resetForm = () => {
    setProductionInfo(initialProductionInfo)
    setShift1(initialShift)
    setShift2(initialShift)
    setShift3(initialShift)
  }

  const [shift1, setShift1] = useState(initialShift);
  const [shift2, setShift2] = useState(initialShift);
  const [shift3, setShift3] = useState(initialShift);

  const convertUptime = (shift) => {
    const hours = Number(shift.uptimeHours) || 0
    const minutes = Number(shift.uptimeMinutes) || 0

    return (hours * 60) + minutes
  };

    const buildPayload = (shift, shiftName) => {

      return {
        productId: productionInfo.productId,
        machineId: productionInfo.machineId,

        shift: shiftName,

        operator1Id: shift.operator1Id,
        operator2Id: shift.operator2Id,
        operator3Id: shift.operator3Id,

        uptimeMc: convertUptime(shift),

        qtyOk: shift.qtyOk ? Number(shift.qtyOk) : null,
        qtyWip: shift.qtyWip ? Number(shift.qtyWip) : null,

        productionLot: productionInfo.productionLot,

        defects: shift.defects,
      }    
    }


      const handleSubmit = async (e) => {
        e.preventDefault()

        if (submitting) return

        const shifts = [
          { data: shift1, name: 'SHIFT 1' },
          { data: shift2, name: 'SHIFT 2' },
          { data: shift3, name: 'SHIFT 3' },
        ]

        const activeShifts = shifts.filter(
          ({ data }) => data.operator1Id
        )

        if (!productionInfo.productId) {
          alert('Product belum dipilih')
          return
        }

        if (!productionInfo.machineId) {
          alert('Machine belum dipilih')
          return
        }

        if (activeShifts.length === 0) {
          alert('Minimal satu shift harus memiliki Operator 1')
          return
        }

        try {
          setSubmitting(true)
          for (const { data, name } of activeShifts) {
            const payload = buildPayload(data, name)

            await api.post('/production', payload)
          }

          alert('Laporan production berhasil disimpan')
          resetForm()

        } catch (error) {
          console.error('Gagal submit production:', error)
          const errorMessage = error.response?.data?.message || error.message || `Gagal menyimpan data`
          alert(errorMessage)
        } 
        finally {
          setSubmitting(false)
        }

      }




  




  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-362.5 px-4 py-6 sm:px-6 md:py-8 lg:px-8">


      <form onSubmit={handleSubmit}>

        <ProductionInfo
          data={productionInfo}
          setData={setProductionInfo}
        />

        <div className="mt-6 space-y-6">

       

          <div className='grid md:grid-cols-3 gap-2'>
            <ShiftForm
              shift="SHIFT 1"
              data={shift1}
              setData={setShift1}
            />

            <ShiftForm
              shift="SHIFT 2"
              data={shift2}
              setData={setShift2}
            />

            <ShiftForm
              shift="SHIFT 3"
              data={shift3}
              setData={setShift3}
            />
          </div>

        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-accent px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Menyimpan...' : 'Simpan Production'}
          </button>
        </div>
      </form>
      </div>
    </main>
  )
}

export default AddProduction
import { useState, useEffect } from 'react'
import PartNoAutocomplete from './PartNoAutocomplete'
import MachineAutocomplete from './MachineAutoComplite'


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

function ProductionInfo({ data, setData }) {

  const [partNo, setPartNo] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null);
    useEffect(() => {
      if (!data.productId) {
        setPartNo('')
        setSelectedProduct(null)
      }
    }, [data.productId])

    const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setPartNo(product.partNo)

    setData((prev) => ({
      ...prev,
      productId: product.id,
      selectedProduct: product, 
    }))
  }




    return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
        <div className="h-8 w-1.5 rounded-full bg-info"></div>
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Production Information
          </h2>
          <p className="text-xs text-muted">
            informasi detail produk terpilih
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* =========================================================
            LEFT COLUMN: INPUT FORM
            ========================================================= */}
        <div className="space-y-5 lg:col-span-5">
          {/* Production Lot */}
          <div>
            <label htmlFor="production-lot" className="mb-2 block text-sm font-semibold text-foreground">
              Production Lot
            </label>
            <input
              id="production-lot"
              type="date"
              value={data.productionLot}
              onChange={(e) => setData((prev) => ({ ...prev, productionLot: e.target.value }))}
              className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none transition focus:border-info focus:ring-2 focus:ring-info/20"
            />
          </div>

          {/* Part No Selection */}
          <PartNoAutocomplete
            value={partNo}
            onChange={(value) => {
              setPartNo(value)
              setSelectedProduct(null)
              setData((prev) => ({ ...prev, productId: null, selectedProduct: null }))
            }}
            onSelect={handleProductSelect}
          />

          {/* Machine Selection */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-foreground">
              Machine <span className="text-danger">*</span>
            </label>
            <MachineAutocomplete
              value={data.machineId}
              onChange={(id) => {
                const selectedMac = MACHINES.find((m) => m.id === id) || null
                setData((prev) => ({
                  ...prev,
                  machineId: id,
                  selectedMachine: selectedMac,
                }))
              }}
            />
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: PRODUCT PREVIEW (ALWAYS VISIBLE)
            ========================================================= */}
        <div className="lg:col-span-7">
          <div className={`h-full rounded-2xl border-2 border-dashed transition-all duration-300 ${
            selectedProduct 
              ? 'border-info/30 bg-card-secondary/50' 
              : 'border-border/40 bg-transparent'
          } p-2`}>
            
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${selectedProduct ? 'animate-pulse bg-success' : 'bg-inactive'}`}></div>
                <span className={`text-xs font-bold uppercase tracking-wider ${selectedProduct ? 'text-success' : 'text-muted'}`}>
                  {selectedProduct ? 'Product Active' : 'Waiting Selection'}
                </span>
              </div>
              {selectedProduct && (
                <span className="text-[10px] font-medium text-info bg-info/10 px-2 py-0.5 rounded-full uppercase">
                  Confirmed
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-2 sm:grid-cols-3">
              {/* Part Name */}
              <div className="col-span-2 sm:col-span-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Part Name</p>
                <p className={`mt-1.5 text-lg font-bold leading-tight ${selectedProduct ? 'text-accent' : 'text-inactive'}`}>
                  {selectedProduct?.partName || '---'}
                </p>
              </div>

              {/* Customer */}
              <div className="rounded-xl bg-card-secondary/40 p-3 border border-border/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Customer</p>
                <p className={`mt-1 text-sm font-semibold ${selectedProduct ? 'text-foreground' : 'text-inactive'}`}>
                  {selectedProduct?.customerName || '---'}
                </p>
              </div>

              {/* Cavity */}
              <div className="rounded-xl bg-card-secondary/40 p-3 border border-border/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Cavity</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <p className={`text-base font-bold ${selectedProduct ? 'text-warning' : 'text-inactive'}`}>
                    {selectedProduct?.cavity || '0'}
                  </p>
                  <span className="text-[10px] text-muted font-medium">CV</span>
                </div>
              </div>

              {/* Standard Cycle Time */}
              <div className="rounded-xl bg-card-secondary/40 p-3 border border-border/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Cycle Time</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <p className={`text-base font-bold ${selectedProduct ? 'text-info' : 'text-inactive'}`}>
                    {selectedProduct?.cycleTime || '0'}
                  </p>
                  <span className="text-[10px] text-muted font-medium italic">sec</span>
                </div>
              </div>

              {/* Standard Take Time */}
              <div className="rounded-xl bg-card-secondary/40 p-3 border border-border/20">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Take Time</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <p className={`text-base font-bold ${selectedProduct ? 'text-info' : 'text-inactive'}`}>
                    {selectedProduct?.takeTime || '0'}
                  </p>
                  <span className="text-[10px] text-muted font-medium italic">sec</span>
                </div>
              </div>
            </div>

            {!selectedProduct && (
              <div className="mt-2 flex items-center justify-center border-t border-border/20 pt-2">
                <p className="text-center text-[11px] italic text-muted/60 leading-relaxed">
                  Silakan pilih Part Number terlebih dahulu untuk melihat detail informasi produk dan standar waktu produksi.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )

}

export default ProductionInfo
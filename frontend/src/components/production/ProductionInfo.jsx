import { useState, useEffect } from 'react'
import PartNoAutocomplete from './PartNoAutocomplete'
import MachineAutocomplete from './MachineAutoComplite'

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
    }))
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-5 md:p-6">

      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Production Information
        </h2>

        <p className="mt-1 text-sm text-muted">
          Enter the basic information for this production report.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* Production Lot */}
        <div>
          <label
            htmlFor="production-lot"
            className="mb-2 block text-sm font-medium"
          >
            Production Lot
          </label>

          <input
            id="production-lot"
            type="date"
            value={data.productionLot}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                productionLot: e.target.value,
              }))
            }
            className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none transition focus:border-info"
          />
        </div>

        {/* Part No */}
        <PartNoAutocomplete
          value={partNo}
          onChange={(value) => {
            setPartNo(value)
            setSelectedProduct(null)
            setData((prev) => ({ ...prev, productId: null }))
          }}
          onSelect={handleProductSelect}
        />

        {/* Machine */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Machine
            <span className="ml-1 text-danger">*</span>
          </label>

          <MachineAutocomplete
            value={data.machineId}
            onChange={(id) =>
              setData((prev) => ({
                ...prev,
                machineId: id,
              }))
            }
          />
        </div>

      </div>

      {/* Product Preview */}
      {selectedProduct && (
        <div className="mt-5 rounded-xl border border-border bg-card-secondary p-4">

          <div className="mb-4 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-success" />

            <span className="text-sm font-medium text-success">
              Product Selected
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div>
              <p className="text-xs text-muted">
                Part Name
              </p>

              <p className="mt-1 font-bold text-accent">
                {selectedProduct.partName}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted">
                Customer
              </p>

              <p className="mt-1 font-medium">
                {selectedProduct.customerName}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted">
                Cycle Time (MC)
              </p>

              <p className="mt-1 font-medium">
                {selectedProduct.cycleTime} sec
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">
                Take Time (WIP)
              </p>

              <p className="mt-1 font-medium">
                {selectedProduct.takeTime} sec
              </p>
            </div>

            <div>
              <p className="text-xs text-muted">
                Cavity
              </p>

              <p className="mt-1 font-medium">
                {selectedProduct.cavity}
              </p>
            </div>

          </div>
        </div>
      )}

    </section>
  )
}

export default ProductionInfo
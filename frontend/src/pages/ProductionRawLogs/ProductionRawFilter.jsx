function ProductionRawFilter({
  filters,
  setFilters,
  customers,
  machines,
  onApply,
  onReset,
}) {
  const shifts = [
    { value: '', label: 'All Shift' },
    { value: 'SHIFT 1', label: 'SHIFT 1' },
    { value: 'SHIFT 2', label: 'SHIFT 2' },
    { value: 'SHIFT 3', label: 'SHIFT 3' },
  ]

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <section className="mb-6 rounded-2xl border border-border bg-card p-4 md:p-5">

      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">
          Filter Production Logs
        </h2>

        <p className="mt-1 text-sm text-muted">
          Filter production records based on the required criteria.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">

        {/* Customer */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Customer
          </label>

          <select
            value={filters.customerId}
            onChange={(e) =>
              handleChange('customerId', e.target.value)
            }
            className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-info"
          >
            <option value="">All Customers</option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.customer}
              </option>
            ))}
          </select>
        </div>

        {/* Machine */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Machine
          </label>

          <select
            value={filters.machineId}
            onChange={(e) =>
              handleChange('machineId', e.target.value)
            }
            className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-info"
          >
            <option value="">All Machines</option>

            {machines.map((machine) => (
              <option
                key={machine.id}
                value={machine.id}
              >
                {machine.name}
              </option>
            ))}
          </select>
        </div>

        {/* Shift */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Shift
          </label>

          <select
            value={filters.shift}
            onChange={(e) =>
              handleChange('shift', e.target.value)
            }
            className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-info"
          >
            {shifts.map((shift) => (
              <option
                key={shift.value}
                value={shift.value}
              >
                {shift.label}
              </option>
            ))}
          </select>
        </div>

        {/* From */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            From
          </label>

          <input
            type="date"
            value={filters.tanggalMulai}
            onChange={(e) =>
              handleChange('tanggalMulai', e.target.value)
            }
            className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-info"
          />
        </div>

        {/* To */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            To
          </label>

          <input
            type="date"
            value={filters.tanggalSelesai}
            onChange={(e) =>
              handleChange('tanggalSelesai', e.target.value)
            }
            className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-info"
          />
        </div>

      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-end gap-3">

        <button
          type="button"
          onClick={onReset}
          className="rounded-xl border border-border bg-danger px-5 py-3 text-sm font-medium text-foreground transition hover:bg-card"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={onApply}
          className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-warning transition hover:opacity-90"
        >
          Apply Filter
        </button>

      </div>

    </section>
  )
}

export default ProductionRawFilter
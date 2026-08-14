function ProductTable({
  data,
  loading,
  page,
  totalPages,
  onPageChange,
  onEdit,

  keyword,
  onKeywordChange,

  customerId,
  onCustomerChange,
  customers,

  status,
  onStatusChange,
  pageSize,
  onPageSizeChange,
}) {

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

      {/* filter  */}
      <div className="mb-6 grid gap-3 md:grid-cols-3 m-4">

        {/* Customer */}

        <select
          value={customerId}
          onChange={(e) => onCustomerChange(e.target.value)}
          className="rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-info"
        >
          <option value="">
            All Customers
          </option>

          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.customer}
            </option>
          ))}
        </select>


        {/* Status */}

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-info"
        >

          <option value="">
            All Status
          </option>

          <option value="ACTIVE">
            Active
          </option>

          <option value="INACTIVE">
            Inactive
          </option>

        </select>

          {/* Part No / Part Name */}

        <input
          type="text"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="Search part no / part name..."
          className="rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-info"
        />

      </div>
      <div>
          <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-border bg-card-secondary px-2 py-1 text-sm text-foreground m-4"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* Table */}
      <div className="max-h-125 overflow-auto">

        <table className="min-w-full">

          <thead className="sticky top-0 z-20 bg-card-secondary">

            <tr>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                Part Number
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                Part Name
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                Color
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                Customer
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                Cycle Time
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                Cavity
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                Take Time
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase text-muted">
                Action
              </th>

            </tr>

          </thead>


          <tbody className="divide-y divide-border">

            {loading ? (

              <tr>
                <td
                  colSpan="9"
                  className="px-5 py-10 text-center text-sm text-muted"
                >
                  Loading products...
                </td>
              </tr>

            ) : data.length === 0 ? (

              <tr>
                <td
                  colSpan="9"
                  className="px-5 py-10 text-center text-sm text-muted"
                >
                  No products found.
                </td>
              </tr>

            ) : (

              data.map((product) => (

                <tr
                  key={product.id}
                  className="transition hover:bg-card-secondary"
                >

                  {/* Part Number */}

                  <td className="px-5 py-4">
                    <p className="text-sm font-semibold text-foreground">
                      {product.partNo}
                    </p>
                  </td>


                  {/* Part Name */}

                  <td className="px-5 py-4">
                    <p className="text-sm text-foreground">
                      {product.partName}
                    </p>
                  </td>


                  {/* Color */}

                  <td className="px-5 py-4">
                    <p className="text-sm text-foreground">
                      {product.color}
                    </p>
                  </td>


                  {/* Customer */}

                  <td className="px-5 py-4">
                    <p className="text-sm text-foreground">
                      {product.customerName}
                    </p>
                  </td>


                  {/* Cycle Time */}

                  <td className="px-5 py-4">
                    <p className="text-sm text-foreground">
                      {product.cycleTime}
                    </p>
                  </td>


                  {/* Cavity */}

                  <td className="px-5 py-4">
                    <p className="text-sm text-foreground">
                      {product.cavity}
                    </p>
                  </td>


                  {/* Take Time */}

                  <td className="px-5 py-4">
                    <p className="text-sm text-foreground">
                      {product.takeTime}
                    </p>
                  </td>


                  {/* Status */}

                  <td className="px-5 py-4">
                    <span className="text-sm text-foreground">
                      {product.status}
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      onClick={() => onEdit(product)}
                      className="rounded-lg px-3 py-2 text-sm text-info transition hover:bg-info/10"
                    >
                      Edit
                    </button>
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>


      {/* Pagination */}

      <div className="flex items-center bg-card-secondary justify-between border-t border-border px-5 py-4">

        <p className="text-sm text-muted">
          Page {page + 1} of {totalPages || 1}
        </p>


          <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => onPageChange(page - 1)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-card-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info text-sm font-bold text-white">
              {page + 1}
            </div>

            <button
              type="button"
              disabled={page >= totalPages - 1}
              onClick={() => onPageChange(page + 1)}
              className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-card-secondary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>

      </div>

    </div>
  )
}

export default ProductTable


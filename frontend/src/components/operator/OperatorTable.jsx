function OperatorTable({
  data,
  loading,
  page,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  keyword,
  onKeywordChange,
  groub,
  onGroubChange,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

      {/* Filter */}
      <div className="mb-6 grid gap-3 md:grid-cols-3 m-4">

        {/* filter groub */}
        <select
            value={groub}
            onChange={(e) => onGroubChange(e.target.value)}
            className="rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none focus:border-info"
          >
            // tambah option RESIGN
            <option value="">All Active Operators (non-RESIGN)</option>  {/* ← default */}
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="RESIGN">RESIGN</option>
          </select>

        {/* search nik name */}
        <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Search name / NIK..."
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
        <table className="w-full border-collapse text-left">

          <thead className="sticky top-0 z-20 bg-card-secondary">
            <tr className="border-b border-border">
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Name</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">NIK</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Group</th>
              <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-muted">
                  Loading...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center text-sm text-muted">
                  Tidak ada data operator.
                </td>
              </tr>
            ) : (
              data.map((operator) => (
                <tr key={operator.id} className="transition hover:bg-card-secondary">
                  <td className="px-5 py-4 text-sm text-foreground">{operator.name}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{operator.nik}</td>
                  <td className="px-5 py-4 text-sm text-foreground">{operator.groub}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(operator)}
                        className="rounded-lg border border-border bg-card-secondary px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-info hover:text-info"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(operator)}
                        className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger transition hover:bg-danger/20"
                      >
                        Delete
                      </button>
                    </div>
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

export default OperatorTable
import ProductionRawTableSkeleton from "../../components/production/ProductionRawTableSkeleton";


function ProductionRawTable({ 
  data,
  page,
  onPageChange,
  loading,
  keyword,
  onKeywordChange,
  onPageSizeChange,
  onDetail,
  onExport,

}

) {
  const currentPage = page?.number ?? 0;
  const pageSize = page?.size ?? 0;
  const totalElements = page?.totalElements ?? 0;

  const start =
    totalElements === 0
      ? 0
      : currentPage * pageSize + 1;

  const end =
    Math.min(
      (currentPage + 1) * pageSize,
      totalElements
    );
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex justify-end m-5">
          <button
          type="button"
          onClick={onExport}
          className="rounded-xl bg-info px-4 py-2.5 text-foreground font-semibold transition hover:opacity-90 hover:cursor-pointer"
        >
          Export Excel
        </button>
      </div>

  {/* Table Header Information */}
    <div className="flex flex-col gap-4 border-b border-border px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

      <div className="flex items-center gap-2">
          <span className="text-sm text-muted">
              Show
          </span>

          <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(e.target.value)}
              className="rounded-lg border border-border bg-card-secondary px-3 py-2 text-sm text-foreground"
          >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
          </select>

          <span className="text-sm text-muted">
              entries
          </span>
      </div>

      <div className="text-center">
        <h2 className="text-base font-semibold text-foreground">
          Production Records
        </h2>

        <p className="mt-1 text-sm text-muted">
          Filter Untuk Mencari Perkategori
        </p>
      </div>
      


      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        {/* menampilkan data */}
            <div className="whitespace-nowrap text-sm text-muted">
              <span className="font-medium text-foreground">
                {page?.totalElements || 0}
              </span>{' '}
              records found
            </div>

        {/* Search Part */}
        <div className="flex w-full items-center rounded-xl border border-border bg-card-secondary px-4 py-2.5 sm:w-80">
                {/* Record Count */}

          <span className="mr-2 text-muted">
            🔍
          </span>

          <input
            type="text"
            value={keyword}
            onChange={(e) => onKeywordChange(e.target.value)}
            placeholder="Search part no or part name..."
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />

        </div>



      </div>

    </div>


  {/* Table Area */}
  <div className="max-h-125 overflow-auto">

    <table className="w-full min-w-350 border-collapse text-center">

      {/* Sticky Header */}
      <thead className="sticky top-0 z-20 bg-card-secondary">
        <tr className="border-b border-border text-center">

          <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
            Customer
          </th>

          <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
            Part No
          </th>

          <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
            Part Name
          </th>

          <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
            Machine
          </th>

          <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
            Shift
          </th>

          <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted">
            Operator
          </th>

          <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
            Uptime
          </th>

          <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
            OK
          </th>

          <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
            NG
          </th>

          <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
            Total Production
          </th>

          <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
            Target
          </th>

          <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
            Achievement
          </th>

          <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-muted">
            Status
          </th>

          <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-muted">
            Action
          </th>

        </tr>
      </thead>




  {/* Scrollable Production Rows */}


      <tbody className="divide-y divide-border">

        {loading ? (

          <ProductionRawTableSkeleton />

        ) : data.length === 0 ? (


            <tr>
              <td
                colSpan="13"
                className="px-5 py-10 text-center text-sm text-muted  "
              >
                Data Tidak Ditemukan!!
              </td>
            </tr>


        ) : (

          data.map((production) => (

            <tr
              key={production.id}
              className="transition hover:bg-card-secondary"
            >

              {/* Customer */}
              <td className="px-5 py-4">
                <p className="max-w-30 text-sm font-semibold text-foreground">
                  {production.customerName}
                </p>
              </td>

              {/* Part No */}
              <td className="px-5 py-4 text-bold max-w-30 text-foreground">
                
                  {production.partNo}
                
              </td>

              {/* Part Name */}
              <td className="px-5 py-4">
                <p className="max-w-30 text-sm text-foreground">
                  {production.partName}
                </p>
              </td>

              {/* Machine */}
              <td className="px-5 py-4">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {production.machineName}
                </span>
              </td>

              {/* Shift */}
              <td className="px-5 py-4">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {production.shift}
                </span>
              </td>

              {/* Operator */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center text-xs font-bold text-info bg-card-secondary rounded-full">
                    {production.groub1 === "RESIGN" ? (
                       <div className="bg-card-secondary text-xs font-bold text-info">OUT</div>
                    ) : ( production.groub1 )
                    
                    }
                  </div>

                  <span className="text-sm text-foreground">
                    {production.operator1Name}
                  </span>

                </div>
              </td>

              {/* Uptime */}
              <td className="px-5 py-4 text-right">
                <span className="font-mono text-sm text-foreground">
                  {production.uptimeMc}
                </span>

                <span className="ml-1 text-xs text-muted">
                  min
                </span>
              </td>

              {/* OK */}
              <td className="px-5 py-4 text-right">
                <span className="font-mono text-sm font-semibold text-success">
                  {production.qtyOk
                    ? production.qtyOk.toLocaleString()
                    : '0'}
                </span>
              </td>

              {/* NG */}
              <td className="px-5 py-4 text-right">
                <span
                  className={
                    (production.totalNg || 0) > 0
                      ? 'font-mono text-sm font-semibold text-danger'
                      : 'font-mono text-sm text-muted'
                  }
                >
                  {production.totalNg?.toLocaleString() ?? '0'}
                </span>
              </td>

              {/* Total Production */}
              <td className="px-5 py-4 text-right">
                <span className="font-mono text-sm font-bold text-foreground">
                  {production.totalProduction?.toLocaleString() ?? '0'}
                </span>
              </td>

              {/* Target */}
              <td className="px-5 py-4 text-right">
                <span className="font-mono text-sm text-muted">
                  {production.target?.toLocaleString() ?? '0'}
                </span>
              </td>

              {/* Achievement */}
              <td className="px-5 py-4 text-right">
                <span
                  className={
                    (production.achievement || 0) >= 100
                      ? 'font-mono text-sm font-bold text-success'
                      : 'font-mono text-sm font-semibold text-warning'
                  }
                >
                  {production.achievement != null
                    ? production.achievement.toFixed(2)
                    : '0.00'}%
                </span>
              </td>

              {/* Status */}
              <td className="px-5 py-4 text-center">

                {production.status === 'TARGET' ? (

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1.5 text-xs font-semibold text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Target
                  </span>

                ) : (

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1.5 text-xs font-semibold text-danger">
                    <span className="h-1.5 w-1.5 rounded-full bg-danger" />
                    Not Target
                  </span>

                )}

              </td>

              {/* Action */}
              <td className="px-5 py-4 text-center">

                <button
                  type="button"
                  onClick={() => onDetail(production)}
                  className="rounded-lg border border-border bg-card-secondary px-3 py-2 text-xs font-medium text-foreground transition hover:border-info hover:text-info"
                >
                  Detail
                </button>

              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>


    {/* Pagination */}
    <div className="flex flex-col gap-4 border-t border-border bg-card-secondary px-5 py-4 md:flex-row md:items-center md:justify-between">

      <p className="text-sm text-muted">
        Showing{' '}
        <span className="font-medium text-foreground">
          {start}
        </span>{' '}
        -{' '}
        <span className="font-medium text-foreground">
          {end}
        </span>{' '}
        of{' '}
        <span className="font-medium text-foreground">
          {totalElements}
        </span>{' '}
        records
      </p>

    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={!page || page.first || loading}
        onClick={() => onPageChange(page.number - 1)}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-card-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        Previous
      </button>

      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-info text-sm font-bold text-white shadow-sm">
        {page ? page.number + 1 : 1}
      </div>

      <button
        type="button"
        disabled={!page || page.last || loading}
        onClick={() => onPageChange(page.number + 1)}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition hover:bg-card-secondary disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>


</section>
  )
}

export default ProductionRawTable
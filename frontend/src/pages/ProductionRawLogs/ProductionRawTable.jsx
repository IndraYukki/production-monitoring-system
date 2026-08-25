import ProductionRawTableSkeleton from "../../components/production/ProductionRawTableSkeleton";
import { formatPercent } from "../../utils/format";


function ProductionRawTable({
  data,
  page,
  onPageChange,
  loading,
  keyword,
  onKeywordChange,
  onPageSizeChange,
  onDetail,
  onEdit,
  onExport,
  sortConfig,
  onSort,
}) 

{
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


    // Helper indikator panah sort
  const renderSortIcon = (columnName) => {
    if (sortConfig?.sortBy !== columnName) return null
    return (
      <span className="ml-1 text-[10px] text-info">
        {sortConfig.sortDir === 'asc' ? '▲' : '▼'}
      </span>
    )
  }

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

    <table className="w-full min-w-full border-collapse text-center">

      {/* Sticky Header */}
      <thead className="sticky top-0 z-20 bg-card-secondary">
        <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted">
          <th
                onClick={() => onSort('productionLot')}
                className="px-4 py-3 font-semibold cursor-pointer select-none hover:text-info transition"
              >
                Lot Date {renderSortIcon('productionLot')}
              </th>
          <th
                onClick={() => onSort('customerName')}
                className="px-4 py-3 font-semibold cursor-pointer select-none hover:text-info transition"
              >
                Customer {renderSortIcon('customerName')}
              </th>
          <th
                onClick={() => onSort('partName')}
                className="px-4 py-3 font-semibold cursor-pointer select-none hover:text-info transition"
              >
                Part Product {renderSortIcon('partName')}
              </th>
          <th
                onClick={() => onSort('shift')}
                className="px-4 py-3 font-semibold cursor-pointer select-none hover:text-info transition"
              >
                Machine & Shift {renderSortIcon('shift')}
          </th>
          
          <th className="px-4 py-3 font-semibold">Operator</th>
          <th
                onClick={() => onSort('qtyOk')}
                className="px-4 py-3 font-semibold cursor-pointer select-none hover:text-info transition"
              >
                OK / WIP / NG {renderSortIcon('qtyOk')}
              </th>
          <th className="px-4 py-3 font-semibold text-right">Output / Target</th>
          <th className="px-4 py-3 font-semibold text-center">Performance</th>
          <th className="px-4 py-3 font-semibold text-center">Action</th>
        </tr>
      </thead>




  {/* Scrollable Production Rows */}


      <tbody className="divide-y divide-border">
        {loading ? (
          <ProductionRawTableSkeleton />
        ) : data.length === 0 ? (
          <tr>
            <td
              colSpan="9"
              className="px-5 py-10 text-center text-sm text-muted"
            >
              Data Tidak Ditemukan!!
            </td>
          </tr>
        ) : (
          data.map((production) => {
            const isTercapai =
              production.productionStatus === 'Tercapai' ||
              (production.achievePercent || 0) >= 100

            return (
              <tr
                key={production.id}
                className="transition hover:bg-card-secondary/60 text-left text-sm"
              >
                {/* 1. Lot Date */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="font-mono text-xs font-medium text-foreground">
                    {production.productionLot || '-'}
                  </span>
                </td>

                {/* 2. Customer */}
                
                <td className="px-4 py-3">
                  <p className="max-w-20 whitespace-normal break-words text-xs font-semibold text-muted">
                    {production.customerName || '-'}
                  </p>
                </td>

                {/* 3. Part Product (Name & No) */}
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="max-w-37.5 font-medium text-info line-clamp-1" title={production.partName}>
                      {production.partName || '-'}
                    </span>
                    <span className="max-w-37.5 font-mono text-xs text-muted">
                      {production.partNo || '-'}
                    </span>
                  </div>
                </td>

                {/* 4. Machine & Shift */}
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="font-semibold text-info">
                      {production.machineName || '-'}
                    </span>
                    <span className="text-xs text-muted">
                      {production.shift || '-'} ({production.uptimeDisplay || '-'})
                    </span>
                  </div>
                </td>

                {/* 5. Operator */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-card-secondary text-xs font-bold text-info border border-border">
                      {production.groub1 === 'RESIGN' ? 'OUT' : production.groub1 || '-'}
                    </div>
                    <span className="max-w-20 break-words text-xs font-medium text-foreground" title={production.operator1Name}>
                      {production.operator1Name || '-'}
                    </span>
                  </div>
                </td>

                
                {/* 6. OK / WIP / NG (Wrapped & Vertical Stack) */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5 font-mono text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-success shrink-0" />
                      <span className="font-semibold text-success">
                        {(production.qtyOk ?? 0).toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-muted uppercase">OK</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-warning shrink-0" />
                      <span className="font-semibold text-warning">
                        {(production.qtyWip ?? 0).toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-muted uppercase">WIP</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-danger shrink-0" />
                      <span className="font-semibold text-danger">
                        {(production.totalNg ?? 0).toLocaleString('id-ID')}
                      </span>
                      <span className="text-[10px] text-muted uppercase">NG</span>
                    </div>
                  </div>
                </td>

                {/* 7. Output / Target */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-mono font-bold text-foreground">
                      {(production.totalOutput ?? 0).toLocaleString('id-ID')}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      Target: {(production.target ?? 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </td>

                {/* 8. Performance (Achieve % + Badge Status) */}
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <div className="flex flex-col items-center gap-1">
                    <span className={`font-mono text-xs font-bold ${isTercapai ? 'text-success' : 'text-danger'}`}>
                      {formatPercent(production.achievePercent)}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isTercapai
                          ? 'bg-accent text-success'
                          : 'bg-danger/15 text-danger'
                      }`}
                    >
                      <span className="size-1 rounded-full bg-current" />
                      {isTercapai ? 'Tercapai' : 'Tidak Target'}
                    </span>
                  </div>
                </td>

                {/* 9. Action */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onDetail(production)}
                        className="rounded-lg border border-border bg-card-secondary px-2.5 py-1.5 text-xs font-medium text-foreground transition hover:border-info hover:text-info"
                      >
                        Detail
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(production)}
                        className="rounded-lg border border-border bg-card-secondary px-2.5 py-1.5 text-xs font-medium text-warning transition hover:border-warning hover:bg-warning/10"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
              </tr>
            )
          })
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
import { useEffect, useState } from 'react'
import ProductionRawFilter from './ProductionRawFilter'
import ProductionRawTable from './ProductionRawTable'
import { getProductionLogs, exportProductionExcel, deleteProduction, updateProduction } from '../../services/productionService'
import { getCustomers } from '../../services/customerService'
import { getMachines } from '../../services/machineService'
import ProductionDetailModal from '../../components/production/ProductionDetailModal'
import ProductionEditModal from '../../components/production/ProductionEditModal'

// Mengambil tanggal 1 di bulan & tahun berjalan (YYYY-MM-01)
const getStartDateOfMonth = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

// Mengambil tanggal hari ini (YYYY-MM-DD)
const getTodayDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function ProductionRawLogs() {
  const [pageSize, setPageSize] = useState(10)
  const [productionPage, setProductionPage] = useState({
    content: [],
    number: 0,
    size: pageSize,
    totalElements: 0,
    totalPages: 0,
  })

  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selectedProduction, setSelectedProduction] = useState(null)
  const [openDetailModal, setOpenDetailModal] = useState(false)

  const [sortConfig, setSortConfig] = useState({
    sortBy: 'createdAt',
    sortDir: 'desc',
  })

  const [customers, setCustomers] = useState([])
  const [machines, setMachines] = useState([])

  const [filters, setFilters] = useState({
    keyword: '',
    customerId: '',
    machineId: '',
    shift: '',
    tanggalMulai: getStartDateOfMonth(),
    tanggalSelesai: getTodayDate(),
  })


  // State Modal Edit
      const [openEditModal, setOpenEditModal] = useState(false)

      // Handler Buka & Tutup Edit Modal
      const handleOpenEdit = (production) => {
        setSelectedProduction(production)
        setOpenEditModal(true)
      }

      const handleCloseEdit = () => {
        setOpenEditModal(false)
        setSelectedProduction(null)
      }

      // Handler Submit Save Edit ke Backend
      const handleSaveEdit = async (id, updatedPayload) => {
        try {
          await updateProduction(id, updatedPayload)
          alert('Data produksi berhasil diperbarui!')

          handleCloseEdit()
          fetchProductionLogs() // Refresh tabel
        } catch (error) {
          console.error('Gagal memperbarui produksi:', error)
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Gagal memperbarui produksi'

          alert(errorMessage)
        }
      }

  // API 1: Fetch Master Data Customers
  const fetchCustomers = async () => {
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error('Gagal mengambil customer:', error)
    }
  }

  // API 2: Fetch Master Data Machines
  const fetchMachines = async () => {
    try {
      const data = await getMachines()
      setMachines(data)
    } catch (error) {
      console.error('Gagal mengambil machine:', error)
    }
  }

  // API 3: Fetch Production Logs (Clean & Dumb presenter)
  const fetchProductionLogs = async (
    currentFilters = filters,
    currentSort = sortConfig,
    currentPage = page,
    currentSize = pageSize) => {
    try {
      setLoading(true)

      const data = await getProductionLogs({
        ...currentFilters,
        halaman: currentPage,
        jumlah: currentSize,
        sortBy: currentSort.sortBy,
        sortDir: currentSort.sortDir,
      })

      setProductionPage({
        content: data?.content || [],
        number: data?.number || 0,
        size: data?.size || pageSize,
        totalElements: data?.totalElements || 0,
        totalPages: data?.totalPages || 0,
      })
    } catch (error) {
      console.error('Gagal mengambil production logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
    fetchMachines()
  }, [])

  useEffect(() => {
    fetchProductionLogs()
  }, [page, pageSize])

  const handleSort = (columnName) => {
    let newDir = 'asc'
    if (sortConfig.sortBy === columnName && sortConfig.sortDir === 'asc') {
      newDir = 'desc'
    }

    const newSort = { sortBy: columnName, sortDir: newDir }
    setSortConfig(newSort)
    setPage(0)
    fetchProductionLogs(filters, newSort, 0, pageSize)
  }

  const handlePageSizeChange = (size) => {
    setPage(0)
    setPageSize(Number(size))
  }

  const handleApplyFilter = () => {
    setPage(0)
    fetchProductionLogs(filters)
  }

  const handleResetFilter = () => {
    const resetFilters = {
      keyword: '',
      customerId: '',
      machineId: '',
      shift: '',
      tanggalMulai: getStartDateOfMonth(),
      tanggalSelesai: getTodayDate(),
    }

    setPage(0)
    setFilters(resetFilters)
    fetchProductionLogs(resetFilters)
  }

  const handleKeywordChange = (value) => {
    const updatedFilters = {
      ...filters,
      keyword: value,
    }

    setPage(0)
    setFilters(updatedFilters)
    fetchProductionLogs(updatedFilters)
  }

  const handleExport = async () => {
    try {
      const response = await exportProductionExcel(filters)

      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'Raw Production.xlsx'

      document.body.appendChild(link)
      link.click()

      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Gagal export production:', error)
    }
  }

  const handleOpenDetail = (production) => {
    setSelectedProduction(production)
    setOpenDetailModal(true)
  }

  const handleCloseDetail = () => {
    setOpenDetailModal(false)
    setSelectedProduction(null)
  }

  const handleDeleteProduction = async (production) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus production ${production.partName}?`
    )

    if (!confirmDelete) {
      return handleCloseDetail()
    }
    try {
      await deleteProduction(production.id)
      alert('Production berhasil dihapus')

      handleCloseDetail()
      fetchProductionLogs()
    } catch (error) {
      console.error('Gagal menghapus production:', error)
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Gagal menghapus production'

      alert(errorMessage)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
            Production Raw Logs
          </h1>
          <p className="mt-1 text-sm text-muted">
            Historical production records and production performance data.
          </p>
        </div>

        <ProductionRawFilter
          filters={filters}
          setFilters={setFilters}
          customers={customers}
          machines={machines}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />

        <ProductionRawTable
          data={productionPage?.content ?? []}
          page={productionPage}
          onPageChange={setPage}
          loading={loading}
          keyword={filters.keyword}
          onKeywordChange={handleKeywordChange}
          onPageSizeChange={handlePageSizeChange}
          onDetail={handleOpenDetail}
          onEdit={handleOpenEdit}
          onExport={handleExport}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        <ProductionDetailModal
          open={openDetailModal}
          onClose={handleCloseDetail}
          production={selectedProduction}
        />
        <ProductionEditModal
          open={openEditModal}
          onClose={handleCloseEdit}
          production={selectedProduction}
          onSave={handleSaveEdit}
          onDelete={handleDeleteProduction}
        />
      </div>
    </main>
  )
}

export default ProductionRawLogs
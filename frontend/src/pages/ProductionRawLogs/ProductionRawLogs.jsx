import { useEffect, useState } from 'react'
import ProductionRawFilter from './ProductionRawFilter'
import ProductionRawTable from './ProductionRawTable'
import { getProductionLogs, exportProductionExcel, deleteProduction } from '../../services/productionService'
import { getCustomers } from '../../services/customerService'
import { getMachines } from '../../services/machineService'
import ProductionDetailModal from '../../components/production/ProductionDetailModal'



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


  const [customers, setCustomers] = useState([])
  const [machines, setMachines] = useState([])

  const [filters, setFilters] = useState({
    keyword: '',
    customerId: '',
    machineId: '',
    shift: '',
    tanggalMulai: '',
    tanggalSelesai: '',
  })

    useEffect(() => {
    fetchCustomers()
    fetchMachines()
  }, [])

  useEffect(() => {
    fetchProductionLogs()
  }, [page, pageSize])


  const fetchCustomers = async () => {
    try {
      const data = await getCustomers()
      setCustomers(data)
    } catch (error) {
      console.error('Gagal mengambil customer:', error)
    }
  }
  const handlePageSizeChange = (size) => {
    setPage(0)
    setPageSize(Number(size))
  }

  const fetchMachines = async () => {
    try {
      const data = await getMachines()
      setMachines(data)
    } catch (error) {
      console.error('Gagal mengambil machine:', error)
    }
  }

  const fetchProductionLogs = async (currentFilters = filters) => {
    try {
      setLoading(true)

            const data = await getProductionLogs({
        ...currentFilters,
        halaman: page,
        jumlah: pageSize,
      })

      const transformedData = data.content.map((production) => {
        const totalNg = (production.defects ?? []).reduce(
          (total, defect) => total + (defect.qtyNg ?? 0),
          0
        )

        const totalProduction = (production.qtyOk ?? 0) + totalNg  + (production.qtyWip ?? 0)
        const uptimeHours = (production.uptimeMc ?? 0) / 60

        const productionTime =
          production.machineName === 'WIP'
            ? production.takeTime
            : production.cycleTime

        const target =
          productionTime && production.cavity && uptimeHours > 0
            ? Math.ceil((3600 / productionTime) * production.cavity * uptimeHours)
            : 0

        const achievement = target > 0 ? (totalProduction / target) * 100 : 0

        const status = totalProduction >= target ? 'TARGET' : 'NOT TARGET'

        return {
          ...production,
          totalNg,
          totalProduction,
          target,
          achievement,
          status,
        }
      })

      setProductionPage({
        ...data,
        content: transformedData,
      })
    } catch (error) {

      console.error('Gagal mengambil production logs:', error)
    } finally {
      setLoading(false)
    }
  };

    const handleApplyFilter = () => {
    setPage(0)
    fetchProductionLogs(filters)
  };

  const handleResetFilter = () => {
    const resetFilters = {
      keyword: '',
      customerId: '',
      machineId: '',
      shift: '',
      tanggalMulai: '',
      tanggalSelesai: '',
    }

    setPage(0)
    setFilters(resetFilters)
    fetchProductionLogs(resetFilters)
  };

  const handleKeywordChange = (value) => {
    const updatedFilters = {
      ...filters,
      keyword: value,
    }

    setPage(0)
    setFilters(updatedFilters)
    fetchProductionLogs(updatedFilters)
  };

  const handleExport = async () => {
    try {
      const response = await exportProductionExcel(filters)

      const blob = new Blob(
        [response.data],
        {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }
      )

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
    };
    
    const handleDeleteProduction = async (production) => {

          const confirmDelete = window.confirm(
          `Apakah Anda yakin ingin menghapus production ${production.partName}?`
        )

      if (!confirmDelete) {
        return handleCloseDetail()
      }
      try {

        console.log('Confirm Delete:', confirmDelete)

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
          onExport={handleExport}
        />

        <ProductionDetailModal
            open={openDetailModal}
            onClose={handleCloseDetail}
            production={selectedProduction}
            onDelete={handleDeleteProduction}
        />



      </div>
    </main>
  )
}

export default ProductionRawLogs
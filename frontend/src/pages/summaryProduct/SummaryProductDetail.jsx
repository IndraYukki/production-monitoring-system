import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays } from 'lucide-react'

import {
  getProductDetailCards,
  getProductDetailChart,
  getProductDetailLogs,
} from '../../services/productSummaryService'
import { getProductionById } from '../../services/productionService'

import SummaryProductDetailCards from '../../components/summaryProduct/SummaryProductDetailCards'
import SummaryProductNgChart from '../../components/summaryProduct/SummaryProductNgChart'
import SummaryProductDetailTable from '../../components/summaryProduct/SummaryProductDetailTable'
import ProductionDetailModal from '../../components/production/ProductionDetailModal'

import { getTodayISO, getFirstDayOfMonthISO } from '../../utils/dateHelper'

export default function SummaryProductDetail() {
  const { productId } = useParams()
  const location = useLocation()

  // Ambil tanggal & machine filter dari state navigasi Page 1
  const tanggalMulai = location.state?.tanggalMulai || getFirstDayOfMonthISO()
  const tanggalSelesai = location.state?.tanggalSelesai || getTodayISO()
  const machineId = location.state?.machineId || null

  // State Pagination & Sorting
  const [halaman, setHalaman] = useState(0)
  const [jumlah, setJumlah] = useState(10)
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'productionLot',
    sortDir: 'desc',
  })

  // State Data
  const [cardsData, setCardsData] = useState(null)
  const [chartData, setChartData] = useState([])
  const [pageData, setPageData] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
  })

  // State Loading
  const [loadingCards, setLoadingCards] = useState(false)
  const [loadingChart, setLoadingChart] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)

  // Modal Detail State
  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [selectedProduction, setSelectedProduction] = useState(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  // Handler Sort Header Tabel
  const handleSort = (columnName) => {
    let newDir = 'asc'
    if (sortConfig.sortBy === columnName && sortConfig.sortDir === 'asc') {
      newDir = 'desc'
    }
    setSortConfig({ sortBy: columnName, sortDir: newDir })
    setHalaman(0)
  }

  // API 4: Get Product Detail Cards
  const fetchDetailCards = useCallback(async () => {
    if (!productId) return
    try {
      setLoadingCards(true)
      const data = await getProductDetailCards(productId, {
        tanggalMulai,
        tanggalSelesai,
        machineId,
      })
      setCardsData(data)
    } catch (error) {
      console.error('Error fetching product detail cards:', error)
    } finally {
      setLoadingCards(false)
    }
  }, [productId, tanggalMulai, tanggalSelesai, machineId])

  // API 5: Get Product Detail NG Chart
  const fetchDetailChart = useCallback(async () => {
    if (!productId) return
    try {
      setLoadingChart(true)
      const data = await getProductDetailChart(productId, {
        tanggalMulai,
        tanggalSelesai,
        machineId,
      })
      setChartData(data || [])
    } catch (error) {
      console.error('Error fetching product detail chart:', error)
    } finally {
      setLoadingChart(false)
    }
  }, [productId, tanggalMulai, tanggalSelesai, machineId])

  // API 6: Get Product Detail Logs
  const fetchDetailLogs = useCallback(async () => {
    if (!productId) return
    try {
      setLoadingTable(true)
      const data = await getProductDetailLogs(productId, {
        tanggalMulai,
        tanggalSelesai,
        machineId,
        halaman,
        jumlah,
        sortBy: sortConfig.sortBy,
        sortDir: sortConfig.sortDir,
      })
      setPageData({
        content: data?.content || [],
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
      })
    } catch (error) {
      console.error('Error fetching product detail logs:', error)
    } finally {
      setLoadingTable(false)
    }
  }, [productId, tanggalMulai, tanggalSelesai, machineId, halaman, jumlah, sortConfig])

  useEffect(() => {
    fetchDetailCards()
  }, [fetchDetailCards])

  useEffect(() => {
    fetchDetailChart()
  }, [fetchDetailChart])

  useEffect(() => {
    fetchDetailLogs()
  }, [fetchDetailLogs])

  // Handler Buka Pop-up Log Detail (Read-Only Modal)
  // ProductDetailLogDTO sengaja ramping (tanpa defects/remark/customer/createdAt),
  // jadi saat klik kita ambil ProductionResponseDTO lengkap dari /api/production/{id}
  // supaya modal membaca field sesuai kontrak aslinya.
  const handleOpenDetail = async (log) => {
    if (loadingDetail) return
    try {
      setLoadingDetail(true)
      const data = await getProductionById(log.productionId)
      setSelectedProduction(data)
      setOpenDetailModal(true)
    } catch (error) {
      console.error('Gagal memuat detail production:', error)
      alert('Gagal memuat detail production')
    } finally {
      setLoadingDetail(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-5 sm:px-2 sm:py-4 lg:px-2">
        {/* Tombol Back */}
        <Link
          to="/product-summary"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Kembali ke Performance Product
        </Link>

        {/* Header Page 2 */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-info">
              <span className="size-2 rounded-full bg-info" /> Product Detail Logs
            </div>

            {/* Nama & Part No Produk */}
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl text-foreground">
              {loadingCards ? 'Memuat Data...' : cardsData?.partNo || `Product #${productId}`}
            </h1>

            {/* Subtitle Customer & Info */}
            <p className="mt-2 text-sm text-muted">
              Part Name: <span className="font-semibold text-foreground">{cardsData?.partName || '-'}</span> · Customer:{' '}
              <span className="rounded-md bg-card-secondary border border-border px-2.5 py-0.5 text-xs font-semibold text-foreground">
                {cardsData?.customerName || '-'}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted">
            <CalendarDays className="size-4 text-info" /> Periode: {tanggalMulai} s/d {tanggalSelesai}
          </div>
        </header>

        {/* 1. Detail Cards Section */}
        <SummaryProductDetailCards cardsData={cardsData} loading={loadingCards} />

        {/* 2. NG Defect Chart Section khusus Produk Ini */}
        <SummaryProductNgChart data={chartData} loading={loadingChart} />

        {/* 3. Detail Logs Table Section */}
        <SummaryProductDetailTable
          pageData={pageData}
          loading={loadingTable}
          halaman={halaman}
          setHalaman={setHalaman}
          jumlah={jumlah}
          setJumlah={setJumlah}
          onRowClick={handleOpenDetail}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        {/* Modal Read-Only Detail Log Transaksi */}
        <ProductionDetailModal
          open={openDetailModal}
          onClose={() => setOpenDetailModal(false)}
          production={selectedProduction}
          onEdit={() => setOpenDetailModal(false)}
        />
      </div>
    </main>
  )
}
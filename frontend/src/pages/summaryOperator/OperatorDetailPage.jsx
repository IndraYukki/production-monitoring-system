import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import {
  getOperatorDetailCards,
  getOperatorDetailLogs,
} from '../../services/summaryOperatorService'
import DetailCards from '../../components/summaryOperator/DetailCards'
import DetailLogsTable from '../../components/summaryOperator/DetailLogsTable'
import ProductionDetailModal from '../../components/production/ProductionDetailModal'

const OperatorDetailPage = () => {
  const { operatorId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  
    const getTodayISO = () => new Date().toISOString().split('T')[0]
    const getFirstDayOfMonthISO = () => {
      const d = new Date()
      return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
    }

    // Ambil tanggal langsung dari state navigasi Page 1
    const tanggalMulai = location.state?.tanggalMulai || getFirstDayOfMonthISO()
    const tanggalSelesai = location.state?.tanggalSelesai || getTodayISO()

  const [halaman, setHalaman] = useState(0)
  const [jumlah, setJumlah] = useState(10)

  const [cardsData, setCardsData] = useState(null)
  const [pageData, setPageData] = useState({ content: [], totalPages: 0, totalElements: 0 })

  const [loadingCards, setLoadingCards] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)

  const [openDetailModal, setOpenDetailModal] = useState(false)
  const [selectedProduction, setSelectedProduction] = useState(null)

// ...

    const handleOpenDetail = (log) => {
      setSelectedProduction({
        ...log,
        id: log.productionId, // Memastikan prop id terbaca oleh ProductionDetailModal
      })
      setOpenDetailModal(true)
    }

  // API 3: Get Operator Detail Cards
  const fetchDetailCards = useCallback(async () => {
    if (!operatorId) return
    try {
      setLoadingCards(true)
      const data = await getOperatorDetailCards(operatorId, {
        tanggalMulai,
        tanggalSelesai,
      })
      setCardsData(data)
    } catch (error) {
      console.error('Error fetching detail cards:', error)
    } finally {
      setLoadingCards(false)
    }
  }, [operatorId, tanggalMulai, tanggalSelesai])

  // API 4: Get Operator Detail Logs (Table)
  const fetchDetailLogs = useCallback(async () => {
    if (!operatorId) return
    try {
      setLoadingTable(true)
      const data = await getOperatorDetailLogs(operatorId, {
        tanggalMulai,
        tanggalSelesai,
        halaman,
        jumlah,
      })
      setPageData({
        content: data?.content || [],
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
      })
    } catch (error) {
      console.error('Error fetching detail logs:', error)
    } finally {
      setLoadingTable(false)
    }
  }, [operatorId, tanggalMulai, tanggalSelesai, halaman, jumlah])

  useEffect(() => {
    fetchDetailCards()
  }, [fetchDetailCards])

  useEffect(() => {
    fetchDetailLogs()
  }, [fetchDetailLogs])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-5 sm:px-2 sm:py-4 lg:px-2">
        
        {/* Tombol Back */}
        <Link
          to="/operator-summary"
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Kembali ke Performance Operator
        </Link>

            {/* Header Page 2 */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-info">
                <span className="size-2 rounded-full bg-info" /> Operator Logs
                </div>
                
                {/* Tampilkan Nama Operator (Fallback jika loading) */}
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl text-foreground">
                {loadingCards ? 'Memuat Data...' : (cardsData?.operatorName || `Operator #${operatorId}`)}
                </h1>
                
                {/* Subtitle NIK, Group, & Info */}
                <p className="mt-2 text-sm text-muted">
                NIK: <span className="font-medium text-foreground">{cardsData?.nik || '-'}</span> · Group{' '}
                <span className="rounded-md bg-card-secondary border border-border px-2 py-0.5 text-xs font-semibold text-foreground">
                    {cardsData?.groub || '-'}
                </span>{' '}
                </p>
                <p className="mt-1 max-w-xl text-sm leading-6 text-muted"> 
                Menampilkan histori log transaksi produksi & pencapaian target.
                </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted">
                <CalendarDays className="size-4 text-info" /> Periode: {tanggalMulai} s/d {tanggalSelesai}
            </div>
            </header>


        {/* Section 7 Cards */}
        <DetailCards cardsData={cardsData} loading={loadingCards} />

        {/* Section Logs Table */}
        <DetailLogsTable
          pageData={pageData}
          loading={loadingTable}
          halaman={halaman}
          setHalaman={setHalaman}
          jumlah={jumlah}
          setJumlah={setJumlah}
          onRowClick={handleOpenDetail}
        />
        <ProductionDetailModal
          open={openDetailModal}
          onClose={() => setOpenDetailModal(false)}
          production={selectedProduction}
          onEdit={() => {
            setOpenDetailModal(false)
          }}
        />

      </div>
    </main>
  )
}

export default OperatorDetailPage
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { getOperatorDetailCards, getOperatorDetailLogs } from '../../services/summaryOperatorService'
import DetailCards from '../../components/summaryOperator/DetailCards'
import DetailLogsTable from '../../components/summaryOperator/DetailLogsTable'

const OperatorDetailPage = () => {
  const { operatorId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const getTodayISO = () => new Date().toISOString().split('T')[0]
  const getFirstDayOfMonthISO = () => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
  }

  // Tangkap tanggal awal dari Page 1 jika ada
  const initialMulai = location.state?.tanggalMulai || getFirstDayOfMonthISO()
  const initialSelesai = location.state?.tanggalSelesai || getTodayISO()

  const [tanggalMulai, setTanggalMulai] = useState(initialMulai)
  const [tanggalSelesai, setTanggalSelesai] = useState(initialSelesai)

  const [halaman, setHalaman] = useState(0)
  const [jumlah, setJumlah] = useState(10)

  const [cardsData, setCardsData] = useState(null)
  const [pageData, setPageData] = useState({ content: [], totalPages: 0, totalElements: 0 })

  const [loadingCards, setLoadingCards] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)

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

        {/* Filter Tanggal Range */}
        <section aria-label="Filters" className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
          <div className="flex items-center justify-end gap-2">
            <label className="relative shrink-0">
              <span className="sr-only">Tanggal mulai</span>
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="date"
                value={tanggalMulai}
                onChange={(e) => {
                  setTanggalMulai(e.target.value)
                  setHalaman(0)
                }}
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none focus:border-info sm:w-auto"
              />
            </label>
            <span className="text-xs text-muted">s/d</span>
            <label className="relative shrink-0">
              <span className="sr-only">Tanggal selesai</span>
              <CalendarDays className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                type="date"
                value={tanggalSelesai}
                onChange={(e) => {
                  setTanggalSelesai(e.target.value)
                  setHalaman(0)
                }}
                className="h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 text-sm text-foreground outline-none focus:border-info sm:w-auto"
              />
            </label>
          </div>
        </section>

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
        />

      </div>
    </main>
  )
}

export default OperatorDetailPage
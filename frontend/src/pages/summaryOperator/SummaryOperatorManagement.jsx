import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, SlidersHorizontal } from 'lucide-react'
import { getSummaryCards, getOperatorSummaryList} from '../../services/summaryOperatorService'
import SummaryCards from '../../components/summaryOperator/SummaryCards'
import SummaryTable from '../../components/summaryOperator/SummaryTable'



const GROUPS = ['All Active', 'A', 'B', 'C', 'RESIGN']

  // Mengambil tanggal 1 di bulan dan tahun saat ini (Format: YYYY-MM-01)
    const getStartDateOfMonth = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      return `${year}-${month}-01`
    }

    // Mengambil tanggal hari ini (Format: YYYY-MM-DD)
    const getTodayDate = () => {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }

export default function SummaryOperatorManagement() {
  const navigate = useNavigate()

  
  const [tanggalMulai, setTanggalMulai] = useState(getStartDateOfMonth())
  const [tanggalSelesai, setTanggalSelesai] = useState(getTodayDate())

  const [groub, setGroub] = useState('All Active')
  const [keyword, setKeyword] = useState('')

  const [halaman, setHalaman] = useState(0)
  const [jumlah, setJumlah] = useState(10)

  // Data State
  const [cardsData, setCardsData] = useState({ totalOutput: 0, totalTarget: 0, totalAchieve: 0 })
  const [pageData, setPageData] = useState({ content: [], totalPages: 0, totalElements: 0 })

  const [loadingCards, setLoadingCards] = useState(false)
  const [loadingTable, setLoadingTable] = useState(false)

  // Trigger API Cards (Reload saat tanggal atau groub berubah)
  const fetchCards = useCallback(async () => {
    try {
      setLoadingCards(true)
      const data = await getSummaryCards({ tanggalMulai, tanggalSelesai, groub })
      setCardsData(data || { totalOutput: 0, totalTarget: 0, totalAchieve: 0 })
    } catch (error) {
      console.error('Error fetching summary cards:', error)
    } finally {
      setLoadingCards(false)
    }
  }, [tanggalMulai, tanggalSelesai, groub])

  // Trigger API Table (Reload saat tanggal, groub, keyword, halaman, atau jumlah berubah)
  const fetchTable = useCallback(async () => {
    try {
      setLoadingTable(true)
      const data = await getOperatorSummaryList({
        tanggalMulai,
        tanggalSelesai,
        groub,
        keyword,
        halaman,
        jumlah,
      })
      setPageData({
        content: data?.content || [],
        totalPages: data?.totalPages || 0,
        totalElements: data?.totalElements || 0,
      })
    } catch (error) {
      console.error('Error fetching operator summary list:', error)
    } finally {
      setLoadingTable(false)
    }
  }, [tanggalMulai, tanggalSelesai, groub, keyword, halaman, jumlah])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  useEffect(() => {
    fetchTable()
  }, [fetchTable])

  const handleRowClick = (operatorId) => {
    navigate(`/operator-summary/${operatorId}`, {
      state: { tanggalMulai, tanggalSelesai },
    })
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-5 sm:px-2 sm:py-4 lg:px-2">
        
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-info">
              <span className="size-2 rounded-full bg-info" /> Production Monitoring
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
              Performance Operator
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Pantau pencapaian output operator dan telusuri log produksi per orang.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <CalendarDays className="size-4" /> Periode: {tanggalMulai} s/d {tanggalSelesai}
          </div>
        </header>

        {/* Global Filter Bar (Group & Range Tanggal) */}
        <section aria-label="Filters" className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Group Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
              <SlidersHorizontal className="size-4 shrink-0 text-muted" />
              {GROUPS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setGroub(item)
                    setHalaman(0)
                  }}
                  className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                    groub === item
                      ? 'bg-info text-white'
                      : 'text-muted hover:bg-card-secondary hover:text-foreground'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Date Range Picker */}
            <div className="flex items-center gap-2">
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

          </div>
        </section>

        {/* Card Component */}
        <SummaryCards cardsData={cardsData} loading={loadingCards} />

        {/* Table Component */}
        <SummaryTable
          pageData={pageData}
          loading={loadingTable}
          keyword={keyword}
          setKeyword={setKeyword}
          halaman={halaman}
          setHalaman={setHalaman}
          jumlah={jumlah}
          setJumlah={setJumlah}
          onRowClick={handleRowClick}
        />

      </div>
    </main>
  )
}
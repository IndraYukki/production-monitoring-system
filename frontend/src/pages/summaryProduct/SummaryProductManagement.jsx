import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, Cpu, Users } from 'lucide-react'

import {
  getProductSummaryCards,
  getProductSummaryChart,
  getProductSummaryList,
} from '../../services/productSummaryService'
import { getCustomers } from '../../services/customerService'

import SummaryProductCards from '../../components/summaryProduct/SummaryProductCards'
import SummaryProductNgChart from '../../components/summaryProduct/SummaryProductNgChart'
import SummaryProductTable from '../../components/summaryProduct/SummaryProductTable'
import { MACHINES } from '../../constants/machines'

import { getTodayISO, getFirstDayOfMonthISO } from '../../utils/dateHelper'

export default function SummaryProductManagement() {
  const navigate = useNavigate()

  // State Filters
  const [tanggalMulai, setTanggalMulai] = useState(getFirstDayOfMonthISO())
  const [tanggalSelesai, setTanggalSelesai] = useState(getTodayISO())
  // Filter mesin:
  //   ''            → All Category (semua produksi, termasuk WIP)
  //   'allMachines' → All Machines (semua mesin KECUALI WIP)
  //   selain itu    → id mesin tertentu (WIP, MC-1, ...)
  const [machineFilter, setMachineFilter] = useState('')
  const [customerId, setCustomerId] = useState(null)

  // Turunan dari machineFilter — dipakai sebagai param API
  const machineId =
    machineFilter && machineFilter !== 'allMachines' ? Number(machineFilter) : null
  const excludeWip = machineFilter === 'allMachines'
  const [keyword, setKeyword] = useState('')

  // Daftar customer untuk dropdown filter
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await getCustomers()
        setCustomers(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Gagal mengambil customers:', error)
        setCustomers([])
      }
    }
    fetchCustomers()
  }, [])

  // State Pagination
  const [halaman, setHalaman] = useState(0)
  const [jumlah, setJumlah] = useState(10)

  // State Data
  const [cardsData, setCardsData] = useState({
    totalOutput: 0,
    totalTarget: 0,
    totalNg: 0,
    totalNgRate: 0,
    totalAchieve: 0,
    totalUptime: 0,
    uptimeDisplay: '0 menit',
  })
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

  // State Sort
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'totalOutput',
    sortDir: 'desc',
  })

  // Handler Sort Header Tabel
  const handleSort = (columnName) => {
    let newDir = 'asc'
    if (sortConfig.sortBy === columnName && sortConfig.sortDir === 'asc') {
      newDir = 'desc'
    }
    setSortConfig({ sortBy: columnName, sortDir: newDir })
    setHalaman(0)
  }

  // API 1: Fetch Cards
  const fetchCards = useCallback(async () => {
    try {
      setLoadingCards(true)
      const data = await getProductSummaryCards({
        tanggalMulai,
        tanggalSelesai,
        machineId,
        customerId,
        excludeWip,
      })
      setCardsData(
        data || {
          totalOutput: 0,
          totalTarget: 0,
          totalNg: 0,
          totalNgRate: 0,
          totalAchieve: 0,
          totalUptime: 0,
          uptimeDisplay: '0 menit',
        }
      )
    } catch (error) {
      console.error('Error fetching product summary cards:', error)
    } finally {
      setLoadingCards(false)
    }
  }, [tanggalMulai, tanggalSelesai, machineFilter, customerId])

  // API 2: Fetch NG Chart
  const fetchChart = useCallback(async () => {
    try {
      setLoadingChart(true)
      const data = await getProductSummaryChart({
        tanggalMulai,
        tanggalSelesai,
        machineId,
        customerId,
        excludeWip,
      })
      setChartData(data || [])
    } catch (error) {
      console.error('Error fetching product summary chart:', error)
    } finally {
      setLoadingChart(false)
    }
  }, [tanggalMulai, tanggalSelesai, machineFilter, customerId])

  // API 3: Fetch Table List
  const fetchTable = useCallback(async () => {
    try {
      setLoadingTable(true)
      const data = await getProductSummaryList({
        tanggalMulai,
        tanggalSelesai,
        machineId,
        customerId,
        excludeWip,
        keyword,
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
      console.error('Error fetching product summary list:', error)
    } finally {
      setLoadingTable(false)
    }
  }, [
    tanggalMulai,
    tanggalSelesai,
    machineFilter,
    customerId,
    keyword,
    halaman,
    jumlah,
    sortConfig,
  ])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  useEffect(() => {
    fetchChart()
  }, [fetchChart])

  useEffect(() => {
    fetchTable()
  }, [fetchTable])

  // Navigasi ke Page 2 (Detail Produk)
  const handleRowClick = (productId) => {
    navigate(`/product-summary/${productId}`, {
      state: { tanggalMulai, tanggalSelesai, machineId, excludeWip },
    })
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-5 sm:px-2 sm:py-4 lg:px-2">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-info">
              <span className="size-2 rounded-full bg-info" /> Production
              Monitoring
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">
              Performance Product
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Pantau akumulasi output produk, persentase pencapaian target, dan
              distribusi NG defect.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted">
            <CalendarDays className="size-4" /> Periode: {tanggalMulai} s/d{' '}
            {tanggalSelesai}
          </div>
        </header>

        {/* Global Filter Bar (Machine & Range Tanggal) */}
        <section
          aria-label="Filters"
          className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4"
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Machine Selector Filter */}
              <div className="flex items-center gap-2 w-full sm:w-72">
                <Cpu className="size-4 shrink-0 text-muted" />
                <select
                  value={machineFilter}
                  onChange={(e) => {
                    setMachineFilter(e.target.value)
                    setHalaman(0)
                  }}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-info"
                >
                  <option value="">All Category</option>
                  <option value="allMachines">All Machines</option>
                  {MACHINES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Selector Filter */}
              <div className="flex items-center gap-2 w-full sm:w-72">
                <Users className="size-4 shrink-0 text-muted" />
                <select
                  value={customerId || ''}
                  onChange={(e) => {
                    const val = e.target.value
                    setCustomerId(val ? Number(val) : null)
                    setHalaman(0)
                  }}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-info"
                >
                  <option value="">Semua Customer (All Customers)</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.customer}
                    </option>
                  ))}
                </select>
              </div>
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

        {/* 1. KTA Cards Component */}
        <SummaryProductCards cardsData={cardsData} loading={loadingCards} />

        {/* 2. NG Defect Chart Component */}
        <SummaryProductNgChart data={chartData} loading={loadingChart} />

        {/* 3. Product Summary Table Component */}
        <SummaryProductTable
          pageData={pageData}
          loading={loadingTable}
          keyword={keyword}
          setKeyword={setKeyword}
          halaman={halaman}
          setHalaman={setHalaman}
          jumlah={jumlah}
          setJumlah={setJumlah}
          onRowClick={handleRowClick}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </div>
    </main>
  )
}
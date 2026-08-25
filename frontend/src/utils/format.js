/**
 * UTILITY FORMAT ANGKA & TANGGAL — SUMBER TUNGGAL UNTUK FRONTEND
 *
 * Semua tampilan persentase (Achievement, NG Rate) wajib memakai
 * formatPercent agar konsisten. Backend mengirim nilai 2 desimal
 * (misal 98.57, 0.83) — jangan potong dengan Math.floor/parseInt di FE.
 */
export const formatPercent = (value) => `${Number(value ?? 0).toFixed(2)}%`

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

/**
 * Format timestamp menjadi "04 Agu 2026 13:21" (waktu lokal browser).
 * Mengembalikan '-' bila nilai kosong atau tidak valid.
 */
export const formatDateTime = (value) => {
  if (!value) return '-'

  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '-'

  const pad2 = (n) => String(n).padStart(2, '0')

  return `${pad2(d.getDate())} ${BULAN[d.getMonth()]} ${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

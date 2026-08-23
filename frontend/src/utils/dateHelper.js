/**
 * UTILITY TANGGAL — SUMBER TUNGGAL UNTUK FRONTEND
 *
 * Memakai waktu lokal, bukan toISOString() yang mengubah ke UTC.
 * Di zona WIB (UTC+7), toISOString() membuat tanggal mundur satu hari.
 */

const pad = (angka) => String(angka).padStart(2, '0')

/**
 * Tanggal hari ini dalam format YYYY-MM-DD (waktu lokal).
 */
export const getTodayISO = () => {
  const now = new Date()

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/**
 * Tanggal 1 pada bulan & tahun berjalan, format YYYY-MM-01 (waktu lokal).
 * Dipakai sebagai default awal rentang filter.
 */
export const getFirstDayOfMonthISO = () => {
  const now = new Date()

  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`
}

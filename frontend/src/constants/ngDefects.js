/**
 * MASTER NG DEFECT — SUMBER TUNGGAL UNTUK FRONTEND
 *
 * Sebelumnya ditulis ulang di ShiftForm (name: 'LAINYA') dan
 * ProductionEditModal (name: 'LAIN-LAIN') dengan id yang sama.
 * Yang dipakai adalah versi 'LAIN-LAIN' karena sesuai isi database.
 *
 * PENTING: id wajib sama persis dengan tabel `ng_defects` di database,
 * karena nilai id inilah yang dikirim sebagai ngDefectId ke backend.
 */
export const NG_DEFECTS = [
  { id: 4, name: 'BURRY' },
  { id: 5, name: 'OVERCUT' },
  { id: 6, name: 'DIRTY' },
  { id: 7, name: 'DISCOLOR' },
  { id: 8, name: 'BUBBLE' },
  { id: 9, name: 'BROCKEN' },
  { id: 10, name: 'BLACKDOT' },
  { id: 11, name: 'SHORTMOLD' },
  { id: 12, name: 'DENTED' },
  { id: 13, name: 'SHINNING' },
  { id: 14, name: 'BENDING' },
  { id: 15, name: 'BURAM' },
  { id: 16, name: 'WELDLINE' },
  { id: 17, name: 'SILVER' },
  { id: 18, name: 'LAIN-LAIN' },
]

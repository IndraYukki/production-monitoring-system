/**
 * MASTER DATA MACHINE — SUMBER TUNGGAL UNTUK FRONTEND
 *
 * Array ini sebelumnya ditulis ulang di 3 file berbeda
 * (MachineAutoComplite, ProductionInfo, ProductionEditModal).
 * Sekarang cukup import dari sini.
 *
 * PENTING: id wajib sama persis dengan tabel `machines` di database,
 * karena nilai id inilah yang dikirim sebagai machineId ke backend.
 */
export const MACHINES = [
  { id: 1, name: 'WIP' },
  { id: 2, name: 'MC-1' },
  { id: 3, name: 'MC-2' },
  { id: 4, name: 'MC-3' },
  { id: 5, name: 'MC-4' },
  { id: 6, name: 'MC-5' },
  { id: 7, name: 'MC-6' },
  { id: 8, name: 'MC-7' },
  { id: 9, name: 'MC-8' },
  { id: 10, name: 'MC-9' },
  { id: 11, name: 'MC-10' },
  { id: 12, name: 'MC-11' },
  { id: 13, name: 'MC-12' },
  { id: 14, name: 'MC-13' },
  { id: 15, name: 'MC-14' },
  { id: 16, name: 'MC-15' },
  { id: 17, name: 'MC-16' },
  { id: 18, name: 'MC-17' },
  { id: 19, name: 'MC-18' },
  { id: 20, name: 'MC-19' },
  { id: 21, name: 'MC-20' },
  { id: 22, name: 'MC-21' },
  { id: 23, name: 'MC-22' },
  { id: 24, name: 'MC-23' },
  { id: 25, name: 'MC-24' },
  { id: 26, name: 'MC-25' },
  { id: 27, name: 'MC-26' },
]

/**
 * Mencari data machine berdasarkan id.
 * Mengembalikan null bila tidak ketemu / id kosong.
 */
export const findMachineById = (id) => {
  if (id === null || id === undefined || id === '') return null

  return MACHINES.find((machine) => machine.id === Number(id)) || null
}

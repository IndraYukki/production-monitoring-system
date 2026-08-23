import { findMachineById } from '../constants/machines'

/**
 * ============================================================
 *  PREVIEW ONLY — CERMIN DARI BACKEND
 * ============================================================
 *
 * File ini adalah salinan UI dari:
 *   com.productionmonitoring.util.ProductionCalculator.hitungTarget()
 *
 * Tujuannya HANYA untuk badge "Tercapai / Tidak Target" saat
 * operator sedang mengisi form, supaya dia tahu perlu menulis
 * alasan atau tidak.
 *
 * Angka yang tersimpan & dipakai laporan tetap milik backend.
 *
 * >> KALAU FORMULA DI ProductionCalculator.java BERUBAH,
 * >> FILE INI WAJIB IKUT DIUBAH.
 */

/**
 * Menentukan apakah sebuah machine termasuk WIP.
 *
 * Backend memakai: machine.getName().equalsIgnoreCase("WIP")
 * Jadi patokannya adalah NAMA mesin, bukan id.
 *
 * Sebelumnya frontend memakai `Number(machineId) === 1` (id hardcode).
 * Selain berbeda konsep dengan backend, nilai yang dikirim ternyata
 * berupa objek machine sehingga Number(objek) selalu NaN dan
 * mesin WIP tidak pernah terdeteksi.
 *
 * Menerima objek machine { id, name } maupun id mentah.
 */
export const isWipMachine = (machine) => {
  if (!machine) return false

  const name =
    typeof machine === 'object'
      ? machine.name
      : findMachineById(machine)?.name

  return String(name ?? '').trim().toUpperCase() === 'WIP'
}

/**
 * Menghitung target produksi untuk kebutuhan preview.
 *
 * Machine WIP    : ceil( 3600 / takeTime  * (uptimeMenit / 60) )
 * Machine normal : ceil( 3600 / cycleTime * cavity * (uptimeMenit / 60) )
 *
 * Mengembalikan 0 bila data belum lengkap, sama seperti backend.
 */
export const calculateTarget = (product, machine, inputJam, inputMenit) => {
  if (!product || !machine) return 0

  const uptimeMinutes =
    (Number(inputJam) || 0) * 60 + (Number(inputMenit) || 0)

  if (uptimeMinutes <= 0) return 0

  const uptimeHours = uptimeMinutes / 60.0

  if (isWipMachine(machine)) {
    const takeTime = Number(product.takeTime) || 0
    if (takeTime === 0) return 0

    return Math.ceil((3600 / takeTime) * uptimeHours)
  }

  const cycleTime = Number(product.cycleTime) || 0
  if (cycleTime === 0) return 0

  const cavity = Number(product.cavity) || 0

  return Math.ceil((3600 / cycleTime) * cavity * uptimeHours)
}

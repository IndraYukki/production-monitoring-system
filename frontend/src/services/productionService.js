import api from './api'

export const getProductionLogs = async ({
  keyword = '',
  customerId = '',
  machineId = '',
  shift = '',
  tanggalMulai = '',
  tanggalSelesai = '',
  halaman = 0,
  jumlah = 10,
  sortBy = 'createdAt',
  sortDir = 'desc',
} = {}) => {
  const response = await api.get('/production', {
    params: {
      keyword: keyword || undefined,
      customerId: customerId || undefined,
      machineId: machineId || undefined,
      shift: shift || undefined,
      tanggalMulai: tanggalMulai || undefined,
      tanggalSelesai: tanggalSelesai || undefined,
      halaman,
      jumlah,
      sortBy,
      sortDir,
    },
  })
  return response.data
}

// Tambahkan fungsi ini di productionService.js
export const createProduction = async (payload) => {
  const response = await api.post('/production', payload)
  return response.data
}

// GET satu laporan produksi lengkap (ProductionResponseDTO) — dipakai
// modal detail di halaman summary yang list-nya memakai DTO ramping.
export const getProductionById = async (id) => {
  const response = await api.get(`/production/${id}`)
  return response.data
}




// ==============================
// Export Production Excel
// ==============================
export const exportProductionExcel = async ({
  keyword = '',
  customerId = '',
  machineId = '',
  operatorId = '',
  shift = '',
  tanggalMulai = '',
  tanggalSelesai = '',
} = {}) => {
  const response = await api.get('/production/export', {
    params: {
      keyword: keyword || undefined,
      customerId: customerId || undefined,
      machineId: machineId || undefined,
      operatorId: operatorId || undefined,
      shift: shift || undefined,
      tanggalMulai: tanggalMulai || undefined,
      tanggalSelesai: tanggalSelesai || undefined,
    },
    responseType: 'blob',
  })

  return response
}

export const deleteProduction = async (id) => {
  const response = await api.delete(`/production/${id}`)
  return response.data
}


// PUT update data produksi berdasarkan ID
export const updateProduction = async (id, payload) => {
  const response = await api.put(`/production/${id}`, payload)
  return response.data
}
import api from './api'

export const getProductionLogs = async ({
  keyword = '',
  customerId = '',
  machineId = '',
  shift = '',
  tanggalMulai = '',
  tanggalSelesai = '',
  halaman = 0,
  jumlah = 0,
}= {}) => {
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
    },
  })
  return response.data
}




// ==============================
// Export Production Excel
// ==============================
export const exportProductionExcel = async ({
  keyword = '',
  customerId = '',
  machineId = '',
  shift = '',
  tanggalMulai = '',
  tanggalSelesai = '',
} = {}) => {
  const response = await api.get('/production/export', {
    params: {
      keyword: keyword || undefined,
      customerId: customerId || undefined,
      machineId: machineId || undefined,
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
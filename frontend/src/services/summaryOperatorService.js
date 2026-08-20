import api from './api'

/**
 * Card Summary Operator (Page 1 Top Cards)
 * GET /api/monitoring/operator-summary/cards
 */
export const getSummaryCards = async ({
  tanggalMulai,
  tanggalSelesai,
  groub = '',
}) => {
  const params = { tanggalMulai, tanggalSelesai }
  if (groub && groub !== 'All Active') {
    params.groub = groub
  }

  const response = await api.get('/monitoring/operator-summary/cards', { params })
  return response.data
}

/**
 * Table List Operator Summary (Page 1 Table)
 * GET /api/monitoring/operator-summary
 */
export const getOperatorSummaryList = async ({
  tanggalMulai,
  tanggalSelesai,
  groub = '',
  keyword = '',
  halaman = 0,
  jumlah = 10,
  sortBy = 'operatorName',
  sortDir = 'asc',
}) => {
  const params = {
    tanggalMulai,
    tanggalSelesai,
    halaman,
    jumlah,
    sortBy,
    sortDir,
  }

  if (groub && groub !== 'All Active') {
    params.groub = groub
  }
  if (keyword && keyword.trim() !== '') {
    params.keyword = keyword.trim()
  }

  const response = await api.get('/monitoring/operator-summary', { params })
  return response.data
}

/**
 * Card Summary Detail Operator (Page 2 Top Cards)
 * GET /api/monitoring/operator-summary/{operatorId}/cards
 */
export const getOperatorDetailCards = async (
  operatorId,
  { tanggalMulai, tanggalSelesai }
) => {
  const response = await api.get(
    `/monitoring/operator-summary/${operatorId}/cards`,
    {
      params: { tanggalMulai, tanggalSelesai },
    }
  )
  return response.data
}

/**
 * Table Detail Logs Operator (Page 2 Table)
 * GET /api/monitoring/operator-summary/{operatorId}
 */
export const getOperatorDetailLogs = async (
  operatorId,
  { 
    tanggalMulai, 
    tanggalSelesai, 
    halaman = 0, 
    jumlah = 10,
    sortBy = 'productionLot',
    sortDir = 'desc',
  }
) => {
  const response = await api.get(
    `/monitoring/operator-summary/${operatorId}`,
    {
      params: { 
        tanggalMulai, 
        tanggalSelesai, 
        halaman, 
        jumlah,
        sortBy,
        sortDir,
      },
    }
  )
  return response.data
}
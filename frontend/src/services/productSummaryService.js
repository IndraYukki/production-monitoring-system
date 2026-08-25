import api from './api' // Menggunakan axios instance existing

const BASE_URL = '/monitoring/product-summary'

// ─────────────────────────────────────────────────────────────────
// HALAMAN UTAMA (LIST ALL PRODUCTS)
// ─────────────────────────────────────────────────────────────────

// API 1: Get Summary Cards Utama
export const getProductSummaryCards = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/cards`, {
    params: {
      tanggalMulai: params.tanggalMulai,
      tanggalSelesai: params.tanggalSelesai,
      machineId: params.machineId || undefined,
      customerId: params.customerId || undefined,
    },
  })
  return response.data
}

// API 2: Get NG Defect Chart Utama
export const getProductSummaryChart = async (params = {}) => {
  const response = await api.get(`${BASE_URL}/chart-ng`, {
    params: {
      tanggalMulai: params.tanggalMulai,
      tanggalSelesai: params.tanggalSelesai,
      machineId: params.machineId || undefined,
      customerId: params.customerId || undefined,
    },
  })
  return response.data
}

// API 3: Get Product Summary Table (Paginated & Sortable)
export const getProductSummaryList = async (params = {}) => {
  const response = await api.get(`${BASE_URL}`, {
    params: {
      tanggalMulai: params.tanggalMulai,
      tanggalSelesai: params.tanggalSelesai,
      machineId: params.machineId || undefined,
      customerId: params.customerId || undefined,
      keyword: params.keyword || undefined,
      halaman: params.halaman ?? 0,
      jumlah: params.jumlah ?? 10,
      sortBy: params.sortBy || 'totalOutput',
      sortDir: params.sortDir || 'desc',
    },
  })
  return response.data
}

// ─────────────────────────────────────────────────────────────────
// HALAMAN DETAIL PER PRODUK
// ─────────────────────────────────────────────────────────────────

// API 4: Get Detail Cards per Produk
export const getProductDetailCards = async (productId, params = {}) => {
  const response = await api.get(`${BASE_URL}/${productId}/detail-product/cards`, {
    params: {
      tanggalMulai: params.tanggalMulai,
      tanggalSelesai: params.tanggalSelesai,
      machineId: params.machineId || undefined,
    },
  })
  return response.data
}

// API 5: Get Detail NG Defect Chart per Produk
export const getProductDetailChart = async (productId, params = {}) => {
  const response = await api.get(`${BASE_URL}/${productId}/detail-product/chart`, {
    params: {
      tanggalMulai: params.tanggalMulai,
      tanggalSelesai: params.tanggalSelesai,
      machineId: params.machineId || undefined,
    },
  })
  return response.data
}

// API 6: Get Product Detail Logs Table (Paginated & Sortable)
export const getProductDetailLogs = async (productId, params = {}) => {
  const response = await api.get(`${BASE_URL}/${productId}/detail-product`, {
    params: {
      tanggalMulai: params.tanggalMulai,
      tanggalSelesai: params.tanggalSelesai,
      machineId: params.machineId || undefined,
      halaman: params.halaman ?? 0,
      jumlah: params.jumlah ?? 10,
      sortBy: params.sortBy || 'productionLot',
      sortDir: params.sortDir || 'desc',
    },
  })
  return response.data
}
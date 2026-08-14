import { useEffect, useState } from 'react'
import { getProducts } from '../../services/productService'
import { getCustomers } from '../../services/customerService'
import ProductTable from '../../components/product/ProductTable'
import AddProductModal from '../../components/product/AddProductModal'
import {
  addProduct,
  updateProduct,
} from '../../services/productService'


function ProductManagement() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [keyword, setKeyword] = useState('')
  const [customerId, setCustomerId] = useState('')
  const [status, setStatus] = useState('')
  const [customers, setCustomers] = useState([])

  const [pageSize, setPageSize] = useState(10)

  const [totalPages, setTotalPages] = useState(0)

  const [page, setPage] = useState(0)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)

      const data = await getProducts({
        halaman: page,
        jumlah: pageSize,
        keyword,
        customerId,
        status,
      })
      setProducts(data.content)
      setTotalPages(data.totalPages)



    } catch (error) {
      console.error('Gagal mengambil products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }
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

      useEffect(() => {
        setPage(0)
      }, [keyword, customerId, status,])

      useEffect(() => {
        fetchProducts()
      }, [pageSize, keyword, customerId, status, page])




  return (
    <main className="min-h-screen bg-background p-4 pt-20 lg:p-8 lg:pt-8">

      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Products
          </h1>

          <p className="mt-1 text-sm text-muted">
            Manage production product data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          + Add Product
        </button>

      </div>



      {/* Product Table */}

      <ProductTable
        data={products}
        loading={loading}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(0)
        }}
        page={page}
        onPageChange={setPage}


        keyword={keyword}
        onKeywordChange={setKeyword}

        customerId={customerId}
        onCustomerChange={setCustomerId}
        customers={customers}

        status={status}
        onStatusChange={setStatus}

        onEdit={(product) => setEditingProduct(product)}
      />


      {/* Add Product Modal */}

        <AddProductModal
          isOpen={isAddModalOpen || editingProduct !== null}
          product={editingProduct}
          onClose={() => {
            setIsAddModalOpen(false)
            setEditingProduct(null)
          }}
          onSuccess={() => {
            setIsAddModalOpen(false)
            setEditingProduct(null)
            fetchProducts()
          }}
        />

    </main>
  )
}

export default ProductManagement
import { useEffect, useState } from 'react'
import { getOperators, deleteOperator } from '../../services/operatorService'
import OperatorTable from '../../components/operator/OperatorTable'
import OperatorModal from '../../components/operator/OperatorModal'
function OperatorManagement() {

  const [operators, setOperators] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [totalPages, setTotalPages] = useState(0)

  const [keyword, setKeyword] = useState('')
  const [groub, setGroub] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOperator, setEditingOperator] = useState(null)

  const fetchOperators = async () => {
    try {
      setLoading(true)
        const data = await getOperators({
        halaman: page,
        jumlah: pageSize,
        keyword,
        groub,
        })
      setOperators(data.content)
      setTotalPages(data.totalPages)
    } catch (error) {
      console.error('Gagal mengambil operators:', error)
      setOperators([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (operator) => {
    if (!confirm(`Hapus operator ${operator.name}?`)) return
    try {
      await deleteOperator(operator.id)
      fetchOperators()
    } catch (error) {
      if (error.response?.status === 409) {
        alert(`Operator ${operator.name} tidak bisa dihapus karena sudah dipakai di laporan produksi!, Ingin menghapus?? Call Stack....`)
      } else {
        console.error('Gagal menghapus operator:', error)
      }
    }
  }



  useEffect(() => {
    setPage(0)
    }, [keyword, groub])

  useEffect(() => {
    fetchOperators()
  }, [page, pageSize, keyword, groub])

  return (
    <main className="min-h-screen bg-background p-4 pt-20 lg:p-8 lg:pt-8">

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>

        <h1 className="text-2xl font-bold text-foreground">Operators</h1>
        <p className="mt-1 text-sm text-muted">Manage operator data.</p>
        </div>
      



        <button
          type="button"
          onClick={() => {
            setEditingOperator(null)
            setIsModalOpen(true)
          }}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          + Add Operator
        </button>

      </div>


      <OperatorTable
        data={operators}
        loading={loading}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(0)
        }}
          keyword={keyword}
            onKeywordChange={setKeyword}
            groub={groub}
            onGroubChange={setGroub}
           
          onEdit={(operator) => {
            setEditingOperator(operator)
            setIsModalOpen(true)
          }}
          
          onDelete={handleDelete}

          
      />

      <OperatorModal
        isOpen={isModalOpen}
        operator={editingOperator}
        onClose={() => {
          setIsModalOpen(false)
          setEditingOperator(null)
        }}
        onSuccess={() => {
          setIsModalOpen(false)
          setEditingOperator(null)
          fetchOperators()
        }}
      />

    </main>
  )
}

export default OperatorManagement
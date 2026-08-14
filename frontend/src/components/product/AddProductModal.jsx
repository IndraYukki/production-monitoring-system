import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

import { getCustomers } from '../../services/customerService'
import {
  addProduct,
  updateProduct,
} from '../../services/productService'


const initialForm = {
  partNo: '',
  partName: '',
  color: '',
  cycleTime: '',
  cavity: '',
  takeTime: '',
  customerId: '',
  status: 'ACTIVE',
}


function AddProductModal({
  isOpen,
  onClose,
  onSuccess,
  product,
}) {

  const [form, setForm] = useState(initialForm)

  const [customers, setCustomers] = useState([])

  const [loadingCustomers, setLoadingCustomers] = useState(false)

  const [saving, setSaving] = useState(false)


  const isEditMode = Boolean(product)


  // Ambil customer ketika modal dibuka
  useEffect(() => {

    if (!isOpen) return

    const fetchCustomers = async () => {

      try {

        setLoadingCustomers(true)

        const data = await getCustomers()

        setCustomers(data)

      } catch (error) {

        console.error('Gagal mengambil customer:', error)

        setCustomers([])

      } finally {

        setLoadingCustomers(false)

      }

    }

    fetchCustomers()

  }, [isOpen])


  // Isi form ketika mode EDIT
  useEffect(() => {

    if (!isOpen) return

    if (product) {

      setForm({
        partNo: product.partNo ?? '',
        partName: product.partName ?? '',
        color: product.color ?? '',
        cycleTime: product.cycleTime ?? '',
        cavity: product.cavity ?? '',
        takeTime: product.takeTime ?? '',
        customerId: product.customerId ?? '',
        status: product.status ?? 'ACTIVE',
      })

    } else {

      setForm(initialForm)

    }

  }, [product, isOpen])


  const handleChange = (e) => {

    const { name, value } = e.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

  }


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setSaving(true)

      const payload = {
        partNo: form.partNo,
        partName: form.partName,
        color: form.color,

        cycleTime: Number(form.cycleTime),
        cavity: Number(form.cavity),

        takeTime: form.takeTime
          ? Number(form.takeTime)
          : 0,

        customerId: Number(form.customerId),

        status: form.status,
      }

      if (product) {
        await updateProduct(product.id, payload)

        alert('Product berhasil diperbarui')
      } else {
        await addProduct(payload)

        alert('Product berhasil ditambahkan')
      }

      setForm(initialForm)
      onSuccess()

    } catch (error) {
      console.error('Gagal menyimpan product:', error)

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Gagal menyimpan product'

      alert(errorMessage)

    } finally {
      setSaving(false)
    }
  }


  const handleClose = () => {

    if (saving) return

    setForm(initialForm)

    onClose()

  }


  if (!isOpen) return null


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

      {/* Overlay */}

      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 bg-black/50"
        aria-label="Close modal"
      />


      {/* Modal */}

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b border-border px-5 py-4">

          <div>

            <h2 className="text-lg font-bold text-foreground">
              {isEditMode
                ? 'Edit Product'
                : 'Add Product'}
            </h2>

            <p className="text-xs text-muted">
              {isEditMode
                ? 'Perbarui data product'
                : 'Tambahkan product baru'}
            </p>

          </div>


          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-lg p-2 text-muted transition hover:bg-card-secondary hover:text-foreground disabled:opacity-40"
          >
            <X size={20} />
          </button>

        </div>


        {/* Form */}

        <form onSubmit={handleSubmit}>

          <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5">

            {/* Part No */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Part Number
              </label>

              <input
                type="text"
                name="partNo"
                value={form.partNo}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-info"
              />

            </div>


            {/* Part Name */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Part Name
              </label>

              <input
                type="text"
                name="partName"
                value={form.partName}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-info"
              />

            </div>


            {/* Color */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Color
              </label>

              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-info"
              />

            </div>


            {/* Cycle Time / Cavity */}

            <div className="grid grid-cols-2 gap-3">

              <div>

                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Cycle Time
                </label>

                <input
                  type="number"
                  name="cycleTime"
                  value={form.cycleTime}
                  onChange={handleChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  min="0"
                  step="any"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-info"
                />

              </div>


              <div>

                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Cavity
                </label>

                <input
                  type="number"
                  name="cavity"
                  value={form.cavity}
                  onChange={handleChange}
                  onWheel={(e) => e.currentTarget.blur()}
                  min="0"
                  step="1"
                  required
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-info"
                />

              </div>

            </div>


            {/* Take Time */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Take Time
              </label>

              <input
                type="number"
                name="takeTime"
                value={form.takeTime}
                onChange={handleChange}
                onWheel={(e) => e.currentTarget.blur()}
                min="0"
                step="any"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-info"
              />

            </div>


            {/* Customer */}

            <div>

              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Customer
              </label>

              <select
                name="customerId"
                value={form.customerId}
                onChange={handleChange}
                required
                disabled={loadingCustomers}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-info disabled:opacity-50"
              >

                <option value="">
                  {loadingCustomers
                    ? 'Loading customer...'
                    : 'Pilih customer'}
                </option>


                {customers.map((customer) => (

                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.customer}
                  </option>

                ))}

              </select>

            </div>


            {/* Status - hanya EDIT */}

            {isEditMode && (

              <div>

                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-info"
                >

                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="INACTIVE">
                    Inactive
                  </option>

                </select>

              </div>

            )}

          </div>


          {/* Footer */}

          <div className="flex justify-end gap-3 border-t border-border px-5 py-4">

            <button
              type="button"
              onClick={handleClose}
              disabled={saving}
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-card-secondary disabled:opacity-40"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? 'Saving...'
                : product
                  ? 'Update Product'
                  : 'Save Product'}
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


export default AddProductModal
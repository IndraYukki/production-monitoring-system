import { useEffect, useState } from 'react'
import {
  addOperator,
  updateOperator,
} from '../../services/operatorService'

function OperatorModal({
  isOpen,
  operator,
  onClose,
  onSuccess,
}) {
  const initialForm = {
    name: '',
    nik: '',
    groub: '',
  }

  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (operator) {
        setForm({
            name: operator.name || '',
            nik: operator.nik || '',
            groub: operator.groub || '',
        })
        } else {
        setForm(initialForm)
        }
    }, [operator, isOpen])

    const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
        ...prev,
        [name]: value,
    }))
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setSaving(true)

            if (operator) {
            await updateOperator(operator.id, form)
            alert('Operator berhasil diperbarui')
            } else {
            await addOperator(form)
            alert('Operator berhasil ditambahkan')
            }

            setForm(initialForm)
            onSuccess()

        } catch (error) {
            console.error('Gagal menyimpan operator:', error)

            const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Gagal menyimpan operator'

            alert(errorMessage)

        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

                <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-border px-6 py-4">
                    <div>
                    <h2 className="text-lg font-semibold text-foreground">
                        {operator ? 'Edit Operator' : 'Add Operator'}
                    </h2>

                    <p className="mt-1 text-sm text-muted">
                        {operator
                        ? 'Update operator data.'
                        : 'Add a new operator.'}
                    </p>
                    </div>

                    <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg px-3 py-2 text-muted transition hover:bg-card-secondary hover:text-foreground"
                    >
                    ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    <div className="space-y-4 p-6">

                    {/* Name */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Name
                        </label>

                        <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-info"
                        />
                    </div>

                    {/* NIK */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                        NIK
                        </label>

                        <input
                        type="text"
                        name="nik"
                        value={form.nik}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-info"
                        />
                    </div>

                    {/* Group */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Group
                        </label>

                        <select
                        name="groub"
                        value={form.groub}
                        onChange={handleChange}
                        required
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-info"
                        >
                        <option value="" disabled>-- Pilih Group --</option>
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="RESIGN">RESIGN</option>
                        </select>
                    </div>

                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 border-t border-border px-6 py-4">

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-xl border border-border bg-card-secondary px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-background disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-info px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                        ? 'Saving...'
                        : operator
                            ? 'Update Operator'
                            : 'Add Operator'}
                    </button>

                    </div>

                </form>

                </div>

            </div>
            )}
        </>
)

    

}
export default OperatorModal
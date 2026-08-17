import { useEffect, useState, useRef} from 'react'
import { searchProducts } from '../../services/productService'

function PartNoAutocomplete({ value, onChange, onSelect }) {
  const [search, setSearch] = useState(value || '')
    useEffect(() => {
    setSearch(value || '')
  }, [value])
  const [products, setProducts] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)

  useEffect(() => {
      if (isSelecting) {
        setIsSelecting(false)
        return
      }

      if (!search.trim()) {
        setProducts([])
        setIsOpen(false)
        return
      }

      const fetchProducts = async () => {
        try {
          setIsLoading(true)

          const data = await searchProducts(search)

          setProducts(data)
          setIsOpen(true)
        } catch (error) {
          console.error('Gagal mencari product:', error)
          setProducts([])
        } finally {
          setIsLoading(false)
        }
      }

      fetchProducts()
    }, [search])

    const containerRef = useRef(null)

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

  const handleChange = (event) => {
    const value = event.target.value

    setSearch(value)
    onChange(value)
  }

  const handleSelect = (product) => {
    setIsSelecting(true)

    setSearch(product.partNo)
    setIsOpen(false)

    onSelect(product)
  }

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor="part-no"
        className="mb-2 block text-sm font-medium"
      >
        Part No
        <span className="ml-1 text-danger">*</span>
      </label>

      <input
        id="part-no"
        type="text"
        value={search}
        onChange={handleChange}
        placeholder="Search Part No or Part Name..."
        autoComplete="off"
        className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-info"
      />

      {isOpen && isLoading && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-card-secondary p-4 text-sm text-muted shadow-xl">
          Searching...
        </div>
      )}

      {isOpen && !isLoading && products.length > 0 && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border border-border bg-card-secondary shadow-xl">
          {products.slice(0, 5).map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => handleSelect(product)}
              className="w-full border-b border-border p-4 text-left transition last:border-b-0 hover:bg-card"
            >
              <div className="font-medium text-foreground">
                {product.partNo}
              </div>

              <div className="mt-1 text-sm text-muted">
                {product.partName}
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && !isLoading && search && products.length === 0 && (
        <div className="absolute z-20 mt-2 w-full rounded-xl border border-border bg-card-secondary p-4 text-sm text-inactive shadow-xl">
          Product not found
        </div>
      )}
    </div>
  )
}

export default PartNoAutocomplete
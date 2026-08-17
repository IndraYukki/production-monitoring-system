import { useEffect, useRef, useState } from 'react'
import { searchOperators } from '../../services/operatorService'

function OperatorAutoComplete({ value, onChange, onSelect }) {
  const [search, setSearch] = useState(value || '')
  
  useEffect(() => {
    setSearch(value || '')
  }, [value])

  const [operators, setOperators] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [isSelected, setIsSelected] = useState(false)


  const containerRef = useRef(null)



  useEffect(() => {
    if (isSelecting) {
      setIsSelecting(false)
      return
    }

    if (!search.trim()) {
      setOperators([])
      setIsOpen(false)
      setIsSelected(false)
      return
    }



    const timer = setTimeout(async () => {
      try {
        setIsLoading(true)
        const data = await searchOperators(search)
        const dataActive = data.filter(op => op.groub !== 'RESIGN')
        setOperators(dataActive)
        setIsOpen(true)
      } catch (error) {
        console.error('ERROR SEARCH OPERATOR:', error)
        setOperators([])
      } finally {
        setIsLoading(false)
      }
    })

    return () => clearTimeout(timer)
  }, [search])

  // Tutup dropdown ketika klik di luar component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleChange = (e) => {
    const val = e.target.value
    setSearch(val)
    onChange(val)
  }

  const handleSelect = (operator) => {
    setIsSelecting(true)
    setSearch(operator.name)
    setIsOpen(false)
    onSelect(operator)
    setIsSelected(true)
  }



  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={search}
        onChange={handleChange}
        onFocus={() => {
          if (operators.length > 0) {
            setIsOpen(true)
          }
        }}
        placeholder="Search operator..."
        autoComplete="off"
        className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition placeholder:text-muted ${
          isSelected
            ? 'border-accent bg-accent/10 text-success'
            : 'border-border bg-card-secondary text-foreground'
        }`}
      />

      {isOpen &&  (
        <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
          {isLoading && (
            <div className="px-4 py-3 text-sm text-muted">
              Searching...
            </div>
          )}

          {!isLoading && operators.length === 0 && (
            <div className="px-4 py-3 text-sm text-muted">
              Operator tidak ditemukan
            </div>
          )}

          {!isLoading &&
            operators.slice(0, 5).map((operator) => (
              <button
                key={operator.id}
                type="button"
                onClick={() => handleSelect(operator)}
                className="block w-full px-4 py-3 text-left transition hover:bg-card-secondary"
              >
                <p className="text-sm font-medium text-foreground">
                  {operator.name}
                </p>

                <p className="mt-1 text-xs text-muted">
                  Group: {operator.groub || '-'}
                </p>
              </button>
            ))}
        </div>
      )}
    </div>
  )
}

export default OperatorAutoComplete
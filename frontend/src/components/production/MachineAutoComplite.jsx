import { useEffect, useRef, useState } from 'react'
import { MACHINES, findMachineById } from '../../constants/machines'

function MachineAutocomplete({ value, onChange }) {
  const [keyword, setKeyword] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const containerRef = useRef(null)

  const filteredMachines = MACHINES
    .filter((machine) =>
      machine.name.toLowerCase().includes(keyword.toLowerCase())
    )
    .slice()

  useEffect(() => {
    if (!value) {
      setKeyword('')
      return
    }

    const selectedMachine = findMachineById(value)

    if (selectedMachine) {
      setKeyword(selectedMachine.name)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleChange = (event) => {
    const newKeyword = event.target.value

    setKeyword(newKeyword)
    setIsOpen(true)

    // User sedang mencari ulang,
    // berarti pilihan sebelumnya tidak lagi valid.
    onChange(null)
  }

    const handleSelect = (machine) => {
      setKeyword(machine.name)
      onChange(machine.id) 
      setIsOpen(false)
    }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={keyword}
        onChange={handleChange}
        onFocus={() => setIsOpen(true)}
        placeholder="Search machine..."
        autoComplete="off"
        className="w-full rounded-xl border border-border bg-card-secondary px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-accent"
      />

      {isOpen && filteredMachines.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-xl border border-border bg-card-secondary shadow-xl">
          {filteredMachines.map((machine) => (
            <button
              key={machine.id}
              type="button"
              onClick={() => handleSelect(machine)}
              className="block w-full border-b border-border px-4 py-3 text-left transition last:border-b-0 hover:bg-card"
            >
              <span className="text-sm font-medium text-foreground">
                {machine.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default MachineAutocomplete
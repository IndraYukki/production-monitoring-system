import { useEffect, useRef, useState } from 'react'

const MACHINES = [
  { id: 1, name: 'WIP' },
  { id: 2, name: 'MC-1' },
  { id: 3, name: 'MC-2' },
  { id: 4, name: 'MC-3' },
  { id: 5, name: 'MC-4' },
  { id: 6, name: 'MC-5' },
  { id: 7, name: 'MC-6' },
  { id: 8, name: 'MC-7' },
  { id: 9, name: 'MC-8' },
  { id: 10, name: 'MC-9' },
  { id: 11, name: 'MC-10' },
  { id: 12, name: 'MC-11' },
  { id: 13, name: 'MC-12' },
  { id: 14, name: 'MC-13' },
  { id: 15, name: 'MC-14' },
  { id: 16, name: 'MC-15' },
  { id: 17, name: 'MC-16' },
  { id: 18, name: 'MC-17' },
  { id: 19, name: 'MC-18' },
  { id: 20, name: 'MC-19' },
  { id: 21, name: 'MC-20' },
  { id: 22, name: 'MC-21' },
  { id: 23, name: 'MC-22' },
  { id: 24, name: 'MC-23' },
  { id: 25, name: 'MC-24' },
  { id: 26, name: 'MC-25' },
  { id: 27, name: 'MC-26' },
]

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

    const selectedMachine = MACHINES.find(
      (machine) => machine.id === value
    )

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
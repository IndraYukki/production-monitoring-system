import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Menu,
  X,
  LayoutDashboard,
  ClipboardList,
  FileInput,
  ChartColumnDecreasing
} from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import logoHTP from '../../gambar/logo/logo_HTP.png'



function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeSidebar = () => {
    setIsOpen(false)
  }

  return (
    <>

      {/* ========================= */}
      {/* Mobile Header */}
      {/* ========================= */}

      <header className="fixed top-0 right-0 z-40 flex h-16 items-center border-b border-border bg-info px-4 lg:hidden rounded-2xl m-4 opacity-50">


        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-1 text-foreground transition hover:bg-card-secondary"
          aria-label="Open navigation"
        >
          <Menu size={24} />
        </button>

      </header>


      {/* ========================= */}
      {/* Mobile Overlay */}
      {/* ========================= */}

      {isOpen && (
        <button
          type="button"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-label="Close navigation"
        />
      )}


      {/* ========================= */}
      {/* Sidebar */}
      {/* ========================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex h-screen w-64 flex-col
          overflow-hidden
          border-r border-border
          bg-card-secondary

          transition-transform duration-300

          lg:translate-x-0

          ${isOpen
            ? 'translate-x-0'
            : '-translate-x-full'
          }
        `}
      >

        {/* Sidebar Header */}

        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">

          {/* logo */}
          <div className="">
            <h1 className="text-2xl font-bold text-foreground flex justify-center md:w-full"><img className="w-32 h-20" src={logoHTP} alt="logoHtp" /></h1>
          </div>


          <button
            type="button"
            onClick={closeSidebar}
            className="rounded-lg p-2 text-muted transition hover:bg-card-secondary hover:text-foreground lg:hidden"
            aria-label="Close navigation"
          >
            <X size={22} />
          </button>

        </div>


        {/* Navigation */}

        <nav className="flex-1 overflow-y-auto p-4">

          <NavLink
            to="/"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `
                flex items-center gap-3 rounded-xl px-4 py-3
                text-sm font-medium transition
                ${
                  isActive
                    ? 'bg-info/10 text-info'
                    : 'text-muted hover:bg-card-secondary hover:text-foreground'
                }
              `
            }
          >

            <FileInput size={20} />

            <span>
              Dashoboard
            </span>

          </NavLink>

          <NavLink
            to="/operator-summary"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `
                flex items-center gap-3 rounded-xl px-4 py-3
                text-sm font-medium transition
                ${
                  isActive
                    ? 'bg-info/10 text-info'
                    : 'text-muted hover:bg-card-secondary hover:text-foreground'
                }
              `
            }
          >

            <FileInput size={20} />

            <span>
              Summary Operator
            </span>

          </NavLink>

          <NavLink
            to="/add-production"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `
                flex items-center gap-3 rounded-xl px-4 py-3
                text-sm font-medium transition
                ${
                  isActive
                    ? 'bg-info/10 text-info'
                    : 'text-muted hover:bg-card-secondary hover:text-foreground'
                }
              `
            }
          >

            <FileInput size={20} />

            <span>
              Production Input
            </span>

          </NavLink>


          <NavLink
            to="/production-logs"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `
                flex items-center gap-3 rounded-xl px-4 py-3
                text-sm font-medium transition
                ${
                  isActive
                    ? 'bg-info/10 text-info'
                    : 'text-muted hover:bg-card-secondary hover:text-foreground'
                }
              `
            }
          >

            <ChartColumnDecreasing size={20} />

            <span>
              Production Logs
            </span>

          </NavLink>



          <NavLink
            to="/product"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `
                flex items-center gap-3 rounded-xl px-4 py-3
                text-sm font-medium transition
                ${
                  isActive
                    ? 'bg-info/10 text-info'
                    : 'text-muted hover:bg-card-secondary hover:text-foreground'
                }
              `
            }
          >

            <ClipboardList size={20} />

            <span>
              Detail Product
            </span>

          </NavLink>


          <NavLink
            to="/Operator"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `
                flex items-center gap-3 rounded-xl px-4 py-3
                text-sm font-medium transition
                ${
                  isActive
                    ? 'bg-info/10 text-info'
                    : 'text-muted hover:bg-card-secondary hover:text-foreground'
                }
              `
            }
          >

            <ClipboardList size={20} />

            <span>
              Data Operator
            </span>

          </NavLink>

        </nav>


        {/* Sidebar Footer */}

        <div className="shrink-0 border-t border-border p-4">

          <ThemeToggle />

        </div>

      </aside>

    </>
  )
}

export default Sidebar
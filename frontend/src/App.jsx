import Sidebar from './components/common/Sidebar'
import NotFoundPage from './pages/NotFoundPage'
import AddProduction from './pages/productionAdd/AddProduction'
import ProductionRawLogs from './pages/ProductionRawLogs/ProductionRawLogs'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="flex min-h-screen bg-background">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="min-w-0 flex-1 lg:ml-64">

        <Routes>

          <Route
            path="/"
            element={<AddProduction />}
          />

          <Route
            path="/production-logs"
            element={<ProductionRawLogs />}
          />

          <Route
            path="*"
            element={<NotFoundPage />}
          />

        </Routes>

      </main>

    </div>
  )
}

export default App
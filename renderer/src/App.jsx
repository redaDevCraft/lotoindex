import React, { useState, useEffect, useCallback } from 'react'
import SearchBar    from './components/SearchBar'
import FilterPanel  from './components/FilterPanel'
import CarTable     from './components/CarTable'
import CarForm      from './components/CarForm'
import CarDetail    from './components/CarDetail'
import ImportModal  from './components/ImportModal'
import './App.css'

export default function App() {
  const [cars,     setCars]     = useState([])
  const [makes,    setMakes]    = useState([])
  const [selected, setSelected] = useState([])
  const [view,     setView]     = useState('list')   // list | form | detail | import
  const [editCar,  setEditCar]  = useState(null)
  const [filters,  setFilters]  = useState({})

  const loadMakes = async () => setMakes(await window.db.getMakes())

  const loadCars = useCallback(async (f = filters) => {
    const result = Object.keys(f).some(k => f[k])
      ? await window.db.searchCars(f)
      : await window.db.getAllCars()
    setCars(result)
  }, [filters])

  useEffect(() => { loadMakes(); loadCars() }, [])

  const handleSearch = (f) => { setFilters(f); loadCars(f) }

  const handleExportPDF = async () => {
    const ids = selected.length ? selected : cars.map(c => c.id)
    await window.db.exportPDF(ids)
  }

  const handleExportExcel = async () => {
    const ids = selected.length ? selected : cars.map(c => c.id)
    await window.db.exportExcel(ids)
  }
  

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo"> LotoIndex</div>
        <nav>
          <button onClick={() => { setView('list'); loadCars() }}>Véhicules</button>
          <button onClick={() => { setEditCar(null); setView('form') }}>➕ Ajouter</button>
          <button onClick={() => setView('import')}> Importer CSV</button>
        </nav>
        <div className="export-section">
          <p>Exporter ({selected.length || cars.length} voitures)</p>
          <button onClick={handleExportPDF}> PDF</button>
          <button onClick={handleExportExcel}> Excel</button>
        </div>
      </aside>

      <main className="main">
        {view === 'list' && (
          <>
            <SearchBar makes={makes} onSearch={handleSearch} />
            <FilterPanel makes={makes} onFilter={handleSearch} />
            <CarTable
              cars={cars}
              selected={selected}
              onSelect={setSelected}
              onEdit={(car) => { setEditCar(car); setView('form') }}
              onView={(car) => { setEditCar(car); setView('detail') }}
              onDelete={async (id) => { await window.db.deleteCar(id); loadCars()
              
               }}
            />
          </>
        )}
        {view === 'form' && (
          <CarForm
            car={editCar}
            makes={makes}
         onSave={async function(data) {
    var id
    if (editCar) {
        await window.db.updateCar(editCar.id, data)
        id = editCar.id
        await loadMakes()
        await loadCars()
        setView('list')   // ← only navigate for edits
    } else {
        id = await window.db.createCar(data)
        await loadMakes()
        await loadCars()
        // Don't navigate — CarForm stays open for image upload
    }
    return id
}}
            onCancel={() => setView('list')}
          />
        )}
        {view === 'detail' && (
          <CarDetail
            carId={editCar?.id}
            onBack={() => setView('list')}
            onEdit={() => setView('form')}
          />
        )}
        {view === 'import' && (
          <ImportModal
            onClose={() => { setView('list'); loadCars() }}
          />
        )}
      </main>
    </div>
  )
}
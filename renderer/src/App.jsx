import React, { useState, useEffect, useCallback } from 'react'
import SearchBar    from './components/SearchBar'
import FilterPanel  from './components/FilterPanel'
import CarTable     from './components/CarTable'
import CarForm      from './components/CarForm'
import CarDetail    from './components/CarDetail'
import './App.css'

export default function App() {
  const [cars,     setCars]     = useState([])
  const [makes,    setMakes]    = useState([])
  const [selected, setSelected] = useState([])
  const [view,     setView]     = useState('list')
  const [editCar,  setEditCar]  = useState(null)


  const [filters, setFilters] = useState({})

  const loadMakes = async () => setMakes(await window.db.getMakes())

  const loadCars = useCallback(async (f) => {
    const active = f !== undefined ? f : filters
    const hasAny = Object.values(active).some(v => v !== null && v !== undefined && v !== '')
    const result = hasAny
      ? await window.db.searchCars(active)
      : await window.db.getAllCars()
    setCars(result)
  }, [filters])

  useEffect(() => { loadMakes(); loadCars({}) }, [])

  // SearchBar fires this — merges its own fields on top of existing filters
  const handleSearchBarChange = (searchFields) => {
    const merged = { ...filters, ...searchFields }
    setFilters(merged)
    loadCars(merged)
  }

  // FilterPanel fires this — merges panel fields on top of existing filters
  const handleFilterPanelChange = (panelFields) => {
    const merged = { ...filters, ...panelFields }
    setFilters(merged)
    loadCars(merged)
  }

  // Hard reset — wipes everything in both bars
  const handleReset = () => {
    setFilters({})
    loadCars({})
  }

  const handleExportPDF = async () => {
    const ids = selected.length ? selected : cars.map(c => c.id)
    await window.db.exportPDF(ids)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">LotoIndex</div>
        <nav>
          <button onClick={() => { setView('list'); loadCars() }}>Véhicules</button>
          <button onClick={() => { setEditCar(null); setView('form') }}> Ajouter</button>
          
        </nav>
        <div className="export-section">
          <p>Exporter ({selected.length || cars.length} voitures)</p>
          <button onClick={handleExportPDF}>PDF</button>
        </div>
      </aside>

      <main className="main">
        {view === 'list' && (
          <>
            <SearchBar
              makes={makes}
              filters={filters}
              onSearch={handleSearchBarChange}
            />
            <FilterPanel
              makes={makes}
              filters={filters}
              onFilter={handleFilterPanelChange}
              onReset={handleReset}
            />
            <CarTable
              cars={cars}
              selected={selected}
              onSelect={setSelected}
              onEdit={(car) => { setEditCar(car); setView('form') }}
              onView={(car) => { setEditCar(car); setView('detail') }}
              onDelete={async (id) => { await window.db.deleteCar(id); loadCars() }}
              onDeleteSelected={async (ids) => { await window.db.deleteCars(ids); setSelected([]); loadCars() }}
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
                setView('list')
              } else {
                id = await window.db.createCar(data)
                await loadMakes()
                await loadCars()
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
        
      </main>
    </div>
  )
}
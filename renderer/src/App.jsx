import React, { useState, useEffect, useCallback } from 'react'
import SearchBar   from './components/SearchBar'
import FilterPanel from './components/FilterPanel'
import CarTable    from './components/CarTable'
import CarForm     from './components/CarForm'
import CarDetail   from './components/CarDetail'
import './App.css'

export default function App() {
    const [cars,     setCars]     = useState([])
    const [makes,    setMakes]    = useState([])
    const [selected, setSelected] = useState([])
    const [view,     setView]     = useState('list')
    const [editCar,  setEditCar]  = useState(null)
    const [filters,  setFilters]  = useState({})
    const [toast,    setToast]    = useState(null)  // { msg, type }
    const [ready,    setReady]    = useState(false)

    // Wait for window.db
    useEffect(function() {
        var attempts = 0
        function tryLoad() {
            if (window.db) { setReady(true) }
            else if (attempts++ < 30) setTimeout(tryLoad, 200)
        }
        tryLoad()
    }, [])

    function showToast(msg, type) {
        setToast({ msg: msg, type: type || 'success' })
        setTimeout(function() { setToast(null) }, 3000)
    }

    const loadMakes = useCallback(async function() {
        if (!window.db) return
        setMakes((await window.db.getMakes()) || [])
    }, [])

    const loadCars = useCallback(async function(f) {
        if (!window.db) return
        var active = f || filters
        var result = Object.keys(active).some(function(k) { return active[k] })
            ? await window.db.searchCars(active)
            : await window.db.getAllCars()
        setCars(result || [])
    }, [filters])

    useEffect(function() {
        if (!ready) return
        loadMakes()
        loadCars()
    }, [ready])

    if (!ready) return (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', color:'#6b7280' }}>
            Chargement…
        </div>
    )

    return (
        <div className="app">
            {/* Toast */}
            {toast && (
                <div className={'toast toast--' + toast.type}>{toast.msg}</div>
            )}

            <aside className="sidebar">
                <div className="logo">LotoIndex</div>
                <nav>
                    <button onClick={function() { setView('list'); loadCars() }}>Véhicules</button>
                    <button onClick={function() { setEditCar(null); setView('form') }}>➕ Ajouter</button>
                </nav>
                <div className="export-section">
                    <p>Exporter ({selected.length || cars.length})</p>
                    <button onClick={async function() {
                        var ids = selected.length ? selected : cars.map(function(c) { return c.id })
                        await window.db.exportPDF(ids)
                    }}>📄 PDF</button>
                </div>
            </aside>

            <main className="main">
                {view === 'list' && (
                    <>
                        <SearchBar makes={makes} onSearch={function(f) { setFilters(f); loadCars(f) }} />
                        <FilterPanel makes={makes} onFilter={function(f) { setFilters(f); loadCars(f) }} />
                        <CarTable
                            cars={cars}
                            selected={selected}
                            onSelect={setSelected}
                            onEdit={function(car) { setEditCar(car); setView('form') }}
                            onView={function(car) { setEditCar(car); setView('detail') }}
                            onDelete={async function(id) {
                                await window.db.deleteCar(id)
                                loadCars()
                                showToast('Véhicule supprimé.')
                            }}
                            onDeleteSelected={async function(ids) {
                                for (var i = 0; i < ids.length; i++) await window.db.deleteCar(ids[i])
                                setSelected([])
                                loadCars()
                                showToast(ids.length + ' véhicule(s) supprimé(s).')
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
                                showToast('Véhicule modifié avec succès.')
                            } else {
                                id = await window.db.createCar(data)
                                showToast('Véhicule créé avec succès.')
                            }
                            await loadMakes()
                            await loadCars()
                            setView('list')   // ← always redirect immediately
                            return id
                        }}
                        onCancel={function() { setView('list') }}
                    />
                )}
                {view === 'detail' && (
                    <CarDetail carId={editCar?.id}
                        onBack={function() { setView('list') }}
                        onEdit={function() { setView('form') }} />
                )}
               
            </main>
        </div>
    )
}
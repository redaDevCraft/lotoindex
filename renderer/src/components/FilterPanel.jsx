import React, { useState, useEffect } from 'react'
import './FilterPanel.css'

export default function FilterPanel({ makes, filters, onFilter, onReset }) {
  const [open,       setOpen]       = useState(false)
  const [makeId,     setMakeId]     = useState('')
  const [modelId,    setModelId]    = useState('')
  const [submodelId, setSubmodelId] = useState('')
  const [yearFrom,   setYearFrom]   = useState('')
  const [yearTo,     setYearTo]     = useState('')
  const [fuel,       setFuel]       = useState('')
  const [gearbox,    setGearbox]    = useState('')
  const [powerMin,   setPowerMin]   = useState('')
  const [powerMax,   setPowerMax]   = useState('')
  const [mileageMax, setMileageMax] = useState('')

  const [models,    setModels]    = useState([])
  const [submodels, setSubmodels] = useState([])

  // When parent hard-resets, clear all panel fields
  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      setMakeId(''); setModelId(''); setSubmodelId('')
      setYearFrom(''); setYearTo(''); setFuel('')
      setGearbox(''); setPowerMin(''); setPowerMax('')
      setMileageMax(''); setModels([]); setSubmodels([])
    }
  }, [filters])

  const activeCount = [
    makeId, modelId, submodelId, yearFrom, yearTo,
    fuel, gearbox, powerMin, powerMax, mileageMax
  ].filter(Boolean).length

  useEffect(() => {
    setModelId(''); setSubmodelId(''); setSubmodels([])
    if (makeId) window.db.getModels(makeId).then(setModels)
    else setModels([])
  }, [makeId])

  useEffect(() => {
    setSubmodelId('')
    if (modelId) window.db.getSubmodels(modelId).then(setSubmodels)
    else setSubmodels([])
  }, [modelId])

  const apply = () => {
    onFilter({
      makeId:     makeId     || null,
      modelId:    modelId    || null,
      submodelId: submodelId || null,
      yearFrom:   yearFrom   || null,
      yearTo:     yearTo     || null,
      fuel:       fuel       || null,
      gearbox:    gearbox    || null,
      powerMin:   powerMin   || null,
      powerMax:   powerMax   || null,
      mileageMax: mileageMax || null,
    })
  }

  const reset = () => {
    setMakeId(''); setModelId(''); setSubmodelId('')
    setYearFrom(''); setYearTo(''); setFuel('')
    setGearbox(''); setPowerMin(''); setPowerMax('')
    setMileageMax(''); setModels([]); setSubmodels([])
    onReset()   // tells App.jsx to wipe filters{} entirely
  }

  return (
    <div className="filter-panel">
      <div className="filter-toggle" onClick={() => setOpen(o => !o)}>
        <span>⚙️ Filtres avancés</span>
        {activeCount > 0 && <span className="filter-badge">{activeCount}</span>}
        <span className="filter-arrow">{open ? '▲' : '▼'}</span>
        {activeCount > 0 && (
          <button className="reset-btn" onClick={e => { e.stopPropagation(); reset() }}>
            ✕ Réinitialiser
          </button>
        )}
      </div>

      {open && (
        <div className="filter-body">
          <div className="filter-row">
            <div className="filter-group">
              <label>Marque</label>
              <select value={makeId} onChange={e => setMakeId(e.target.value)}>
                <option value="">Toutes</option>
                {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Modèle</label>
              <select value={modelId} onChange={e => setModelId(e.target.value)} disabled={!makeId}>
                <option value="">Tous</option>
                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Sous-modèle</label>
              <select value={submodelId} onChange={e => setSubmodelId(e.target.value)} disabled={!modelId}>
                <option value="">Tous</option>
                {submodels.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Année — de</label>
              <input type="number" placeholder="ex: 2015" min="1950" max="2026"
                value={yearFrom} onChange={e => setYearFrom(e.target.value)} />
            </div>
            <div className="filter-group">
              <label>Année — à</label>
              <input type="number" placeholder="ex: 2024" min="1950" max="2026"
                value={yearTo} onChange={e => setYearTo(e.target.value)} />
            </div>
            <div className="filter-group">
              <label>Énergie</label>
              <select value={fuel} onChange={e => setFuel(e.target.value)}>
                <option value="">Tous</option>
                <option>Essence</option>
                <option>Diesel</option>
                <option>Hybride</option>
                <option>Électrique</option>
                <option>GPL</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Boîte de vitesse</label>
              <select value={gearbox} onChange={e => setGearbox(e.target.value)}>
                <option value="">Toutes</option>
                <option>Manuelle</option>
                <option>Automatique</option>
                <option>DSG</option>
                <option>CVT</option>
              </select>
            </div>
          </div>

          <div className="filter-row">
            <div className="filter-group">
              <label>Puissance min (cv)</label>
              <input type="number" placeholder="ex: 90" min="0"
                value={powerMin} onChange={e => setPowerMin(e.target.value)} />
            </div>
            <div className="filter-group">
              <label>Puissance max (cv)</label>
              <input type="number" placeholder="ex: 300" min="0"
                value={powerMax} onChange={e => setPowerMax(e.target.value)} />
            </div>
            <div className="filter-group">
              <label>Kilométrage max (km)</label>
              <input type="number" placeholder="ex: 150000" min="0"
                value={mileageMax} onChange={e => setMileageMax(e.target.value)} />
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn-apply" onClick={apply}>Appliquer les filtres</button>
            <button className="btn-reset" onClick={reset}>✕ Réinitialiser</button>
          </div>
        </div>
      )}
    </div>
  )
}
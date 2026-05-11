import React, { useState, useCallback } from 'react'

export default function SearchBar({ makes, onSearch }) {
  const [text,      setText]      = useState('')
  const [makeId,    setMakeId]    = useState('')
  const [yearFrom,  setYearFrom]  = useState('')
  const [yearTo,    setYearTo]    = useState('')
  const [fuel,      setFuel]      = useState('')

  const submit = useCallback(() => {
    onSearch({ text, makeId: makeId||null, yearFrom: yearFrom||null,
               yearTo: yearTo||null, fuel: fuel||null })
  }, [text, makeId, yearFrom, yearTo, fuel])

  return (
    <div className="search-bar">
      <input
        placeholder="Recherche globale (VIN, marque, modèle...)"
        value={text}
        onChange={e => { setText(e.target.value); onSearch({ text: e.target.value }) }}
      />
      <select value={makeId} onChange={e => setMakeId(e.target.value)}>
        <option value="">Toutes les marques</option>
        {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
      <input type="number" placeholder="Année de" value={yearFrom}
        onChange={e => setYearFrom(e.target.value)} style={{ width: 90 }} />
      <input type="number" placeholder="Année à" value={yearTo}
        onChange={e => setYearTo(e.target.value)} style={{ width: 90 }} />
      <select value={fuel} onChange={e => setFuel(e.target.value)}>
        <option value="">Carburant</option>
        <option>Essence</option><option>Diesel</option>
        <option>Hybride</option><option>Électrique</option>
      </select>
      <button onClick={submit}>Rechercher</button>
    </div>
  )
}
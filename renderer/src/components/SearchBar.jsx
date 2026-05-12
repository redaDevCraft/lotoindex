import React, { useState, useEffect } from 'react'

export default function SearchBar({ makes, filters, onSearch }) {
  const [text,     setText]     = useState(filters?.text     || '')
  const [makeId,   setMakeId]   = useState(filters?.makeId   || '')
  const [yearFrom, setYearFrom] = useState(filters?.yearFrom || '')
  const [yearTo,   setYearTo]   = useState(filters?.yearTo   || '')
  const [fuel,     setFuel]     = useState(filters?.fuel     || '')

  // When parent hard-resets (filters → {}), clear all local fields
  useEffect(() => {
    if (!filters || Object.keys(filters).length === 0) {
      setText(''); setMakeId(''); setYearFrom(''); setYearTo(''); setFuel('')
    }
  }, [filters])

  const submit = () => {
    onSearch({
      text:     text     || null,
      makeId:   makeId   || null,
      yearFrom: yearFrom || null,
      yearTo:   yearTo   || null,
      fuel:     fuel     || null,
    })
  }

  // Enter key triggers search on any text/number input in this bar
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className="search-bar">
      <input
        placeholder="Recherche globale (VIN, marque, modèle, immatriculation...)"
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <select value={makeId} onChange={e => setMakeId(e.target.value)}>
        <option value="">Toutes les marques</option>
        {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
      </select>
      <input
        type="number"
        placeholder="Année de"
        value={yearFrom}
        onChange={e => setYearFrom(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ width: 100 }}
      />
      <input
        type="number"
        placeholder="Année à"
        value={yearTo}
        onChange={e => setYearTo(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ width: 100 }}
      />
      <select value={fuel} onChange={e => setFuel(e.target.value)}>
        <option value="">Carburant</option>
        <option>Essence</option>
        <option>Diesel</option>
        <option>Hybride</option>
        <option>Électrique</option>
        <option>GPL</option>
      </select>
      <button className="btn-search" onClick={submit}>🔍 Rechercher</button>
    </div>
  )
}
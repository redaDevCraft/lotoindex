import React, { useState, useEffect } from 'react'

function IconEye() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>
}
function IconPencil() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
}
function IconTrash2() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
}
function IconTrash() {
    return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
}

const PER_PAGE_OPTIONS = [
    { label: '10',        value: 10  },
    { label: '25',        value: 25  },
    { label: '50',        value: 50  },
    { label: '100',       value: 100 },
    { label: 'Tout voir', value: 0   },
]

export default function CarTable({ cars, selected, onSelect, onEdit, onView, onDelete, onDeleteSelected }) {
    const [page,    setPage]    = useState(1)
    const [perPage, setPerPage] = useState(25)

    // Reset to page 1 whenever the dataset changes
    useEffect(function() { setPage(1) }, [cars])

    // perPage === 0 means show all
    var showAll    = perPage === 0
    var totalPages = showAll ? 1 : Math.max(1, Math.ceil(cars.length / perPage))
    var start      = showAll ? 0 : (page - 1) * perPage
    var pageRows   = showAll ? cars : cars.slice(start, start + perPage)

    var pageIds         = pageRows.map(function(c) { return c.id })
    var allPageSelected = pageIds.length > 0 && pageIds.every(function(id) { return selected.includes(id) })

    function toggle(id) {
        onSelect(selected.includes(id)
            ? selected.filter(function(s) { return s !== id })
            : selected.concat(id))
    }

    function togglePage() {
        if (allPageSelected) {
            onSelect(selected.filter(function(id) { return !pageIds.includes(id) }))
        } else {
            var next = selected.slice()
            pageIds.forEach(function(id) { if (!next.includes(id)) next.push(id) })
            onSelect(next)
        }
    }

    function handleDeleteOne(car) {
        if (window.confirm('Supprimer "' + [car.make_name, car.model_name, car.year].filter(Boolean).join(' ') + '" ?\nCette action est irréversible.')) {
            onDelete(car.id)
        }
    }

    function handleDeleteSelected() {
        if (selected.length === 0) return
        if (window.confirm('Supprimer les ' + selected.length + ' véhicule(s) sélectionné(s) ?\nCette action est irréversible.')) {
            onDeleteSelected(selected)
        }
    }

    function handlePerPageChange(val) {
        setPerPage(val)
        setPage(1)
    }

    function pageButtons() {
        if (showAll) return []
        var btns  = []
        var delta = 2
        var left  = Math.max(1, page - delta)
        var right = Math.min(totalPages, page + delta)
        if (left > 1)               btns.push(1)
        if (left > 2)               btns.push('…')
        for (var i = left; i <= right; i++) btns.push(i)
        if (right < totalPages - 1) btns.push('…')
        if (right < totalPages)     btns.push(totalPages)
        return btns
    }

    var displayStart = showAll ? 1 : Math.min(start + 1, cars.length)
    var displayEnd   = showAll ? cars.length : Math.min(start + perPage, cars.length)

    return (
        <div className="table-wrapper">
            {/* Toolbar */}
            <div className="table-toolbar">
                <span>
                    {cars.length} véhicule(s) au total
                    {selected.length > 0 && ' · ' + selected.length + ' sélectionné(s)'}
                </span>
                {selected.length > 0 && (
                    <button className="btn-delete-selected" onClick={handleDeleteSelected}>
                        <IconTrash />
                        Supprimer la sélection ({selected.length})
                    </button>
                )}
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
                <table>
                    <colgroup>
                        <col style={{ width: '36px' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '110px' }} />
                        <col style={{ width: '130px' }} />
                        <col style={{ width: '60px' }} />
                        <col style={{ width: '130px' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '80px' }} />
                        <col style={{ width: '80px' }} />
                        <col style={{ width: '100px' }} />
                        <col style={{ width: '90px' }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" onChange={togglePage}
                                    checked={allPageSelected}
                                    title="Sélectionner cette page" />
                            </th>
                            <th>Marque</th>
                            <th>Modèle</th>
                            <th>Sous-modèle</th>
                            <th>Année</th>
                            <th>VIN</th>
                            <th>Immat.</th>
                            <th>Énergie</th>
                            <th>Puissance</th>
                            <th>Kilométrage</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.length === 0 && (
                            <tr>
                                <td colSpan={11} style={{ textAlign: 'center', padding: '2.5rem', color: '#9ca3af' }}>
                                    Aucun véhicule trouvé.
                                </td>
                            </tr>
                        )}
                        {pageRows.map(function(car) {
                            return (
                                <tr key={car.id} className={selected.includes(car.id) ? 'selected' : ''}>
                                    <td>
                                        <input type="checkbox" checked={selected.includes(car.id)}
                                            onChange={function() { toggle(car.id) }} />
                                    </td>
                                    <td title={car.make_name}>{car.make_name     || '—'}</td>
                                    <td title={car.model_name}>{car.model_name   || '—'}</td>
                                    <td title={car.submodel_name}>{car.submodel_name || '—'}</td>
                                    <td>{car.year         || '—'}</td>
                                    <td className="mono" title={car.vin}>{car.vin || '—'}</td>
                                    <td>{car.registration || '—'}</td>
                                    <td>{car.fuel_type    || '—'}</td>
                                    <td>{car.power_cv   ? car.power_cv   + ' cv' : '—'}</td>
                                    <td>{car.mileage_km ? car.mileage_km + ' km' : '—'}</td>
                                    <td>
                                        <div className="row-actions">
                                            <button title="Voir"      onClick={function() { onView(car) }}><IconEye /></button>
                                            <button title="Modifier"  onClick={function() { onEdit(car) }}><IconPencil /></button>
                                            <button title="Supprimer" className="btn-danger"
                                                onClick={function() { handleDeleteOne(car) }}><IconTrash2 /></button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination bar */}
            <div className="pagination">
                <div className="pagination-info">
                    {cars.length === 0
                        ? 'Aucun résultat'
                        : 'Affichage ' + displayStart + '–' + displayEnd + ' sur ' + cars.length
                    }
                </div>

                {!showAll && (
                    <div className="pagination-controls">
                        <button onClick={function() { setPage(1) }}        disabled={page === 1}>«</button>
                        <button onClick={function() { setPage(page - 1) }} disabled={page === 1}>‹</button>
                        {pageButtons().map(function(b, i) {
                            if (b === '…') return (
                                <button key={'e' + i} disabled style={{ cursor: 'default' }}>…</button>
                            )
                            return (
                                <button key={b} className={b === page ? 'active' : ''}
                                    onClick={function() { setPage(b) }}>
                                    {b}
                                </button>
                            )
                        })}
                        <button onClick={function() { setPage(page + 1) }} disabled={page === totalPages}>›</button>
                        <button onClick={function() { setPage(totalPages) }} disabled={page === totalPages}>»</button>
                    </div>
                )}

                <div className="pagination-per-page">
                    <span>Lignes :</span>
                    <select
                        value={perPage}
                        onChange={function(e) { handlePerPageChange(Number(e.target.value)) }}
                    >
                        {PER_PAGE_OPTIONS.map(function(opt) {
                            return <option key={opt.value} value={opt.value}>{opt.label}</option>
                        })}
                    </select>
                </div>
            </div>
        </div>
    )
}
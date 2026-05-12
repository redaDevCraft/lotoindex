import React from 'react'

// Inline SVG icons — no external dependency needed
function IconEye() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    )
}

function IconPencil() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
    )
}

function IconTrash2() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
    )
}

function IconTrash() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        </svg>
    )
}

export default function CarTable({ cars, selected, onSelect, onEdit, onView, onDelete, onDeleteSelected }) {

    function toggle(id) {
        onSelect(selected.includes(id) ? selected.filter(function(s) { return s !== id }) : selected.concat(id))
    }

    function toggleAll() {
        onSelect(selected.length === cars.length ? [] : cars.map(function(c) { return c.id }))
    }

    function handleDeleteOne(car) {
        if (window.confirm('Supprimer le véhicule "' + (car.make_name || '') + ' ' + (car.model_name || '') + ' ' + (car.year || '') + '" ?\n\nCette action est irréversible.')) {
            onDelete(car.id)
        }
    }

    function handleDeleteSelected() {
        if (selected.length === 0) return
        if (window.confirm('Supprimer les ' + selected.length + ' véhicule(s) sélectionné(s) ?\n\nCette action est irréversible.')) {
            onDeleteSelected(selected)
        }
    }

    return (
        <div className="table-wrapper">
            <div className="table-toolbar">
                <span>{cars.length} véhicule(s)</span>
                {selected.length > 0 && (
                    <button className="btn-delete-selected" onClick={handleDeleteSelected}>
                        <IconTrash />
                        Supprimer la sélection ({selected.length})
                    </button>
                )}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>
                            <input type="checkbox" onChange={toggleAll}
                                checked={selected.length === cars.length && cars.length > 0}
                                title="Tout sélectionner" />
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
                    {cars.length === 0 && (
                        <tr>
                            <td colSpan={11} style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af' }}>
                                Aucun véhicule trouvé.
                            </td>
                        </tr>
                    )}
                    {cars.map(function(car) {
                        return (
                            <tr key={car.id} className={selected.includes(car.id) ? 'selected' : ''}>
                                <td>
                                    <input type="checkbox" checked={selected.includes(car.id)}
                                        onChange={function() { toggle(car.id) }} />
                                </td>
                                <td>{car.make_name     || '—'}</td>
                                <td>{car.model_name    || '—'}</td>
                                <td>{car.submodel_name || '—'}</td>
                                <td>{car.year          || '—'}</td>
                                <td className="mono">{car.vin || '—'}</td>
                                <td>{car.registration  || '—'}</td>
                                <td>{car.fuel_type     || '—'}</td>
                                <td>{car.power_cv   ? car.power_cv   + ' cv' : '—'}</td>
                                <td>{car.mileage_km ? car.mileage_km + ' km' : '—'}</td>
                                <td className="row-actions">
                                    <button title="Voir"      onClick={function() { onView(car) }}><IconEye /></button>
                                    <button title="Modifier"  onClick={function() { onEdit(car) }}><IconPencil /></button>
                                    <button title="Supprimer" className="btn-danger"
                                        onClick={function() { handleDeleteOne(car) }}><IconTrash2 /></button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
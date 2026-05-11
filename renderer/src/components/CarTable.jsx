import React from 'react'


export default function CarTable({ cars, selected, onSelect, onEdit, onView, onDelete }) {
  const toggle = (id) =>
    onSelect(selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id])

  const toggleAll = () =>
    onSelect(selected.length === cars.length ? [] : cars.map(c => c.id))

  return (
    <div className="table-wrapper">
      <p>{cars.length} véhicule(s)</p>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={toggleAll}
              checked={selected.length === cars.length && cars.length > 0} /></th>
            <th>Marque</th><th>Modèle</th><th>Sous-modèle</th>
            <th>Année</th><th>VIN</th><th>Immat.</th>
            <th>Énergie</th><th>Puissance</th><th>Kilométrage</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cars.map(car => (
            <tr key={car.id} className={selected.includes(car.id) ? 'selected' : ''}>
              <td><input type="checkbox" checked={selected.includes(car.id)}
                onChange={() => toggle(car.id)} /></td>
              <td>{car.make_name}</td>
              <td>{car.model_name}</td>
              <td>{car.submodel_name}</td>
              <td>{car.year}</td>
              <td className="mono">{car.vin}</td>
              <td>{car.registration}</td>
              <td>{car.fuel_type}</td>
              <td>{car.power_cv ? `${car.power_cv} cv` : '—'}</td>
              <td>{car.mileage_km ? `${car.mileage_km} km` : '—'}</td>
              <td>
                <button onClick={() => onView(car)}>👁</button>
                <button onClick={() => onEdit(car)}>✏️</button>
                <button onClick={() => { if(confirm('Supprimer?')) onDelete(car.id) }}>🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
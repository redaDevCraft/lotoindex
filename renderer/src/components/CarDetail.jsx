import React, { useState, useEffect } from 'react'

export default function CarDetail({ carId, onBack, onEdit }) {
  const [car, setCar] = useState(null)

  useEffect(() => {
    if (carId) window.db.getCarById(carId).then(setCar)
  }, [carId])

  if (!car) return <div>Chargement...</div>

  return (
    <div className="car-detail">
      <div className="detail-header">
        <button onClick={onBack}>← Retour</button>
        <h2>{car.make_name} {car.model_name} {car.submodel_name} — {car.year}</h2>
        <button onClick={onEdit}>✏️ Modifier</button>
      </div>

      <div className="detail-grid">
        {[
          ['VIN', car.vin], ['Immatriculation', car.registration],
          ['Date immat.', car.reg_date], ['Énergie', car.fuel_type],
          ['Puissance', car.power_cv ? `${car.power_cv} cv` : '—'],
          ['Kilométrage', car.mileage_km ? `${car.mileage_km} km` : '—'],
          ['Cylindrée', car.displacement_cc ? `${car.displacement_cc} cc` : '—'],
          ['Moteur', car.engine_code], ['Boîte', car.gearbox],
          ['Type', car.internal_type], ['N° Dossier', car.folder_ref],
        ].map(([l,v]) => v ? (
          <div key={l} className="detail-field">
            <span className="field-label">{l}</span>
            <span className="field-value">{v}</span>
          </div>
        ) : null)}
      </div>

      {car.attributes?.length > 0 && (
        <div className="attributes-section">
          <h3>Attributs supplémentaires</h3>
          {car.attributes.map(a => (
            <div key={a.key} className="detail-field">
              <span className="field-label">{a.key}</span>
              <span className="field-value">{a.value}</span>
            </div>
          ))}
        </div>
      )}

      {car.images?.length > 0 && (
        <div className="images-section">
          <h3>Photos</h3>
          <div className="image-grid">
            {car.images.map(img => (
              <img key={img.id} src={`file://${img.filepath}`}
                alt="photo" className="car-thumb" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
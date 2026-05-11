import React, { useState, useEffect } from 'react'

export default function CarForm({ car, makes, onSave, onCancel }) {
  const [models,    setModels]    = useState([])
  const [submodels, setSubmodels] = useState([])
  const [form,      setForm]      = useState({
    make_id:'', model_id:'', submodel_id:'', year:'', vin:'',
    registration:'', reg_date:'', fuel_type:'Essence', power_cv:'',
    mileage_km:'', displacement_cc:'', engine_code:'',
    gearbox:'Manuelle', internal_type:'', folder_ref:'', notes:'',
    attributes: {}
  })

  useEffect(() => {
    if (car) setForm({ ...car, attributes: car.attributes
      ? Object.fromEntries(car.attributes.map(a => [a.key, a.value])) : {} })
  }, [car])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const onMakeChange = async (makeId) => {
    set('make_id', makeId)
    const m = await window.db.getModels(makeId)
    setModels(m); setSubmodels([])
  }

  const onModelChange = async (modelId) => {
    set('model_id', modelId)
    const sm = await window.db.getSubmodels(modelId)
    setSubmodels(sm)
  }

  return (
    <div className="car-form">
      <h2>{car ? 'Modifier le véhicule' : 'Nouveau véhicule'}</h2>

      <div className="form-grid">
        {/* Hierarchy */}
        <label>Marque
          <select value={form.make_id} onChange={e => onMakeChange(e.target.value)}>
            <option value="">-- Choisir --</option>
            {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>

        <label>Modèle
          <select value={form.model_id} onChange={e => onModelChange(e.target.value)}>
            <option value="">-- Choisir --</option>
            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </label>

        <label>Sous-modèle
          <select value={form.submodel_id} onChange={e => set('submodel_id', e.target.value)}>
            <option value="">-- Choisir --</option>
            {submodels.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>

        {/* Fixed fields */}
        {[
          ['year','Année','number'],['vin','VIN','text'],
          ['registration','Immatriculation','text'],['reg_date','Date immat.','date'],
          ['power_cv','Puissance (cv)','number'],['mileage_km','Kilométrage (km)','number'],
          ['displacement_cc','Cylindrée (cc)','number'],['engine_code','Code moteur','text'],
          ['internal_type','Type interne','text'],['folder_ref','N° Dossier','text'],
        ].map(([key, label, type]) => (
          <label key={key}>{label}
            <input type={type} value={form[key]||''} onChange={e => set(key, e.target.value)} />
          </label>
        ))}

        <label>Énergie
          <select value={form.fuel_type} onChange={e => set('fuel_type', e.target.value)}>
            {['Essence','Diesel','Hybride','Électrique','GPL'].map(f =>
              <option key={f}>{f}</option>)}
          </select>
        </label>

        <label>Boîte
          <select value={form.gearbox} onChange={e => set('gearbox', e.target.value)}>
            {['Manuelle','Automatique','DSG','CVT'].map(g => <option key={g}>{g}</option>)}
          </select>
        </label>

        <label className="full-width">Notes
          <textarea value={form.notes||''} onChange={e => set('notes', e.target.value)} />
        </label>
      </div>

      <div className="form-actions">
        <button className="btn-primary" onClick={() => onSave(form)}>
          {car ? 'Enregistrer' : 'Créer'}
        </button>
        <button onClick={onCancel}>Annuler</button>
      </div>
    </div>
  )
}
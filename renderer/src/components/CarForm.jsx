import React, { useState, useEffect } from 'react'
import CarImages from './CarImages'

export default function CarForm({ car, makes, onSave, onCancel }) {
    const [models,            setModels]            = useState([])
    const [submodels,         setSubmodels]         = useState([])
    const [pendingImagePaths, setPendingImagePaths] = useState([])
    const [saving,            setSaving]            = useState(false)
    const [form, setForm] = useState({
        make_id: '', model_id: '', submodel_id: '', year: '', vin: '',
        registration: '', reg_date: '', fuel_type: 'Essence', power_cv: '',
        mileage_km: '', displacement_cc: '', engine_code: '',
        gearbox: 'Manuelle', internal_type: '', folder_ref: '', notes: '',
        attributes: {}
    })

    useEffect(function() {
        if (car) {
            setForm({
                ...car,
                attributes: car.attributes
                    ? Object.fromEntries(car.attributes.map(function(a) { return [a.key, a.value] }))
                    : {}
            })
            if (car.make_id)   window.db.getModels(car.make_id).then(function(m)  { setModels(m || []) })
            if (car.model_id)  window.db.getSubmodels(car.model_id).then(function(s) { setSubmodels(s || []) })
        }
    }, [car])

    function set(k, v) { setForm(function(f) { return { ...f, [k]: v } }) }

    async function onMakeChange(makeId) {
        set('make_id', makeId); set('model_id', ''); set('submodel_id', '')
        setModels((await window.db.getModels(makeId)) || [])
        setSubmodels([])
    }

    async function onModelChange(modelId) {
        set('model_id', modelId); set('submodel_id', '')
        setSubmodels((await window.db.getSubmodels(modelId)) || [])
    }

    async function handleSave() {
        setSaving(true)
        try {
            var id = await onSave(form)  // navigates to list inside onSave
            if (id && pendingImagePaths.length > 0) {
                await window.db.uploadImages(id, pendingImagePaths)
            }
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="car-form">
            <h2>{car ? 'Modifier le véhicule' : 'Nouveau véhicule'}</h2>

            <div className="form-grid">
                <label>Marque
                    <select value={form.make_id || ''} onChange={function(e) { onMakeChange(e.target.value) }}>
                        <option value="">-- Choisir --</option>
                        {(makes || []).map(function(m) { return <option key={m.id} value={m.id}>{m.name}</option> })}
                    </select>
                </label>
                <label>Modèle
                    <select value={form.model_id || ''} onChange={function(e) { onModelChange(e.target.value) }}>
                        <option value="">-- Choisir --</option>
                        {models.map(function(m) { return <option key={m.id} value={m.id}>{m.name}</option> })}
                    </select>
                </label>
                <label>Sous-modèle
                    <select value={form.submodel_id || ''} onChange={function(e) { set('submodel_id', e.target.value) }}>
                        <option value="">-- Choisir --</option>
                        {submodels.map(function(s) { return <option key={s.id} value={s.id}>{s.name}</option> })}
                    </select>
                </label>
                {[
                    ['year','Année','number'],['vin','VIN','text'],
                    ['registration','Immatriculation','text'],['reg_date','Date immat.','date'],
                    ['power_cv','Puissance (cv)','number'],['mileage_km','Kilométrage (km)','number'],
                    ['displacement_cc','Cylindrée (cc)','number'],['engine_code','Code moteur','text'],
                    ['internal_type','Type interne','text'],['folder_ref','N° Dossier','text'],
                ].map(function(item) {
                    return (
                        <label key={item[0]}>{item[1]}
                            <input type={item[2]} value={form[item[0]] || ''}
                                onChange={function(e) { set(item[0], e.target.value) }} />
                        </label>
                    )
                })}
                <label>Énergie
                    <select value={form.fuel_type || 'Essence'} onChange={function(e) { set('fuel_type', e.target.value) }}>
                        {['Essence','Diesel','Hybride','Électrique','GPL'].map(function(f) { return <option key={f}>{f}</option> })}
                    </select>
                </label>
                <label>Boîte
                    <select value={form.gearbox || 'Manuelle'} onChange={function(e) { set('gearbox', e.target.value) }}>
                        {['Manuelle','Automatique','DSG','CVT'].map(function(g) { return <option key={g}>{g}</option> })}
                    </select>
                </label>
                <label className="full-width">Notes
                    <textarea value={form.notes || ''} rows={3}
                        onChange={function(e) { set('notes', e.target.value) }} />
                </label>
            </div>

            <CarImages carId={car ? car.id : null} onPendingChange={setPendingImagePaths} />

            <div className="form-actions">
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Enregistrement…' : (car ? 'Enregistrer' : 'Créer')}
                </button>
                <button onClick={onCancel} disabled={saving}>Annuler</button>
            </div>
        </div>
    )
}
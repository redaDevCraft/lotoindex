import React, { useState, useEffect } from 'react'
import CarImages from './CarImages'

export default function CarForm({ car, makes, onSave, onCancel }) {
    const [models,            setModels]            = useState([])
    const [submodels,         setSubmodels]         = useState([])
    const [savedId,           setSavedId]           = useState(car ? car.id : null)
    const [pendingImagePaths, setPendingImagePaths] = useState([])
    const [form, setForm] = useState({
        make_id: '', model_id: '', submodel_id: '', year: '', vin: '',
        registration: '', reg_date: '', fuel_type: 'Essence', power_cv: '',
        mileage_km: '', displacement_cc: '', engine_code: '',
        gearbox: 'Manuelle', internal_type: '', folder_ref: '', notes: '',
        attributes: {}
    })
    const [saving, setSaving] = useState(false)


    useEffect(function() {
        if (car) {
            setForm({
                ...car,
                attributes: car.attributes
                    ? Object.fromEntries(car.attributes.map(function(a) { return [a.key, a.value] }))
                    : {}
            })
            setSavedId(car.id)
            if (car.make_id) {
                window.db.getModels(car.make_id).then(function(m) { setModels(m || []) })
            }
            if (car.model_id) {
                window.db.getSubmodels(car.model_id).then(function(sm) { setSubmodels(sm || []) })
            }
        }
    }, [car])

    function set(k, v) {
        setForm(function(f) { return { ...f, [k]: v } })
    }

    async function onMakeChange(makeId) {
        set('make_id', makeId)
        set('model_id', '')
        set('submodel_id', '')
        var m = await window.db.getModels(makeId)
        setModels(m || [])
        setSubmodels([])
    }

    async function onModelChange(modelId) {
        set('model_id', modelId)
        set('submodel_id', '')
        var sm = await window.db.getSubmodels(modelId)
        setSubmodels(sm || [])
    }

   async function handleSave() {
    setSaving(true)
    try {
        var id = await onSave(form)
        if (id && !savedId) {
            setSavedId(id)
           
        }
    } finally {
        setSaving(false)
    }
}

    return (
        <div className="car-form">
            <h2>{car ? 'Modifier le véhicule' : 'Nouveau véhicule'}</h2>

            <div className="form-grid">
                {/* Make */}
                <label>Marque
                    <select value={form.make_id || ''} onChange={function(e) { onMakeChange(e.target.value) }}>
                        <option value="">-- Choisir --</option>
                        {(makes || []).map(function(m) {
                            return <option key={m.id} value={m.id}>{m.name}</option>
                        })}
                    </select>
                </label>

                {/* Model */}
                <label>Modèle
                    <select value={form.model_id || ''} onChange={function(e) { onModelChange(e.target.value) }}>
                        <option value="">-- Choisir --</option>
                        {models.map(function(m) {
                            return <option key={m.id} value={m.id}>{m.name}</option>
                        })}
                    </select>
                </label>

                {/* Submodel */}
                <label>Sous-modèle
                    <select value={form.submodel_id || ''} onChange={function(e) { set('submodel_id', e.target.value) }}>
                        <option value="">-- Choisir --</option>
                        {submodels.map(function(s) {
                            return <option key={s.id} value={s.id}>{s.name}</option>
                        })}
                    </select>
                </label>

                {/* Fixed fields */}
                {[
                    ['year',           'Année',             'number'],
                    ['vin',            'VIN',               'text'],
                    ['registration',   'Immatriculation',   'text'],
                    ['reg_date',       'Date immat.',       'date'],
                    ['power_cv',       'Puissance (cv)',    'number'],
                    ['mileage_km',     'Kilométrage (km)',  'number'],
                    ['displacement_cc','Cylindrée (cc)',    'number'],
                    ['engine_code',    'Code moteur',       'text'],
                    ['internal_type',  'Type interne',      'text'],
                    ['folder_ref',     'N° Dossier',        'text'],
                ].map(function(item) {
                    var key = item[0], label = item[1], type = item[2]
                    return (
                        <label key={key}>{label}
                            <input
                                type={type}
                                value={form[key] || ''}
                                onChange={function(e) { set(key, e.target.value) }}
                            />
                        </label>
                    )
                })}

                {/* Fuel type */}
                <label>Énergie
                    <select value={form.fuel_type || 'Essence'} onChange={function(e) { set('fuel_type', e.target.value) }}>
                        {['Essence','Diesel','Hybride','Électrique','GPL'].map(function(f) {
                            return <option key={f}>{f}</option>
                        })}
                    </select>
                </label>

                {/* Gearbox */}
                <label>Boîte
                    <select value={form.gearbox || 'Manuelle'} onChange={function(e) { set('gearbox', e.target.value) }}>
                        {['Manuelle','Automatique','DSG','CVT'].map(function(g) {
                            return <option key={g}>{g}</option>
                        })}
                    </select>
                </label>

                {/* Notes */}
                <label className="full-width">Notes
                    <textarea
                        value={form.notes || ''}
                        onChange={function(e) { set('notes', e.target.value) }}
                        rows={3}
                    />
                </label>
            </div>

          {/* Actions */}
<div className="form-actions">
    {!savedId ? (
        // New car — save creates it, stays on form for images
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Création...' : 'Créer et ajouter des photos'}
        </button>
    ) : (
        // Car exists — normal save
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
    )}
    <button onClick={onCancel}>
        {savedId && !car ? 'Terminer' : 'Annuler'}
    </button>
</div>

            {/* Images — always visible, pending queue before save, live after */}
            <CarImages
                carId={savedId}
                onPendingChange={setPendingImagePaths}
            />
        </div>
    )
}
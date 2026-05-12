// @ts-nocheck
import React, { useState, useEffect } from 'react'
import CarImages from './CarImages'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: CURRENT_YEAR - 1969 }, function(_, i) { return CURRENT_YEAR - i })

const GEARBOX_OPTIONS = ['Manuelle', 'Automatique', 'DSG', 'CVT', 'Autre']

export default function CarForm({ car, makes, onSave, onCancel }) {
    const [models,            setModels]            = useState([])
    const [submodels,         setSubmodels]         = useState([])
    const [savedId,           setSavedId]           = useState(car ? car.id : null)
    const [pendingImagePaths, setPendingImagePaths] = useState([])
    const [saving,            setSaving]            = useState(false)

    // Track whether gearbox is "custom" (Autre)
    const [gearboxCustom, setGearboxCustom] = useState(false)
    const [gearboxText,   setGearboxText]   = useState('')

    const [form, setForm] = useState({
        make_id: '', model_id: '', submodel_id: '', year: '', vin: '',
        registration: '', reg_date: '', fuel_type: 'Essence', power_cv: '',
        mileage_km: '', displacement_cc: '', engine_code: '',
        gearbox: 'Manuelle', internal_type: '', notes: '',
        attributes: {}
    })

    useEffect(function() {
        if (car) {
            var isKnown = GEARBOX_OPTIONS.slice(0, -1).includes(car.gearbox)
            setForm({
                ...car,
                folder_ref: undefined,   // strip it even if in DB
                attributes: car.attributes
                    ? Object.fromEntries(car.attributes.map(function(a) { return [a.key, a.value] }))
                    : {}
            })
            setSavedId(car.id)
            if (!isKnown && car.gearbox) {
                setGearboxCustom(true)
                setGearboxText(car.gearbox)
            }
            if (car.make_id)  window.db.getModels(car.make_id).then(function(m)  { setModels(m || []) })
            if (car.model_id) window.db.getSubmodels(car.model_id).then(function(sm) { setSubmodels(sm || []) })
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

    function handleGearboxSelect(val) {
        if (val === 'Autre') {
            setGearboxCustom(true)
            setGearboxText('')
            set('gearbox', '')
        } else {
            setGearboxCustom(false)
            setGearboxText('')
            set('gearbox', val)
        }
    }

    function handleGearboxText(val) {
        setGearboxText(val)
        set('gearbox', val)
    }

    async function handleSave() {
        setSaving(true)
        try {
            var payload = { ...form }
            delete payload.folder_ref   // always strip
            var id = await onSave(payload)
            if (id && pendingImagePaths.length > 0) {
                await window.db.uploadImages(id, pendingImagePaths)
                setPendingImagePaths([])
            }
            if (id && !savedId) setSavedId(id)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="car-form">
            <h2>{car ? 'Modifier le véhicule' : 'Nouveau véhicule'}</h2>

            <div className="form-grid">
                {/* Marque */}
                <label>Marque
                    <select value={form.make_id || ''} onChange={function(e) { onMakeChange(e.target.value) }}>
                        <option value="">-- Choisir --</option>
                        {(makes || []).map(function(m) { return <option key={m.id} value={m.id}>{m.name}</option> })}
                    </select>
                </label>

                {/* Modèle */}
                <label>Modèle
                    <select value={form.model_id || ''} onChange={function(e) { onModelChange(e.target.value) }}>
                        <option value="">-- Choisir --</option>
                        {models.map(function(m) { return <option key={m.id} value={m.id}>{m.name}</option> })}
                    </select>
                </label>

                {/* Sous-modèle */}
                <label>Sous-modèle
                    <select value={form.submodel_id || ''} onChange={function(e) { set('submodel_id', e.target.value) }}>
                        <option value="">-- Choisir --</option>
                        {submodels.map(function(s) { return <option key={s.id} value={s.id}>{s.name}</option> })}
                    </select>
                </label>

                {/* Année — select dropdown */}
                <label>Année
                    <select value={form.year || ''} onChange={function(e) { set('year', e.target.value) }}>
                        <option value="">-- Choisir --</option>
                        {YEARS.map(function(y) { return <option key={y} value={y}>{y}</option> })}
                    </select>
                </label>

                {/* Plain text/number fields — folder_ref removed */}
                {[
                    ['vin',             'VIN',                'text'],
                    ['registration',    'Immatriculation',    'text'],
                    ['reg_date',        'Date immat.',        'date'],
                    ['power_cv',        'Puissance (cv)',     'number'],
                    ['mileage_km',      'Kilométrage (km)',   'number'],
                    ['displacement_cc', 'Cylindrée (cc)',     'number'],
                    ['engine_code',     'Code moteur',        'text'],
                    ['internal_type',   'Type interne',       'text'],
                ].map(function(item) {
                    return (
                        <label key={item[0]}>{item[1]}
                            <input type={item[2]} value={form[item[0]] || ''}
                                onChange={function(e) { set(item[0], e.target.value) }} />
                        </label>
                    )
                })}

                {/* Énergie */}
                <label>Énergie
                    <select value={form.fuel_type || 'Essence'} onChange={function(e) { set('fuel_type', e.target.value) }}>
                        {['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'].map(function(f) {
                            return <option key={f}>{f}</option>
                        })}
                    </select>
                </label>

                {/* Boîte de vitesse — with Autre custom input */}
                <label>Boîte de vitesse
                    <select
                        value={gearboxCustom ? 'Autre' : (form.gearbox || 'Manuelle')}
                        onChange={function(e) { handleGearboxSelect(e.target.value) }}
                    >
                        {GEARBOX_OPTIONS.map(function(g) { return <option key={g}>{g}</option> })}
                    </select>
                    {gearboxCustom && (
                        <input
                            type="text"
                            placeholder="Précisez la boîte..."
                            value={gearboxText}
                            onChange={function(e) { handleGearboxText(e.target.value) }}
                            style={{ marginTop: 6 }}
                            autoFocus
                        />
                    )}
                </label>

                {/* Notes */}
                <label className="full-width">Notes
                    <textarea value={form.notes || ''} rows={3}
                        onChange={function(e) { set('notes', e.target.value) }} />
                </label>
            </div>

            <CarImages carId={savedId} onPendingChange={setPendingImagePaths} />

            <div className="form-actions">
                <button className="btn-primary" onClick={handleSave} disabled={saving}>
                    {saving ? 'Enregistrement...' : (car ? 'Enregistrer' : 'Créer')}
                </button>
                <button onClick={onCancel}>Annuler</button>
            </div>
        </div>
    )
}
// @ts-nocheck
const { dialog } = require('electron')
const fs = require('fs')
const Papa = require('papaparse')
const { run, get } = require('../db')

const FIELD_MAP = {
    make_name: ['marque', 'brand', 'make', 'constructeur'],
    model_name: ['modele', 'modèle', 'model'],
    year: ['annee', 'année', 'year', 'an'],
    vin: ['vin', 'num_serie', 'chassis'],
    fuel_type: ['energie', 'énergie', 'fuel', 'carburant'],
    power_cv: ['puissance', 'cv', 'power'],
    mileage_km: ['kms', 'km', 'mileage', 'kilometrage'],
    displacement_cc: ['cylindree', 'cylindrée', 'cc'],
    engine_code: ['moteur', 'engine'],
    gearbox: ['boite', 'boîte', 'gearbox', 'transmission'],
    registration: ['matricule', 'immat', 'plate'],
    reg_date: ['imatriculation', 'immatriculation', 'reg_date'],
    folder_ref: ['dossier', 'folder', 'photos'],
}

function detectMapping(headers) {
    const map = {}
    for (const header of headers) {
        const norm = header.toLowerCase().trim().replace(/[^a-z0-9]/g, '')
        let matched = false
        for (const [field, aliases] of Object.entries(FIELD_MAP)) {
            if (aliases.some(function(a) {
                    return norm.includes(a.replace(/[^a-z0-9]/g, ''))
                })) {
                map[header] = field
                matched = true
                break
            }
        }
        if (!matched) map[header] = 'attr_' + norm
    }
    return map
}

function normalizePower(raw) {
    if (!raw || raw === '/' || raw === '-') return null
    const m = String(raw).match(/(\d+)/)
    return m ? parseInt(m[1]) : null
}

async function pickCSV(win) {
    const result = await dialog.showOpenDialog(win, {
        title: 'Importer CSV',
        filters: [{ name: 'CSV', extensions: ['csv'] }],
        properties: ['openFile']
    })
    return result.filePaths[0] || null
}

async function previewCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf8')
    const result = Papa.parse(content, { header: true, skipEmptyLines: true })
    const headers = result.meta.fields
    return {
        headers: headers,
        mapping: detectMapping(headers),
        preview: result.data.slice(0, 5),
        total: result.data.length
    }
}

async function importCSV(filePath, mapping) {
    const content = fs.readFileSync(filePath, 'utf8')
    const result = Papa.parse(content, { header: true, skipEmptyLines: true })
    var imported = 0
    var errors = []

    for (const row of result.data) {
        try {
            // ── Resolve make ──────────────────────────────
            var makeCol = Object.keys(mapping).find(function(k) { return mapping[k] === 'make_name' })
            var makeName = makeCol ? row[makeCol] : null
            if (!makeName || !makeName.trim()) continue

            var make = await get('SELECT id FROM makes WHERE name=?', [makeName.toUpperCase().trim()])
            if (!make) {
                var makeIns = await run(
                    'INSERT INTO makes(name,slug) VALUES(?,?)', [makeName.toUpperCase().trim(), makeName.toLowerCase().replace(/\s+/g, '_')]
                )
                make = { id: makeIns.lastID }
            }

            // ── Resolve model ─────────────────────────────
            var modelCol = Object.keys(mapping).find(function(k) { return mapping[k] === 'model_name' })
            var modelName = modelCol ? row[modelCol] : null
            var modelId = null

            if (modelName && modelName.trim()) {
                var model = await get(
                    'SELECT id FROM models WHERE make_id=? AND name=?', [make.id, modelName.trim()]
                )
                if (!model) {
                    var modelIns = await run(
                        'INSERT INTO models(make_id,name) VALUES(?,?)', [make.id, modelName.trim()]
                    )
                    model = { id: modelIns.lastID }
                }
                modelId = model.id
            }

            // ── Build car fields ──────────────────────────
            var carData = {}
            var attrs = {}

            for (const csvCol of Object.keys(mapping)) {
                var field = mapping[csvCol]
                var val = row[csvCol]
                if (!val || val === '/' || val === '-' || val === '') continue

                if (field.startsWith('attr_')) {
                    attrs[csvCol] = val
                } else if (field === 'power_cv') {
                    carData[field] = normalizePower(val)
                } else if (field === 'year' || field === 'mileage_km' || field === 'displacement_cc') {
                    var parsed = parseInt(String(val).replace(/\D/g, ''))
                    carData[field] = isNaN(parsed) ? null : parsed
                } else if (field !== 'make_name' && field !== 'model_name') {
                    carData[field] = val
                }
            }

            // ── Insert car ────────────────────────────────
            // ✅ FIXED: model ? model.id : null  (was missing ": null")
            var ins = await run(
                'INSERT INTO cars (make_id, model_id, year, vin, registration, reg_date, fuel_type, power_cv, mileage_km, displacement_cc, engine_code, gearbox, internal_type, folder_ref) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [
                    make.id,
                    modelId !== undefined ? modelId : null,
                    carData.year !== undefined ? carData.year : null,
                    carData.vin !== undefined ? carData.vin : null,
                    carData.registration !== undefined ? carData.registration : null,
                    carData.reg_date !== undefined ? carData.reg_date : null,
                    carData.fuel_type !== undefined ? carData.fuel_type : null,
                    carData.power_cv !== undefined ? carData.power_cv : null,
                    carData.mileage_km !== undefined ? carData.mileage_km : null,
                    carData.displacement_cc !== undefined ? carData.displacement_cc : null,
                    carData.engine_code !== undefined ? carData.engine_code : null,
                    carData.gearbox !== undefined ? carData.gearbox : null,
                    carData.internal_type !== undefined ? carData.internal_type : null,
                    carData.folder_ref !== undefined ? carData.folder_ref : null,
                ]
            )

            // ── FTS index ─────────────────────────────────
            var blob = [
                makeName, modelName, carData.vin,
                carData.registration, carData.engine_code, carData.fuel_type
            ].filter(Boolean).join(' ')

            await run(
                'INSERT INTO cars_fts(car_id, search_blob) VALUES(?,?)', [ins.lastID, blob]
            )

            // ── Dynamic attributes ────────────────────────
            for (const k of Object.keys(attrs)) {
                await run(
                    'INSERT OR REPLACE INTO car_attributes(car_id,key,value) VALUES(?,?,?)', [ins.lastID, k, attrs[k]]
                )
            }

            imported++

        } catch (e) {
            errors.push({ row: row, error: e.message })
        }
    }

    return { imported: imported, errors: errors, total: result.data.length }
}

module.exports = { pickCSV, previewCSV, importCSV }
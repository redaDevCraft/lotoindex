const { run, all } = require('../db')

async function getAllMakes() {
    return all('SELECT * FROM makes ORDER BY name')
}

async function createMake(name) {
    const slug = name.toLowerCase().replace(/\s+/g, '_')
    return run('INSERT OR IGNORE INTO makes(name, slug) VALUES(?,?)', [name, slug])
}

async function getModelsByMake(makeId) {
    return all('SELECT * FROM models WHERE make_id = ? ORDER BY name', [makeId])
}

async function createModel({ makeId, name, vehicleType = 'car' }) {
    return run(
        'INSERT OR IGNORE INTO models(make_id, name, vehicle_type) VALUES(?,?,?)', [makeId, name, vehicleType]
    )
}

async function getSubmodelsByModel(modelId) {
    return all('SELECT * FROM submodels WHERE model_id = ? ORDER BY name', [modelId])
}

async function createSubmodel({ modelId, name, parentId = null, yearFrom, yearTo, engineCc, powerCv, fuelType, gearbox }) {
    return run(
        `INSERT OR IGNORE INTO submodels
     (model_id, parent_id, name, year_from, year_to, engine_cc, power_cv, fuel_type, gearbox)
     VALUES(?,?,?,?,?,?,?,?,?)`, [modelId, parentId, name, yearFrom, yearTo, engineCc, powerCv, fuelType, gearbox]
    )
}

module.exports = { getAllMakes, createMake, getModelsByMake, createModel, getSubmodelsByModel, createSubmodel }
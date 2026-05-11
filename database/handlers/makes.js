const { run, all, get } = require('../db')

// ─────────────────────────────────────────────
// MAKES
// ─────────────────────────────────────────────
async function getAllMakes() {
    return all('SELECT * FROM makes ORDER BY name')
}

async function getMakeById(id) {
    return get('SELECT * FROM makes WHERE id = ?', [id])
}

async function createMake(name) {
    const slug = name.toLowerCase().replace(/\s+/g, '_')
    const result = await run(
        'INSERT OR IGNORE INTO makes(name, slug) VALUES(?,?)', [name.toUpperCase().trim(), slug]
    )
    return { success: true, id: result.lastID }
}

async function updateMake(id, name) {
    const slug = name.toLowerCase().replace(/\s+/g, '_')
    await run(
        'UPDATE makes SET name = ?, slug = ? WHERE id = ?', [name.toUpperCase().trim(), slug, id]
    )
    return { success: true, id }
}

async function deleteMake(id) {
    // Cascades to models → submodels via ON DELETE CASCADE
    const result = await run('DELETE FROM makes WHERE id = ?', [id])
    return { success: true, changes: result.changes }
}

// ─────────────────────────────────────────────
// MODELS
// ─────────────────────────────────────────────
async function getModelsByMake(makeId) {
    return all(
        'SELECT * FROM models WHERE make_id = ? ORDER BY name', [makeId]
    )
}

async function getModelById(id) {
    return get('SELECT * FROM models WHERE id = ?', [id])
}

async function createModel({ makeId, name, vehicleType = 'car' }) {
    const result = await run(
        'INSERT OR IGNORE INTO models(make_id, name, vehicle_type) VALUES(?,?,?)', [makeId, name.trim(), vehicleType]
    )
    return { success: true, id: result.lastID }
}

async function updateModel(id, { name, vehicleType }) {
    await run(
        'UPDATE models SET name = ?, vehicle_type = ? WHERE id = ?', [name.trim(), vehicleType || 'car', id]
    )
    return { success: true, id }
}

async function deleteModel(id) {
    // Cascades to submodels via ON DELETE CASCADE
    const result = await run('DELETE FROM models WHERE id = ?', [id])
    return { success: true, changes: result.changes }
}

// ─────────────────────────────────────────────
// SUBMODELS
// ─────────────────────────────────────────────
async function getSubmodelsByModel(modelId) {
    return all(
        'SELECT * FROM submodels WHERE model_id = ? ORDER BY name', [modelId]
    )
}

async function getSubmodelById(id) {
    return get('SELECT * FROM submodels WHERE id = ?', [id])
}

async function createSubmodel({
    modelId,
    name,
    parentId = null,
    yearFrom = null,
    yearTo = null,
    engineCc = null,
    powerCv = null,
    fuelType = null,
    gearbox = null,
}) {
    const result = await run(
        `INSERT OR IGNORE INTO submodels
      (model_id, parent_id, name, year_from, year_to, engine_cc, power_cv, fuel_type, gearbox)
     VALUES (?,?,?,?,?,?,?,?,?)`, [modelId, parentId, name.trim(), yearFrom, yearTo, engineCc, powerCv, fuelType, gearbox]
    )
    return { success: true, id: result.lastID }
}

async function updateSubmodel(id, {
    name,
    parentId = null,
    yearFrom = null,
    yearTo = null,
    engineCc = null,
    powerCv = null,
    fuelType = null,
    gearbox = null,
}) {
    await run(
        `UPDATE submodels SET
      name      = ?,
      parent_id = ?,
      year_from = ?,
      year_to   = ?,
      engine_cc = ?,
      power_cv  = ?,
      fuel_type = ?,
      gearbox   = ?
     WHERE id = ?`, [name.trim(), parentId, yearFrom, yearTo, engineCc, powerCv, fuelType, gearbox, id]
    )
    return { success: true, id }
}

async function deleteSubmodel(id) {
    const result = await run('DELETE FROM submodels WHERE id = ?', [id])
    return { success: true, changes: result.changes }
}

// ─────────────────────────────────────────────
module.exports = {
    // Makes
    getAllMakes,
    getMakeById,
    createMake,
    updateMake,
    deleteMake,
    // Models
    getModelsByMake,
    getModelById,
    createModel,
    updateModel,
    deleteModel,
    // Submodels
    getSubmodelsByModel,
    getSubmodelById,
    createSubmodel,
    updateSubmodel,
    deleteSubmodel,
}
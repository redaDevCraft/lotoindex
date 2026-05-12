// @ts-nocheck
const { run, get, all } = require('../db')

async function getAllCars(filters) {
    var sql = `
        SELECT
            cars.*,
            makes.name      AS make_name,
            models.name     AS model_name,
            submodels.name  AS submodel_name
        FROM cars
        LEFT JOIN makes     ON cars.make_id     = makes.id
        LEFT JOIN models    ON cars.model_id    = models.id
        LEFT JOIN submodels ON cars.submodel_id = submodels.id
    `
    var params = []
    var where = []

    if (filters) {
        // ── Make ──────────────────────────────────────────
        // Accept both camelCase (frontend) and snake_case (legacy)
        var makeId = filters.makeId || filters.make_id
        if (makeId) {
            where.push('cars.make_id = ?')
            params.push(makeId)
        }

        // ── Model ─────────────────────────────────────────
        var modelId = filters.modelId || filters.model_id
        if (modelId) {
            where.push('cars.model_id = ?')
            params.push(modelId)
        }

        // ── Submodel ──────────────────────────────────────
        var submodelId = filters.submodelId || filters.submodel_id
        if (submodelId) {
            where.push('cars.submodel_id = ?')
            params.push(submodelId)
        }

        // ── Year range ────────────────────────────────────
        var yearFrom = filters.yearFrom || filters.year_from
        if (yearFrom) {
            where.push('cars.year >= ?')
            params.push(Number(yearFrom))
        }

        var yearTo = filters.yearTo || filters.year_to
        if (yearTo) {
            where.push('cars.year <= ?')
            params.push(Number(yearTo))
        }

        // Exact year (legacy)
        if (filters.year && !yearFrom && !yearTo) {
            where.push('cars.year = ?')
            params.push(filters.year)
        }

        // ── Fuel type ─────────────────────────────────────
        // Accept both 'fuel' (frontend) and 'fuel_type' (legacy)
        var fuel = filters.fuel || filters.fuel_type
        if (fuel) {
            where.push('cars.fuel_type = ?')
            params.push(fuel)
        }

        // ── Gearbox ───────────────────────────────────────
        var gearbox = filters.gearbox
        if (gearbox) {
            where.push('cars.gearbox = ?')
            params.push(gearbox)
        }

        // ── Power range ───────────────────────────────────
        var powerMin = filters.powerMin || filters.power_min
        if (powerMin) {
            where.push('cars.power_cv >= ?')
            params.push(Number(powerMin))
        }

        var powerMax = filters.powerMax || filters.power_max
        if (powerMax) {
            where.push('cars.power_cv <= ?')
            params.push(Number(powerMax))
        }

        // ── Mileage max ───────────────────────────────────
        var mileageMax = filters.mileageMax || filters.mileage_max
        if (mileageMax) {
            where.push('cars.mileage_km <= ?')
            params.push(Number(mileageMax))
        }

        // ── Full-text search ──────────────────────────────
        // Accept both 'text' (frontend) and 'query' (legacy)
        var text = filters.text || filters.query
        if (text && text.trim() !== '') {
            var q = '%' + text.trim() + '%'
            where.push(`(
                makes.name          LIKE ? OR
                models.name         LIKE ? OR
                submodels.name      LIKE ? OR
                cars.vin            LIKE ? OR
                cars.registration   LIKE ? OR
                cars.engine_code    LIKE ? OR
                cars.folder_ref     LIKE ? OR
                CAST(cars.year AS TEXT) LIKE ?
            )`)
            params.push(q, q, q, q, q, q, q, q)
        }
    }

    if (where.length > 0) sql += ' WHERE ' + where.join(' AND ')
    sql += ' ORDER BY cars.id DESC'
    return await all(sql, params)
}

async function getCarById(id) {
    return await get(
        `SELECT
            cars.*,
            makes.name      AS make_name,
            models.name     AS model_name,
            submodels.name  AS submodel_name
        FROM cars
        LEFT JOIN makes     ON cars.make_id     = makes.id
        LEFT JOIN models    ON cars.model_id    = models.id
        LEFT JOIN submodels ON cars.submodel_id = submodels.id
        WHERE cars.id = ?`, [id]
    )
}

async function createCar(data) {
    var result = await run(
        `INSERT INTO cars
            (make_id, model_id, submodel_id, year, vin, registration, reg_date,
             fuel_type, power_cv, mileage_km, displacement_cc, engine_code,
             gearbox, internal_type, folder_ref)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
            data.make_id || null,
            data.model_id || null,
            data.submodel_id || null,
            data.year || null,
            data.vin || null,
            data.registration || null,
            data.reg_date || null,
            data.fuel_type || null,
            data.power_cv || null,
            data.mileage_km || null,
            data.displacement_cc || null,
            data.engine_code || null,
            data.gearbox || null,
            data.internal_type || null,
            data.folder_ref || null,
        ]
    )
    return result.lastID
}

async function updateCar(id, data) {
    await run(
        `UPDATE cars SET
            make_id=?, model_id=?, submodel_id=?, year=?, vin=?, registration=?,
            reg_date=?, fuel_type=?, power_cv=?, mileage_km=?, displacement_cc=?,
            engine_code=?, gearbox=?, internal_type=?, folder_ref=?
         WHERE id=?`, [
            data.make_id || null,
            data.model_id || null,
            data.submodel_id || null,
            data.year || null,
            data.vin || null,
            data.registration || null,
            data.reg_date || null,
            data.fuel_type || null,
            data.power_cv || null,
            data.mileage_km || null,
            data.displacement_cc || null,
            data.engine_code || null,
            data.gearbox || null,
            data.internal_type || null,
            data.folder_ref || null,
            id,
        ]
    )
}

async function deleteCar(id) {
    await run('DELETE FROM car_attributes WHERE car_id = ?', [id])
    await run('DELETE FROM cars_fts WHERE car_id = ?', [id])
    await run('DELETE FROM cars WHERE id = ?', [id])
}

async function deleteCars(ids) {
    if (!ids || ids.length === 0) return
    for (var i = 0; i < ids.length; i++) {
        await deleteCar(ids[i])
    }
}

// searchCars is just getAllCars — filters handled there
async function searchCars(filters) {
    return await getAllCars(filters)
}

module.exports = { getAllCars, getCarById, createCar, updateCar, deleteCar, deleteCars, searchCars }
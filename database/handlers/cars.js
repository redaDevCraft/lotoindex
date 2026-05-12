// @ts-nocheck
const { run, get, all } = require('../db')

async function getAllCars(filters) {
    var sql = 'SELECT cars.*, makes.name AS make_name, models.name AS model_name FROM cars LEFT JOIN makes ON cars.make_id = makes.id LEFT JOIN models ON cars.model_id = models.id'
    var params = []
    var where = []

    if (filters) {
        if (filters.make_id) {
            where.push('cars.make_id = ?');
            params.push(filters.make_id)
        }
        if (filters.model_id) {
            where.push('cars.model_id = ?');
            params.push(filters.model_id)
        }
        if (filters.year) {
            where.push('cars.year = ?');
            params.push(filters.year)
        }
        if (filters.fuel_type) {
            where.push('cars.fuel_type = ?');
            params.push(filters.fuel_type)
        }
        if (filters.query) {
            where.push('(makes.name LIKE ? OR models.name LIKE ? OR cars.vin LIKE ? OR cars.registration LIKE ?)')
            var q = '%' + filters.query + '%'
            params.push(q, q, q, q)
        }
    }

    if (where.length > 0) sql += ' WHERE ' + where.join(' AND ')
    sql += ' ORDER BY cars.id DESC'
    return await all(sql, params)
}

async function getCarById(id) {
    return await get(
        'SELECT cars.*, makes.name AS make_name, models.name AS model_name FROM cars LEFT JOIN makes ON cars.make_id = makes.id LEFT JOIN models ON cars.model_id = models.id WHERE cars.id = ?', [id]
    )
}

async function createCar(data) {
    var result = await run(
        'INSERT INTO cars (make_id,model_id,year,vin,registration,reg_date,fuel_type,power_cv,mileage_km,displacement_cc,engine_code,gearbox,internal_type,folder_ref) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', [data.make_id || null, data.model_id || null, data.year || null, data.vin || null, data.registration || null, data.reg_date || null, data.fuel_type || null, data.power_cv || null, data.mileage_km || null, data.displacement_cc || null, data.engine_code || null, data.gearbox || null, data.internal_type || null, data.folder_ref || null]
    )
    return result.lastID
}

async function updateCar(id, data) {
    await run(
        'UPDATE cars SET make_id=?,model_id=?,year=?,vin=?,registration=?,reg_date=?,fuel_type=?,power_cv=?,mileage_km=?,displacement_cc=?,engine_code=?,gearbox=?,internal_type=?,folder_ref=? WHERE id=?', [data.make_id || null, data.model_id || null, data.year || null, data.vin || null, data.registration || null, data.reg_date || null, data.fuel_type || null, data.power_cv || null, data.mileage_km || null, data.displacement_cc || null, data.engine_code || null, data.gearbox || null, data.internal_type || null, data.folder_ref || null, id]
    )
}

async function deleteCar(id) {
    await run('DELETE FROM car_attributes WHERE car_id = ?', [id])
    await run('DELETE FROM cars_fts WHERE car_id = ?', [id])
    await run('DELETE FROM cars WHERE id = ?', [id])
}

async function searchCars(filters) { return await getAllCars(filters) }

module.exports = { getAllCars, getCarById, createCar, updateCar, deleteCar, searchCars }
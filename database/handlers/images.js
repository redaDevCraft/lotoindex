// @ts-nocheck
const { run, get, all } = require('../db')
const { app, dialog } = require('electron')
const path = require('path')
const fs = require('fs')

function getImagesDir(carId) {
    var dir = path.join(app.getPath('userData'), 'car-images', String(carId))
    fs.mkdirSync(dir, { recursive: true })
    return dir
}

async function pickImages(win) {
    var result = await dialog.showOpenDialog(win, {
        title: 'Sélectionner des images',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'tiff', 'avif'] }]
    })
    if (result.canceled) return []
    return result.filePaths
}

async function uploadImages(carId, filePaths) {
    var dir = getImagesDir(carId)
    var results = []

    var maxRow = await get('SELECT MAX(sort_order) as m FROM car_images WHERE car_id=?', [carId])
    var order = (maxRow && maxRow.m !== null) ? maxRow.m + 1 : 0

    var hasPrimary = await get('SELECT id FROM car_images WHERE car_id=? AND is_primary=1', [carId])

    for (var i = 0; i < filePaths.length; i++) {
        var srcPath = filePaths[i]
        var ext = path.extname(srcPath).toLowerCase()
        var filename = Date.now() + '_' + i + ext
        var destPath = path.join(dir, filename)

        fs.copyFileSync(srcPath, destPath)

        var isPrimary = (!hasPrimary && i === 0) ? 1 : 0

        var row = await run(
            'INSERT INTO car_images (car_id, filepath, is_primary, sort_order) VALUES (?,?,?,?)', [carId, destPath, isPrimary, order + i]
        )
        results.push({ id: row.lastID, filepath: destPath, is_primary: isPrimary, sort_order: order + i })
        if (isPrimary) hasPrimary = true
    }

    return results
}

async function getCarImages(carId) {
    var rows = await all(
        'SELECT * FROM car_images WHERE car_id=? ORDER BY sort_order ASC, id ASC', [carId]
    )
    return rows.map(function(r) {
        return Object.assign({}, r, { url: 'carimg://' + encodeURIComponent(r.filepath) })
    })
}

async function setCover(carId, imageId) {
    await run('UPDATE car_images SET is_primary=0 WHERE car_id=?', [carId])
    await run('UPDATE car_images SET is_primary=1 WHERE id=? AND car_id=?', [imageId, carId])
    return { success: true }
}

async function deleteImage(imageId) {
    var row = await get('SELECT * FROM car_images WHERE id=?', [imageId])
    if (!row) return { success: false, error: 'Not found' }

    try { fs.unlinkSync(row.filepath) } catch (e) {}

    await run('DELETE FROM car_images WHERE id=?', [imageId])

    if (row.is_primary) {
        var next = await get(
            'SELECT id FROM car_images WHERE car_id=? ORDER BY sort_order ASC, id ASC LIMIT 1', [row.car_id]
        )
        if (next) await run('UPDATE car_images SET is_primary=1 WHERE id=?', [next.id])
    }

    return { success: true }
}

async function deleteAllCarImages(carId) {
    var rows = await all('SELECT filepath FROM car_images WHERE car_id=?', [carId])
    rows.forEach(function(r) { try { fs.unlinkSync(r.filepath) } catch (e) {} })
    try {
        var dir = path.join(app.getPath('userData'), 'car-images', String(carId))
        fs.rmdirSync(dir)
    } catch (e) {}
    await run('DELETE FROM car_images WHERE car_id=?', [carId])
    return { success: true }
}

async function reorderImages(updates) {
    for (var i = 0; i < updates.length; i++) {
        await run('UPDATE car_images SET sort_order=? WHERE id=?', [updates[i].sort_order, updates[i].id])
    }
    return { success: true }
}

module.exports = { pickImages, uploadImages, getCarImages, setCover, deleteImage, deleteAllCarImages, reorderImages }
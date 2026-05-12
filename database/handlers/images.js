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
        filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'avif'] }]
    })
    return result.canceled ? [] : result.filePaths
}

async function previewImages(filePaths) {
    return filePaths.map(function(fp) {
        var ext = path.extname(fp).toLowerCase().replace('.', '')
        var mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'gif' ? 'image/gif' : 'image/jpeg'
        var data = fs.readFileSync(fp)
        return 'data:' + mime + ';base64,' + data.toString('base64')
    })
}

async function uploadImages(carId, filePaths) {
    var dir = getImagesDir(carId)
    var maxRow = await get('SELECT MAX(sort_order) as m FROM car_images WHERE car_id=?', [carId])
    var order = (maxRow && maxRow.m !== null) ? maxRow.m + 1 : 0
    var results = []
    for (var i = 0; i < filePaths.length; i++) {
        var ext = path.extname(filePaths[i]).toLowerCase()
        var filename = Date.now() + '_' + i + ext
        var destPath = path.join(dir, filename)
        fs.copyFileSync(filePaths[i], destPath)
        var row = await run(
            'INSERT INTO car_images (car_id, filepath, sort_order) VALUES (?,?,?)', [carId, destPath, order + i]
        )
        results.push({ id: row.lastID, filepath: destPath })
    }
    return results
}

async function getCarImages(carId) {
    var rows = await all(
        'SELECT * FROM car_images WHERE car_id=? ORDER BY sort_order ASC, id ASC', [carId])
    return rows.map(function(r) {
        try {
            var ext = path.extname(r.filepath).toLowerCase().replace('.', '')
            var mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
            var data = fs.readFileSync(r.filepath)
            return Object.assign({}, r, { previewUrl: 'data:' + mime + ';base64,' + data.toString('base64') })
        } catch (e) {
            return Object.assign({}, r, { previewUrl: '' })
        }
    })
}

async function deleteImage(imageId) {
    var row = await get('SELECT * FROM car_images WHERE id=?', [imageId])
    if (!row) return { success: false }
    try { fs.unlinkSync(row.filepath) } catch (e) {}
    await run('DELETE FROM car_images WHERE id=?', [imageId])
    return { success: true }
}

async function deleteAllCarImages(carId) {
    var rows = await all('SELECT filepath FROM car_images WHERE car_id=?', [carId])
    rows.forEach(function(r) { try { fs.unlinkSync(r.filepath) } catch (e) {} })
    try { fs.rmdirSync(path.join(app.getPath('userData'), 'car-images', String(carId))) } catch (e) {}
    await run('DELETE FROM car_images WHERE car_id=?', [carId])
    return { success: true }
}

module.exports = { pickImages, previewImages, uploadImages, getCarImages, deleteImage, deleteAllCarImages }
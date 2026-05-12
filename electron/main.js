// @ts-nocheck
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { initDB } = require('../database/db')
const { seedDatabase } = require('../database/seed')
const carHandlers = require('../database/handlers/cars')
const makesHandlers = require('../database/handlers/makes')
const exportHandlers = require('../database/handlers/exports')
const imageHandlers = require('../database/handlers/images')
const { protocol } = require('electron')



function createWindow() {
    var win = new BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 900,
        minHeight: 600,
        show: false, // wait for ready-to-show
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    })

    win.once('ready-to-show', function() {
        win.maximize() // fills screen on launch
        win.show()
    })

    if (!app.isPackaged) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, '../renderer/dist/index.html'))
    }
}

app.whenReady().then(async function() {
    await initDB()
    await seedDatabase()
    setupIPC()
    createWindow()
    protocol.registerFileProtocol('carimg', (request, callback) => {
        const url = request.url.replace('carimg://', '')
        callback(decodeURIComponent(url))
    })
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

function setupIPC() {
    // Cars — from cars.js
    ipcMain.handle('cars:getAll', async function(e, filters) { return await carHandlers.getAllCars(filters) })
    ipcMain.handle('cars:getById', async function(e, id) { return await carHandlers.getCarById(id) })
    ipcMain.handle('cars:create', async function(e, data) { return await carHandlers.createCar(data) })
    ipcMain.handle('cars:update', async function(e, id, data) { return await carHandlers.updateCar(id, data) })
    ipcMain.handle('cars:delete', async function(e, id) {
        await imageHandlers.deleteAllCarImages(id) // ← clean images first
        return await carHandlers.deleteCar(id)
    })
    ipcMain.handle('cars:deleteCars', async function(e, ids) {
        for (var i = 0; i < ids.length; i++) {
            await imageHandlers.deleteAllCarImages(ids[i]) // ← clean images first
            await carHandlers.deleteCar(ids[i])
        }
    })
    ipcMain.handle('cars:search', async function(e, filters) { return await carHandlers.searchCars(filters) })

    // Makes — from makes.js
    ipcMain.handle('makes:getAll', async function() { return await makesHandlers.getAllMakes() })
    ipcMain.handle('makes:getById', async function(e, id) { return await makesHandlers.getMakeById(id) })
    ipcMain.handle('makes:create', async function(e, name) { return await makesHandlers.createMake(name) })
    ipcMain.handle('makes:update', async function(e, id, name) { return await makesHandlers.updateMake(id, name) })
    ipcMain.handle('makes:delete', async function(e, id) { return await makesHandlers.deleteMake(id) })

    // Models — from makes.js
    ipcMain.handle('models:getByMake', async function(e, makeId) { return await makesHandlers.getModelsByMake(makeId) })
    ipcMain.handle('models:getById', async function(e, id) { return await makesHandlers.getModelById(id) })
    ipcMain.handle('models:create', async function(e, data) { return await makesHandlers.createModel(data) })
    ipcMain.handle('models:update', async function(e, id, data) { return await makesHandlers.updateModel(id, data) })
    ipcMain.handle('models:delete', async function(e, id) { return await makesHandlers.deleteModel(id) })

    // Submodels — from makes.js
    ipcMain.handle('submodels:getByModel', async function(e, modelId) { return await makesHandlers.getSubmodelsByModel(modelId) })
    ipcMain.handle('submodels:getById', async function(e, id) { return await makesHandlers.getSubmodelById(id) })
    ipcMain.handle('submodels:create', async function(e, data) { return await makesHandlers.createSubmodel(data) })
    ipcMain.handle('submodels:update', async function(e, id, data) { return await makesHandlers.updateSubmodel(id, data) })
    ipcMain.handle('submodels:delete', async function(e, id) { return await makesHandlers.deleteSubmodel(id) })


    // Export
    ipcMain.handle('export:pdf', async function(e, ids) {
            try {
                var win = BrowserWindow.fromWebContents(e.sender)
                return await exportHandlers.exportPDF(win, ids)
            } catch (err) {
                console.error('[export:pdf] CRASH:', err)
                return { success: false, error: String(err.message || err) }
            }
        })
        // ── Images ────────────────────────────────────────────
    ipcMain.handle('images:pick', async function() { return await imageHandlers.pickImages(BrowserWindow.getFocusedWindow()) })
    ipcMain.handle('images:upload', async function(e, carId, paths) { return await imageHandlers.uploadImages(carId, paths) })
    ipcMain.handle('images:getAll', async function(e, carId) { return await imageHandlers.getCarImages(carId) })
    ipcMain.handle('images:setCover', async function(e, carId, imgId) { return await imageHandlers.setCover(carId, imgId) })
    ipcMain.handle('images:delete', async function(e, imgId) { return await imageHandlers.deleteImage(imgId) })
    ipcMain.handle('images:deleteAll', async function(e, carId) { return await imageHandlers.deleteAllCarImages(carId) })
    ipcMain.handle('images:reorder', async function(e, updates) { return await imageHandlers.reorderImages(updates) })
    ipcMain.handle('images:preview', async function(e, paths) { return await imageHandlers.previewImages(paths) })

}
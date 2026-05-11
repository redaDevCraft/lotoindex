// @ts-nocheck
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { initDB } = require('./../db.js')
const { seedDatabase } = require('./../seed')
const carHandlers = require('./../handlers/cars.js')
const importHandlers = require('./../handlers/imports')
const exportHandlers = require('./../handlers/exports')

function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    })

    if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, '../renderer/dist/index.html'))
    }
}

app.whenReady().then(async function() {

    await seedDatabase()
    setupIPC()
    createWindow()
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

function setupIPC() {
    // ── Cars ──────────────────────────────────────────────
    ipcMain.handle('cars:getAll', async function(e, filters) {
        return await carHandlers.getAllCars(filters)
    })
    ipcMain.handle('cars:getById', async function(e, id) {
        return await carHandlers.getCarById(id)
    })
    ipcMain.handle('cars:create', async function(e, data) {
        return await carHandlers.createCar(data)
    })
    ipcMain.handle('cars:update', async function(e, id, data) {
        return await carHandlers.updateCar(id, data)
    })
    ipcMain.handle('cars:delete', async function(e, id) {
        return await carHandlers.deleteCar(id)
    })
    ipcMain.handle('cars:search', async function(e, filters) {
        return await carHandlers.searchCars(filters)
    })

    // ── Makes & Models ────────────────────────────────────
    ipcMain.handle('makes:getAll', async function() {
        return await carHandlers.getMakes()
    })
    ipcMain.handle('models:getByMake', async function(e, makeId) {
        return await carHandlers.getModels(makeId)
    })
    ipcMain.handle('submodels:getByModel', async function(e, modelId) {
        return await carHandlers.getSubmodels(modelId)
    })

    // ── Import ────────────────────────────────────────────
    ipcMain.handle('import:pickCSV', async function(e) {
        const win = BrowserWindow.getFocusedWindow()
        return await importHandlers.pickCSV(win)
    })
    ipcMain.handle('import:previewCSV', async function(e, filePath) {
        return await importHandlers.previewCSV(filePath)
    })
    ipcMain.handle('import:importCSV', async function(e, filePath, mapping) {
        return await importHandlers.importCSV(filePath, mapping)
    })

    // ── Export ────────────────────────────────────────────
    ipcMain.handle('export:pdf', async function(e, ids) {
        const win = BrowserWindow.getFocusedWindow()
        return await exportHandlers.exportPDF(win, ids)
    })
    ipcMain.handle('export:excel', async function(e, ids) {
        const win = BrowserWindow.getFocusedWindow()
        return await exportHandlers.exportExcel(win, ids)
    })
}
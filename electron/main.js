// @ts-nocheck
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { initDB } = require('../database/db.js')
const { seedDatabase } = require('../database/seed.js')
const carHandlers = require('..//database/handlers/cars.js')
const importHandlers = require('../database/handlers/imports.js')
const exportHandlers = require('..//database/handlers/exports.js')

function createWindow() {
    var win = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    })

    if (!app.isPackaged) {
        win.loadURL('http://localhost:5173')
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, '../renderer/dist/index.html'))
    }
}

app.whenReady().then(function() {
    initDB() // ← sync, just runs schema
    seedDatabase() // ← sync, inserts makes/models/submodels once
    setupIPC()
    createWindow()
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') app.quit()
})

function setupIPC() {
    ipcMain.handle('cars:getAll', function(e, filters) { return carHandlers.getAllCars(filters) })
    ipcMain.handle('cars:getById', function(e, id) { return carHandlers.getCarById(id) })
    ipcMain.handle('cars:create', function(e, data) { return carHandlers.createCar(data) })
    ipcMain.handle('cars:update', function(e, id, data) { return carHandlers.updateCar(id, data) })
    ipcMain.handle('cars:delete', function(e, id) { return carHandlers.deleteCar(id) })
    ipcMain.handle('cars:search', function(e, filters) { return carHandlers.searchCars(filters) })
    ipcMain.handle('makes:getAll', function() { return carHandlers.getMakes() })
    ipcMain.handle('models:getByMake', function(e, makeId) { return carHandlers.getModels(makeId) })
    ipcMain.handle('submodels:getByModel', function(e, modelId) { return carHandlers.getSubmodels(modelId) })

    ipcMain.handle('import:pickCSV', function(e) { return importHandlers.pickCSV(BrowserWindow.getFocusedWindow()) })
    ipcMain.handle('import:previewCSV', function(e, filePath) { return importHandlers.previewCSV(filePath) })
    ipcMain.handle('import:importCSV', function(e, filePath, mapping) { return importHandlers.importCSV(filePath, mapping) })

    ipcMain.handle('export:pdf', function(e, ids) { return exportHandlers.exportPDF(BrowserWindow.getFocusedWindow(), ids) })
    ipcMain.handle('export:excel', function(e, ids) { return exportHandlers.exportExcel(BrowserWindow.getFocusedWindow(), ids) })
}
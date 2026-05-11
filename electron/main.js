const { seedDatabase } = require('../database/seed.js')
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { initDB } = require('../database/schema')
const carHandlers = require('../database/handlers/cars.js')
const makeHandlers = require('../database/handlers/makes.js')
const exportHandlers = require('../database/handlers/exports.js')
const importHandlers = require('../database/handlers/imports.js')

let win

async function createWindow() {
    await initDB()

    win = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1024,
        minHeight: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false
        },
        titleBarStyle: 'hiddenInset',
        show: false
    })

    win.once('ready-to-show', () => win.show())

    // ── Makes / Models / Submodels ─────────────────────────
    ipcMain.handle('makes:getAll', () => makeHandlers.getAllMakes())
    ipcMain.handle('makes:create', (_, name) => makeHandlers.createMake(name))
    ipcMain.handle('models:getByMake', (_, makeId) => makeHandlers.getModelsByMake(makeId))
    ipcMain.handle('models:create', (_, data) => makeHandlers.createModel(data))
    ipcMain.handle('submodels:getByModel', (_, modelId) => makeHandlers.getSubmodelsByModel(modelId))
    ipcMain.handle('submodels:create', (_, data) => makeHandlers.createSubmodel(data))

    // ── Cars CRUD ──────────────────────────────────────────
    ipcMain.handle('cars:search', (_, filters) => carHandlers.searchCars(filters))
    ipcMain.handle('cars:getAll', () => carHandlers.getAllCars())
    ipcMain.handle('cars:getById', (_, id) => carHandlers.getCarById(id))
    ipcMain.handle('cars:create', (_, data) => carHandlers.createCar(data))
    ipcMain.handle('cars:update', (_, id, data) => carHandlers.updateCar(id, data))
    ipcMain.handle('cars:delete', (_, id) => carHandlers.deleteCar(id))

    // ── Images ─────────────────────────────────────────────
    ipcMain.handle('images:add', (_, carId, filePaths) => carHandlers.addImages(carId, filePaths))
    ipcMain.handle('images:delete', (_, imageId) => carHandlers.deleteImage(imageId))
    ipcMain.handle('images:getByCard', (_, carId) => carHandlers.getImagesByCar(carId))

    // ── Export ─────────────────────────────────────────────
    ipcMain.handle('export:pdf', (_, ids) => exportHandlers.exportPDF(ids, win))
    ipcMain.handle('export:excel', (_, ids) => exportHandlers.exportExcel(ids, win))

    // ── Import CSV ─────────────────────────────────────────
    ipcMain.handle('import:csv:pick', () => importHandlers.pickCSV(win))
    ipcMain.handle('import:csv:preview', (_, filePath) => importHandlers.previewCSV(filePath))
    ipcMain.handle('import:csv:import', (_, filePath, mapping) => importHandlers.importCSV(filePath, mapping))

    win.loadURL('http://localhost:5173/')
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit() })
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('db', {
    // Makes / Models / Submodels
    getMakes: () => ipcRenderer.invoke('makes:getAll'),
    createMake: (name) => ipcRenderer.invoke('makes:create', name),
    getModels: (makeId) => ipcRenderer.invoke('models:getByMake', makeId),
    createModel: (data) => ipcRenderer.invoke('models:create', data),
    getSubmodels: (modelId) => ipcRenderer.invoke('submodels:getByModel', modelId),
    createSubmodel: (data) => ipcRenderer.invoke('submodels:create', data),

    // Cars
    searchCars: (filters) => ipcRenderer.invoke('cars:search', filters),
    getAllCars: () => ipcRenderer.invoke('cars:getAll'),
    getCarById: (id) => ipcRenderer.invoke('cars:getById', id),
    createCar: (data) => ipcRenderer.invoke('cars:create', data),
    updateCar: (id, data) => ipcRenderer.invoke('cars:update', id, data),
    deleteCar: (id) => ipcRenderer.invoke('cars:delete', id),

    // Images
    addImages: (carId, paths) => ipcRenderer.invoke('images:add', carId, paths),
    deleteImage: (id) => ipcRenderer.invoke('images:delete', id),
    getImages: (carId) => ipcRenderer.invoke('images:getByCard', carId),

    // Export
    exportPDF: (ids) => ipcRenderer.invoke('export:pdf', ids),
    exportExcel: (ids) => ipcRenderer.invoke('export:excel', ids),

    // Import CSV
    pickCSV: () => ipcRenderer.invoke('import:csv:pick'),
    previewCSV: (path) => ipcRenderer.invoke('import:csv:preview', path),
    importCSV: (path, map) => ipcRenderer.invoke('import:csv:import', path, map),
})
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('db', {
    // Cars
    getAllCars: function(filters) { return ipcRenderer.invoke('cars:getAll', filters) },
    getCarById: function(id) { return ipcRenderer.invoke('cars:getById', id) },
    createCar: function(data) { return ipcRenderer.invoke('cars:create', data) },
    updateCar: function(id, data) { return ipcRenderer.invoke('cars:update', id, data) },
    deleteCar: function(id) { return ipcRenderer.invoke('cars:delete', id) },
    searchCars: function(filters) { return ipcRenderer.invoke('cars:search', filters) },

    // Makes & Models
    getMakes: function() { return ipcRenderer.invoke('makes:getAll') },
    getModels: function(makeId) { return ipcRenderer.invoke('models:getByMake', makeId) },
    getSubmodels: function(modelId) { return ipcRenderer.invoke('submodels:getByModel', modelId) },

    // Import
    pickCSV: function() { return ipcRenderer.invoke('import:pickCSV') },
    previewCSV: function(filePath) { return ipcRenderer.invoke('import:previewCSV', filePath) },
    importCSV: function(filePath, mapping) { return ipcRenderer.invoke('import:importCSV', filePath, mapping) },

    // Export
    exportPDF: function(ids) { return ipcRenderer.invoke('export:pdf', ids) },
    exportExcel: function(ids) { return ipcRenderer.invoke('export:excel', ids) },

    // Images
    pickImages: function() { return ipcRenderer.invoke('images:pick') },
    uploadImages: function(carId, paths) { return ipcRenderer.invoke('images:upload', carId, paths) },
    getCarImages: function(carId) { return ipcRenderer.invoke('images:getAll', carId) },
    setCoverImage: function(carId, imgId) { return ipcRenderer.invoke('images:setCover', carId, imgId) },
    deleteImage: function(imgId) { return ipcRenderer.invoke('images:delete', imgId) },
    deleteAllImages: function(carId) { return ipcRenderer.invoke('images:deleteAll', carId) },
    reorderImages: function(updates) { return ipcRenderer.invoke('images:reorder', updates) },
})
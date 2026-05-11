const { dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const PDFDocument = require('pdfkit')
const ExcelJS = require('exceljs')
const { all, get } = require('../db')

async function getFullCar(id) {
    const car = await get(`
    SELECT c.*, mk.name AS make_name, mo.name AS model_name, sm.name AS submodel_name
    FROM cars c
    LEFT JOIN makes    mk ON c.make_id=mk.id
    LEFT JOIN models   mo ON c.model_id=mo.id
    LEFT JOIN submodels sm ON c.submodel_id=sm.id
    WHERE c.id=?`, [id])
    car.attributes = await all('SELECT key,value FROM car_attributes WHERE car_id=?', [id])
    car.images = await all('SELECT * FROM car_images WHERE car_id=? ORDER BY sort_order', [id])
    return car
}

async function exportPDF(ids, win) {
    const { filePath } = await dialog.showSaveDialog(win, {
        title: 'Exporter PDF',
        defaultPath: `fiches_techniques_${Date.now()}.pdf`,
        filters: [{ name: 'PDF', extensions: ['pdf'] }]
    })
    if (!filePath) return { cancelled: true }

    const doc = new PDFDocument({ margin: 40, size: 'A4' })
    doc.pipe(fs.createWriteStream(filePath))

    for (let i = 0; i < ids.length; i++) {
        const car = await getFullCar(ids[i])
        if (i > 0) doc.addPage()

        // Header
        doc.fontSize(18).font('Helvetica-Bold')
            .text('FICHE TECHNIQUE VÉHICULE', { align: 'center' })
        doc.moveDown(0.5)
        doc.fontSize(14).text(`${car.make_name} ${car.model_name} ${car.submodel_name || ''}`, { align: 'center' })
        doc.moveDown()

        // Separator
        doc.moveTo(40, doc.y).lineTo(555, doc.y).stroke()
        doc.moveDown(0.5)

        // Fields
        const fields = [
            ['Marque', car.make_name],
            ['Modèle', car.model_name],
            ['Sous-modèle', car.submodel_name],
            ['Année', car.year],
            ['VIN', car.vin],
            ['Immatriculation', car.registration],
            ['Date immat.', car.reg_date],
            ['Énergie', car.fuel_type],
            ['Puissance', car.power_cv ? `${car.power_cv} cv` : ''],
            ['Kilométrage', car.mileage_km ? `${car.mileage_km} km` : ''],
            ['Cylindrée', car.displacement_cc ? `${car.displacement_cc} cc` : ''],
            ['Moteur', car.engine_code],
            ['Boîte', car.gearbox],
            ['N° Dossier', car.folder_ref],
            ['Notes', car.notes],
        ]

        doc.fontSize(10).font('Helvetica')
        fields.forEach(([label, val]) => {
            if (!val) return
            doc.font('Helvetica-Bold').text(`${label}: `, { continued: true })
                .font('Helvetica').text(String(val))
        })

        // Dynamic attributes
        if (car.attributes && car.attributes.length > 0) {
            doc.moveDown()
            doc.font('Helvetica-Bold').fontSize(11).text('Attributs supplémentaires:')
            doc.font('Helvetica').fontSize(10)
            car.attributes.forEach(({ key, value }) => {
                doc.font('Helvetica-Bold').text(`${key}: `, { continued: true })
                    .font('Helvetica').text(String(value))
            })
        }
    }

    doc.end()
    return { success: true, filePath }
}

async function exportExcel(ids, win) {
    const { filePath } = await dialog.showSaveDialog(win, {
        title: 'Exporter Excel',
        defaultPath: `voitures_${Date.now()}.xlsx`,
        filters: [{ name: 'Excel', extensions: ['xlsx'] }]
    })
    if (!filePath) return { cancelled: true }

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Véhicules')

    worksheet.columns = [
        { header: 'ID', key: 'id', width: 8 },
        { header: 'Marque', key: 'make_name', width: 15 },
        { header: 'Modèle', key: 'model_name', width: 15 },
        { header: 'Sous-modèle', key: 'submodel_name', width: 20 },
        { header: 'Année', key: 'year', width: 8 },
        { header: 'VIN', key: 'vin', width: 20 },
        { header: 'Immatriculation', key: 'registration', width: 15 },
        { header: 'Énergie', key: 'fuel_type', width: 12 },
        { header: 'Puissance (cv)', key: 'power_cv', width: 14 },
        { header: 'Kilométrage', key: 'mileage_km', width: 14 },
        { header: 'Cylindrée (cc)', key: 'displacement_cc', width: 14 },
        { header: 'Moteur', key: 'engine_code', width: 15 },
        { header: 'Boîte', key: 'gearbox', width: 12 },
        { header: 'N° Dossier', key: 'folder_ref', width: 12 },
    ]

    // Style header row
    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } }
    worksheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A5F' } }

    for (const id of ids) {
        const car = await getFullCar(id)
        worksheet.addRow(car)
    }

    await workbook.xlsx.writeFile(filePath)
    return { success: true, filePath }
}

module.exports = { exportPDF, exportExcel }
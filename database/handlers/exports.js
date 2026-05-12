// @ts-nocheck
'use strict'

const { dialog } = require('electron')
const fs = require('fs')
const PDFDocument = require('pdfkit')
const { all, get } = require('../db')

// ── Palette ────────────────────────────────────────────────────────────────────
const C = {
    black: '#0f172a',
    dark: '#1e293b',
    mid: '#475569',
    light: '#94a3b8',
    border: '#e2e8f0',
    bg: '#f8fafc',
    white: '#ffffff',
    accent: '#2563eb',
    accentL: '#eff6ff',
}

// ── Page constants ─────────────────────────────────────────────────────────────
const PW = 595 // A4 width  @ 72dpi
const PH = 841 // A4 height @ 72dpi
const ML = 48 // left margin
const MR = 48 // right margin
const CW = PW - ML - MR // content width = 499
const BOTTOM = PH - 48 // lowest Y before footer

// ── DB ─────────────────────────────────────────────────────────────────────────
async function getFullCar(id) {
    var car = await get(`
        SELECT c.*, mk.name AS make_name, mo.name AS model_name, sm.name AS submodel_name
        FROM cars c
        LEFT JOIN makes     mk ON c.make_id     = mk.id
        LEFT JOIN models    mo ON c.model_id    = mo.id
        LEFT JOIN submodels sm ON c.submodel_id = sm.id
        WHERE c.id = ?`, [id])
    if (!car) return null
    car.attributes = await all('SELECT key, value FROM car_attributes WHERE car_id = ?', [id])
    car.images = await all('SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order ASC, id ASC', [id])
    return car
}

function carLabel(car) {
    return [car.make_name, car.model_name, car.submodel_name, car.year]
        .filter(Boolean).join(' · ') || 'Véhicule sans nom'
}

// ── Space guard ────────────────────────────────────────────────────────────────
function need(doc, h, car) {
    if (doc.y + h > BOTTOM) {
        doc.addPage()
        doc.y = 40
            // Thin top rule on continuation page
        doc.moveTo(ML, doc.y).lineTo(PW - MR, doc.y)
            .lineWidth(0.5).strokeColor(C.border).stroke()
        doc.y += 10
            // Continuation label
        doc.fillColor(C.light).fontSize(7.5).font('Helvetica')
            .text(carLabel(car).toUpperCase() + '  (suite)', ML, doc.y, { lineBreak: false })
        doc.y += 14
    }
}

// ── Footer stamp (runs after all pages drawn) ──────────────────────────────────
function stampFooters(doc, total) {
    var range = doc.bufferedPageRange()
    for (var i = 0; i < range.count; i++) {
        doc.switchToPage(range.start + i)
        var fy = PH - 30
            // bottom rule
        doc.moveTo(ML, fy).lineTo(PW - MR, fy)
            .lineWidth(0.5).strokeColor(C.border).stroke()
        doc.fillColor(C.light).fontSize(7.5).font('Helvetica')
            .text('LotoIndex', ML, fy + 8, { lineBreak: false, continued: true })
            .text(
                'Page ' + (i + 1) + ' / ' + total + '   ·   ' + new Date().toLocaleDateString('fr-FR'), { align: 'right', lineBreak: false }
            )
    }
}

// ── Car cover page header ──────────────────────────────────────────────────────
function drawCarHeader(doc, car) {
    // Full-width accent top bar (thin)
    doc.rect(0, 0, PW, 6).fill(C.accent)

    // Breadcrumb
    doc.y = 22
    doc.fillColor(C.light).fontSize(8).font('Helvetica')
        .text('LOTOINDEX  /  FICHE VÉHICULE', ML, doc.y, { lineBreak: false })
    doc.y += 18

    // Big car name
    var make = (car.make_name || '').toUpperCase()
    var model = [car.model_name, car.submodel_name, car.year].filter(Boolean).join('  ·  ')

    doc.fillColor(C.black).fontSize(26).font('Helvetica-Bold')
        .text(make, ML, doc.y, { lineBreak: false })
    doc.y += 30
    doc.fillColor(C.mid).fontSize(13).font('Helvetica')
        .text(model, ML, doc.y, { lineBreak: false })
    doc.y += 22

    // Bottom rule
    doc.moveTo(ML, doc.y).lineTo(PW - MR, doc.y)
        .lineWidth(1).strokeColor(C.accent).stroke()
    doc.y += 20
}

// ── Field list ─────────────────────────────────────────────────────────────────
// Two-column layout: label (left) + value (right)
function drawFields(doc, fields, car) {
    var LW = 140 // label column width
    var ROW = 22 // row height

    fields.forEach(function(f, i) {
        need(doc, ROW + 2, car)
        var y = doc.y
        var bg = i % 2 === 0 ? C.bg : C.white

        // Row background
        doc.rect(ML, y, CW, ROW).fill(bg)

        // Left accent line on even rows
        if (i % 2 === 0) {
            doc.rect(ML, y, 3, ROW).fill(C.accent)
        }

        // Label
        doc.fillColor(C.light).fontSize(8).font('Helvetica-Bold')
            .text(String(f[0]).toUpperCase(), ML + 10, y + 6, { width: LW - 10, lineBreak: false })

        // Value
        doc.fillColor(C.black).fontSize(9.5).font('Helvetica')
            .text(String(f[1]), ML + LW, y + 5, { width: CW - LW - 5, lineBreak: false })

        doc.y = y + ROW
    })
    doc.y += 10
}

// ── Section heading ─────────────────────────────────────────────────────────────
function drawSection(doc, title, car) {
    need(doc, 36, car)
    doc.y += 8

    // Section label with accent dot
    doc.rect(ML, doc.y, 4, 14).fill(C.accent)
    doc.fillColor(C.dark).fontSize(10).font('Helvetica-Bold')
        .text(title, ML + 12, doc.y + 1, { lineBreak: false })
    doc.y += 20

    // Thin rule below heading
    doc.moveTo(ML, doc.y).lineTo(PW - MR, doc.y)
        .lineWidth(0.4).strokeColor(C.border).stroke()
    doc.y += 8
}

// ── Notes ───────────────────────────────────────────────────────────────────────
function drawNotes(doc, notes, car) {
    if (!notes || !notes.trim()) return
    drawSection(doc, 'NOTES', car)
    need(doc, 30, car)
    doc.rect(ML, doc.y, CW, 1000).fill(C.accentL) // overdrawn, trimmed by content
    var startY = doc.y
    doc.fillColor(C.dark).fontSize(9.5).font('Helvetica')
        .text(notes.trim(), ML + 10, doc.y + 8, { width: CW - 20 })
        // Fix background height to actual text height
    var textH = doc.y - startY + 8
    doc.y = startY
    doc.rect(ML, doc.y, CW, textH).fill(C.accentL)
    doc.fillColor(C.dark).fontSize(9.5).font('Helvetica')
        .text(notes.trim(), ML + 10, doc.y + 8, { width: CW - 20 })
    doc.y += 12
}

// ── Attributes ──────────────────────────────────────────────────────────────────
function drawAttributes(doc, attrs, car) {
    if (!attrs || attrs.length === 0) return
    drawSection(doc, 'ATTRIBUTS SUPPLÉMENTAIRES', car)

    var COLS = 2
    var GAP = 10
    var colW = (CW - GAP * (COLS - 1)) / COLS
    var LW = 100
    var ROW = 22
    var col = 0
    var rowY = doc.y

    attrs.forEach(function(a, i) {
        if (col === 0) {
            need(doc, ROW + 2, car)
            rowY = doc.y
        }
        var cx = ML + col * (colW + GAP)
        var bg = Math.floor(i / COLS) % 2 === 0 ? C.bg : C.white

        doc.rect(cx, rowY, colW, ROW).fill(bg)
        doc.rect(cx, rowY, 3, ROW).fill(C.border)

        doc.fillColor(C.light).fontSize(8).font('Helvetica-Bold')
            .text(String(a.key || '').toUpperCase(), cx + 8, rowY + 6, { width: LW - 8, lineBreak: false })
        doc.fillColor(C.black).fontSize(9.5).font('Helvetica')
            .text(String(a.value != null ? a.value : '—'), cx + LW, rowY + 5, { width: colW - LW - 5, lineBreak: false })

        col++
        if (col >= COLS) {
            col = 0
            doc.y = rowY + ROW
        }
    })
    if (col !== 0) doc.y = rowY + ROW
    doc.y += 10
}

// ── Images ──────────────────────────────────────────────────────────────────────
function drawImages(doc, images, car) {
    var valid = (images || []).filter(function(img) {
        return img.filepath && fs.existsSync(img.filepath)
    })
    if (valid.length === 0) return

    drawSection(doc, 'PHOTOS  (' + valid.length + ')', car)

    var PER_ROW = 3
    var GAP = 8
    var tW = Math.floor((CW - GAP * (PER_ROW - 1)) / PER_ROW) // ~161px
    var tH = Math.round(tW * 0.68) // ~109px

    for (var i = 0; i < valid.length; i += PER_ROW) {
        var row = valid.slice(i, i + PER_ROW)
        need(doc, tH + GAP + 4, car)
        var ry = doc.y

        row.forEach(function(img, ci) {
            var tx = ML + ci * (tW + GAP)

            // Subtle card shadow effect via border
            doc.rect(tx, ry, tW, tH)
                .lineWidth(0.5).strokeColor(C.border).fillAndStroke(C.bg)

            try {
                doc.image(img.filepath, tx + 2, ry + 2, {
                    fit: [tW - 4, tH - 4],
                    align: 'center',
                    valign: 'center'
                })
            } catch (_) {
                doc.fillColor(C.light).fontSize(8).font('Helvetica')
                    .text('Image indisponible', tx, ry + tH / 2 - 6, { width: tW, align: 'center', lineBreak: false })
            }


        })

        doc.y = ry + tH + GAP
    }
    doc.y += 8
}

// ── Export entry point ─────────────────────────────────────────────────────────
async function exportPDF(win, ids) {
    var result = await dialog.showSaveDialog(win, {
        title: 'Exporter en PDF',
        defaultPath: 'fiches_vehicules_' + Date.now() + '.pdf',
        filters: [{ name: 'Fichier PDF', extensions: ['pdf'] }]
    })
    if (result.canceled || !result.filePath) return { cancelled: true }

    var filePath = result.filePath
    if (!filePath.toLowerCase().endsWith('.pdf')) filePath += '.pdf'

    // Load all data BEFORE opening stream (no async inside PDFKit draw calls)
    var cars = []
    for (var i = 0; i < ids.length; i++) {
        var car = await getFullCar(ids[i])
        if (car) cars.push(car)
    }
    if (cars.length === 0) return { success: false, error: 'Aucun véhicule trouvé' }

    return new Promise(function(resolve, reject) {
        var doc = new PDFDocument({
            margin: 0,
            size: 'A4',
            autoFirstPage: true,
            bufferPages: true // needed for footer stamping
        })

        var stream = fs.createWriteStream(filePath)
        stream.on('finish', function() { resolve({ success: true, filePath }) })
        stream.on('error', reject)
        doc.on('error', reject)
        doc.pipe(stream)

        // ── Draw each car ──────────────────────────────────────────────────
        cars.forEach(function(car, idx) {
            if (idx > 0) doc.addPage()

            drawCarHeader(doc, car)

            var fields = [
                ['Marque', car.make_name],
                ['Modèle', car.model_name],
                ['Sous-modèle', car.submodel_name],
                ['Année', car.year],
                ['VIN', car.vin],
                ['Immatriculation', car.registration],
                ['Date immat.', car.reg_date],
                ['Énergie', car.fuel_type],
                ['Puissance', car.power_cv != null ? car.power_cv + ' cv' : null],
                ['Kilométrage', car.mileage_km != null ? car.mileage_km + ' km' : null],
                ['Cylindrée', car.displacement_cc != null ? car.displacement_cc + ' cc' : null],
                ['Code moteur', car.engine_code],
                ['Boîte', car.gearbox],
                ['Type interne', car.internal_type],
                ['N° Dossier', car.folder_ref],
            ].filter(function(f) { return f[1] != null && String(f[1]).trim() !== '' })

            drawFields(doc, fields, car)
            drawNotes(doc, car.notes, car)
            drawAttributes(doc, car.attributes, car)
            drawImages(doc, car.images, car)
        })

        // ── Stamp footers on every page ────────────────────────────────────
        var total = doc.bufferedPageRange().count
        stampFooters(doc, total)

        doc.end()
    })
}

module.exports = { exportPDF }
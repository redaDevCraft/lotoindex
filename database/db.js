// @ts-nocheck
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const { app } = require('electron')
const fs = require('fs')

const dbPath = path.join(app.getPath('userData'), 'lotoindex.db')
fs.mkdirSync(path.dirname(dbPath), { recursive: true })

const db = new sqlite3.Database(dbPath, function(err) {
    if (err) console.error('Erreur SQLite:', err)
    else console.log('SQLite connecté :', dbPath)
})

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS makes (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT
  );
  CREATE TABLE IF NOT EXISTS models (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    make_id      INTEGER NOT NULL REFERENCES makes(id),
    name         TEXT NOT NULL,
    vehicle_type TEXT DEFAULT 'car',
    UNIQUE(make_id, name)
  );
  CREATE TABLE IF NOT EXISTS submodels (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    model_id INTEGER NOT NULL REFERENCES models(id),
    name     TEXT NOT NULL,
    UNIQUE(model_id, name)
  );
  CREATE TABLE IF NOT EXISTS cars (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    make_id         INTEGER REFERENCES makes(id),
    model_id        INTEGER REFERENCES models(id),
    year            INTEGER,
    vin             TEXT,
    registration    TEXT,
    reg_date        TEXT,
    fuel_type       TEXT,
    power_cv        INTEGER,
    mileage_km      INTEGER,
    displacement_cc INTEGER,
    engine_code     TEXT,
    gearbox         TEXT,
    internal_type   TEXT,
    folder_ref      TEXT,
    created_at      TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS car_attributes (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id INTEGER NOT NULL REFERENCES cars(id),
    key    TEXT NOT NULL,
    value  TEXT,
    UNIQUE(car_id, key)
  );
  CREATE VIRTUAL TABLE IF NOT EXISTS cars_fts USING fts5(
    car_id UNINDEXED,
    search_blob
  );
`

function run(sql, params) {
    return new Promise(function(resolve, reject) {
        db.run(sql, params || [], function(err) {
            if (err) reject(err)
            else resolve({ lastID: this.lastID, changes: this.changes })
        })
    })
}

function get(sql, params) {
    return new Promise(function(resolve, reject) {
        db.get(sql, params || [], function(err, row) {
            if (err) reject(err)
            else resolve(row)
        })
    })
}

function all(sql, params) {
    return new Promise(function(resolve, reject) {
        db.all(sql, params || [], function(err, rows) {
            if (err) reject(err)
            else resolve(rows)
        })
    })
}

function initDB() {
    return new Promise(function(resolve, reject) {
        db.exec(SCHEMA, function(err) {
            if (err) {
                console.error('Schema error:', err);
                reject(err)
            } else {
                console.log('Schema ready');
                resolve()
            }
        })
    })
}

module.exports = { run, get, all, initDB }
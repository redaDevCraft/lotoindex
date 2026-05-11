const { run } = require('./db')

async function initDB() {
    // 1. Makes (brands)
    await run(`CREATE TABLE IF NOT EXISTS makes (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT UNIQUE
  )`)

    // 2. Models
    await run(`CREATE TABLE IF NOT EXISTS models (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    make_id      INTEGER NOT NULL REFERENCES makes(id) ON DELETE CASCADE,
    name         TEXT NOT NULL,
    vehicle_type TEXT DEFAULT 'car',
    UNIQUE(make_id, name)
  )`)

    // 3. Submodels / Trims (hierarchical: model → submodel → sub-submodel)
    await run(`CREATE TABLE IF NOT EXISTS submodels (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    model_id    INTEGER NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    parent_id   INTEGER REFERENCES submodels(id),
    name        TEXT NOT NULL,
    year_from   INTEGER,
    year_to     INTEGER,
    engine_cc   INTEGER,
    power_cv    INTEGER,
    fuel_type   TEXT,
    gearbox     TEXT,
    UNIQUE(model_id, name)
  )`)

    // 4. Cars
    await run(`CREATE TABLE IF NOT EXISTS cars (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    make_id         INTEGER REFERENCES makes(id),
    model_id        INTEGER REFERENCES models(id),
    submodel_id     INTEGER REFERENCES submodels(id),
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
    notes           TEXT,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
  )`)

    // 5. Dynamic attributes
    await run(`CREATE TABLE IF NOT EXISTS car_attributes (
    car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    key    TEXT NOT NULL,
    value  TEXT,
    PRIMARY KEY(car_id, key)
  )`)

    // 6. Images
    await run(`CREATE TABLE IF NOT EXISTS car_images (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    car_id     INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
    filepath   TEXT NOT NULL,
    is_primary INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
  )`)

    // 7. FTS5 full-text search
    await run(`CREATE VIRTUAL TABLE IF NOT EXISTS cars_fts USING fts5(
    car_id     UNINDEXED,
    search_blob,
    tokenize = 'unicode61 remove_diacritics 2'
  )`)

    // Indexes
    await run(`CREATE INDEX IF NOT EXISTS idx_cars_make    ON cars(make_id)`)
    await run(`CREATE INDEX IF NOT EXISTS idx_cars_model   ON cars(model_id)`)
    await run(`CREATE INDEX IF NOT EXISTS idx_cars_year    ON cars(year)`)
    await run(`CREATE INDEX IF NOT EXISTS idx_cars_fuel    ON cars(fuel_type)`)
    await run(`CREATE INDEX IF NOT EXISTS idx_cars_vin     ON cars(vin)`)

    console.log('Schema ready')
}

module.exports = { initDB }
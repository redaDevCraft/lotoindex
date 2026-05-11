import db from './db.js';

export function initDB() {
    db.serialize(() => {
        db.run(`
      CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        brand TEXT,
        model TEXT,
        submodel TEXT,
        year TEXT,
        data TEXT
      )
    `);

        db.run(`
      CREATE TABLE IF NOT EXISTS images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        car_id INTEGER,
        path TEXT,
        FOREIGN KEY(car_id) REFERENCES cars(id)
      )
    `);
    });
}
const sqlite3 = require('sqlite3').verbose()
const path = require('path')
const { app } = require('electron')

const dbPath = path.join(app.getPath('userData'), 'lotoindex.db')

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) { console.error('❌ SQLite error:', err.message); return }
    console.log(' SQLite connected:', dbPath)
    db.run('PRAGMA journal_mode = WAL')
    db.run('PRAGMA foreign_keys = ON')
    db.run('PRAGMA cache_size = -64000') // 64MB cache
    db.run('PRAGMA synchronous = NORMAL')
})

// Promise wrappers
const run = (sql, params = []) =>
    new Promise((resolve, reject) =>
        db.run(sql, params, function(err) {
            if (err) reject(err)
            else resolve({ lastID: this.lastID, changes: this.changes })
        })
    )

const all = (sql, params = []) =>
    new Promise((resolve, reject) =>
        db.all(sql, params, (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
        })
    )

const get = (sql, params = []) =>
    new Promise((resolve, reject) =>
        db.get(sql, params, (err, row) => {
            if (err) reject(err)
            else resolve(row)
        })
    )

module.exports = { db, run, all, get }
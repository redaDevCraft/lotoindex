import sqlite3 from 'sqlite3';
import path from 'path';
import { app } from 'electron';

const dbPath = path.join(app.getPath('userData'), 'cars.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('DB Error:', err);
  } else {
    console.log('Connected to SQLite database');
  }
});

export default db;
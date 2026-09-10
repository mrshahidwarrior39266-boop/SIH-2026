/**
 * db.js — Database connection using Node.js built-in node:sqlite
 * Requires Node.js v22.5+ (launched with --experimental-sqlite flag)
 * No native compilation needed — works on all platforms out of the box.
 */
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs   = require('fs');

const DB_DIR     = path.join(__dirname, '..', 'database');
const DB_PATH    = path.join(DB_DIR, 'skillbridge.db');
const SCHEMA_PATH = path.join(DB_DIR, 'schema.sql');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);

// Performance PRAGMAs (node:sqlite uses db.exec for pragmas)
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');
db.exec('PRAGMA synchronous = NORMAL');

// Run schema on startup (idempotent — uses CREATE TABLE IF NOT EXISTS)
const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
db.exec(schema);

console.log('✅ SQLite database ready:', DB_PATH);

module.exports = db;


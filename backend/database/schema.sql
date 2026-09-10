-- ============================================================
-- SkillBridge Academia-Industry Portal — Database Schema
-- SQLite / better-sqlite3
-- All tables use CREATE IF NOT EXISTS (safe to re-run)
-- ============================================================

-- USERS (core auth table)
CREATE TABLE IF NOT EXISTS users (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  email            TEXT    NOT NULL UNIQUE,
  password         TEXT,                              -- NULL for Google-only accounts
  google_id        TEXT    UNIQUE,                    -- NULL for email-only accounts
  name             TEXT,
  avatar           TEXT,                              -- URL (Google profile pic or null)
  role             TEXT    CHECK(role IN ('student','recruiter','faculty','institution') OR role IS NULL),
  profile_complete INTEGER NOT NULL DEFAULT 0,       -- 0 = incomplete, 1 = done
  created_at       TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- STUDENT PROFILES
CREATE TABLE IF NOT EXISTS student_profiles (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id         INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  institution     TEXT,
  department      TEXT,
  year            INTEGER CHECK(year BETWEEN 1 AND 6),
  cgpa            REAL    CHECK(cgpa BETWEEN 0 AND 10),
  skills          TEXT    NOT NULL DEFAULT '[]',      -- JSON array of skill strings
  student_id      TEXT,
  placement_score INTEGER NOT NULL DEFAULT 0,
  linkedin        TEXT,
  github          TEXT,
  created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- RECRUITER PROFILES
CREATE TABLE IF NOT EXISTS recruiter_profiles (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  company      TEXT,
  designation  TEXT,
  linkedin     TEXT,
  domains      TEXT NOT NULL DEFAULT '[]',            -- JSON array of hiring domain strings
  website      TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- FACULTY PROFILES
CREATE TABLE IF NOT EXISTS faculty_profiles (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id        INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  institution    TEXT,
  department     TEXT,
  designation    TEXT,
  specialization TEXT,
  scholar_url    TEXT,
  orcid          TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);

-- INSTITUTION / TPO PROFILES
CREATE TABLE IF NOT EXISTS institution_profiles (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id      INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  institution  TEXT,
  naac_grade   TEXT    CHECK(naac_grade IN ('A++','A+','A','B++','B+','B','C','D') OR naac_grade IS NULL),
  nirf_rank    INTEGER,
  role_title   TEXT,
  city         TEXT,
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

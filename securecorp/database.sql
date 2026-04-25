-- ═══════════════════════════════════════════════════════════════
-- SecureCorp Employee Portal — Database Setup
-- ═══════════════════════════════════════════════════════════════
-- This script creates the required tables and seeds initial data.
-- Run with: psql -d securecorp -f database.sql
-- ═══════════════════════════════════════════════════════════════

-- Drop existing tables for a clean setup
DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS users;

-- ─── Session Table (for connect-pg-simple) ───
CREATE TABLE session (
  sid    VARCHAR NOT NULL COLLATE "default",
  sess   JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (sid)
);
CREATE INDEX IF NOT EXISTS idx_session_expire ON session (expire);

-- ─── Users Table ───
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(100) UNIQUE NOT NULL,
  password    VARCHAR(100) NOT NULL,     -- Plain text: intentionally insecure for lab
  phone       VARCHAR(20),
  role        VARCHAR(20) DEFAULT 'user',  -- 'user' or 'admin'
  salary      INTEGER,
  department  VARCHAR(50),
  joined_date DATE DEFAULT CURRENT_DATE
);

-- ─── Seed Data ───
-- 2 Admins + 6 Regular Users = 8 total employees
INSERT INTO users (name, email, password, phone, role, salary, department, joined_date) VALUES
  ('Alexandra Reid',    'admin@securecorp.com',    'admin123',    '+1-555-0101', 'admin', 115000, 'Executive',   '2021-03-15'),
  ('James Whitfield',   'james@securecorp.com',    'james2024',   '+1-555-0108', 'admin', 108000, 'Engineering', '2021-06-22'),
  ('Marcus Chen',       'marcus@securecorp.com',   'pass1234',    '+1-555-0102', 'user',  87000,  'Engineering', '2022-01-10'),
  ('Priya Nair',        'priya@securecorp.com',    'priya2024',   '+1-555-0103', 'user',  91000,  'Engineering', '2022-04-18'),
  ('Sofia Rodriguez',   'sofia@securecorp.com',    'sofia!pass',  '+1-555-0104', 'user',  72000,  'HR',          '2023-02-01'),
  ('David Okonkwo',     'david@securecorp.com',    'david321',    '+1-555-0105', 'user',  95000,  'Finance',     '2022-08-30'),
  ('Emily Tanaka',      'emily@securecorp.com',    'emily@99',    '+1-555-0106', 'user',  68000,  'Marketing',   '2023-07-12'),
  ('Ryan Mitchell',     'ryan@securecorp.com',     'ryanPass1',   '+1-555-0107', 'user',  45000,  'Marketing',   '2024-01-05');

-- ═══════════════════════════════════════════════════════════════
-- Verify seed data
-- ═══════════════════════════════════════════════════════════════
-- SELECT id, name, email, role, department, salary FROM users ORDER BY id;

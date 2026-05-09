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

-- ─── Requests Table ───
CREATE TABLE requests (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(50) NOT NULL,
  from_date   DATE NOT NULL,
  to_date     DATE NOT NULL,
  days        INTEGER NOT NULL,
  reason      TEXT,
  status      VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  submitted   VARCHAR(50) DEFAULT 'Just now'
);

-- ─── Notifications Table ───
CREATE TABLE notifications (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(20) NOT NULL,          -- security, hr, team, info
  title       VARCHAR(255) NOT NULL,
  body        TEXT NOT NULL,
  time_label  VARCHAR(50) DEFAULT 'Just now',
  is_read     BOOLEAN DEFAULT FALSE,
  color       VARCHAR(20) DEFAULT '#6366f1'
);

-- ─── User Settings Table ───
CREATE TABLE user_settings (
  user_id           INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email_notifs      BOOLEAN DEFAULT TRUE,
  push_notifs       BOOLEAN DEFAULT TRUE,
  leave_alerts      BOOLEAN DEFAULT TRUE,
  security_alerts   BOOLEAN DEFAULT TRUE,
  two_fa_enabled    BOOLEAN DEFAULT FALSE,
  dark_mode         BOOLEAN DEFAULT TRUE,
  show_salary       BOOLEAN DEFAULT TRUE,
  language          VARCHAR(10) DEFAULT 'en',
  timezone          VARCHAR(20) DEFAULT 'UTC-5'
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

-- Seed settings (1 for each user)
INSERT INTO user_settings (user_id)
SELECT id FROM users;

-- Seed some mock requests
INSERT INTO requests (user_id, type, from_date, to_date, days, reason, status, submitted) VALUES
  (3, 'Annual Leave', '2025-04-28', '2025-05-02', 5, 'Family vacation', 'pending', '3 days ago'),
  (3, 'Work From Home', '2025-04-14', '2025-04-14', 1, 'Home maintenance', 'approved', '1 month ago'),
  (4, 'Sick Leave', '2025-03-10', '2025-03-11', 2, 'Medical appointment', 'approved', '2 weeks ago'),
  (5, 'Training Leave', '2025-02-20', '2025-02-21', 2, 'External training course', 'rejected', '2 months ago');

INSERT INTO user_settings (user_id, email_notifs, push_notifs, leave_alerts, security_alerts) VALUES
(1, TRUE, TRUE, TRUE, TRUE),
(2, TRUE, FALSE, TRUE, TRUE),
(3, TRUE, TRUE, TRUE, FALSE),
(4, FALSE, FALSE, TRUE, TRUE),
(5, TRUE, TRUE, TRUE, TRUE),
(6, TRUE, FALSE, FALSE, TRUE),
(7, FALSE, TRUE, TRUE, TRUE),
(8, TRUE, TRUE, FALSE, FALSE);

-- ==========================================
-- Admin Security Logs Table
-- ==========================================
CREATE TABLE security_logs (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    ip_address VARCHAR(45),
    severity VARCHAR(20) DEFAULT 'info',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO security_logs (event_type, description, ip_address, severity, created_at) VALUES
('LOGIN_SUCCESS', 'Admin user authenticated successfully via SecureCorp SSO', '192.168.1.100', 'info', NOW() - INTERVAL '2 hours'),
('FAILED_LOGIN', 'Multiple failed login attempts detected for marcus@securecorp.com', '203.0.113.42', 'warning', NOW() - INTERVAL '5 hours'),
('DB_BACKUP', 'Automated database backup completed successfully', '127.0.0.1', 'info', NOW() - INTERVAL '1 day'),
('UNAUTHORIZED_ACCESS', 'Access blocked to /api/db from non-allowed IP', '198.51.100.23', 'critical', NOW() - INTERVAL '2 days'),
('PASSWORD_RESET', 'Password reset initiated for sarah@securecorp.com', '192.168.1.105', 'info', NOW() - INTERVAL '3 days');

-- Seed some mock notifications
INSERT INTO notifications (user_id, type, title, body, time_label, is_read, color) VALUES
  (3, 'security', 'New Login Detected', 'A new sign-in from Windows · Chrome 124 was detected.', '2 min ago', false, '#10b981'),
  (3, 'hr', 'Leave Request Approved', 'Your Work From Home request has been approved by HR.', '1 month ago', true, '#6366f1'),
  (3, 'hr', 'Payslip Available', 'Your April 2025 payslip is ready. Log in to the payroll portal.', 'Yesterday', false, '#f59e0b'),
  (4, 'team', 'Team Meeting Scheduled', 'Q2 All-Hands meeting scheduled for Friday.', '3 hrs ago', false, '#8b5cf6');

-- ═══════════════════════════════════════════════════════════════
-- Verify seed data
-- ═══════════════════════════════════════════════════════════════
-- SELECT id, name, email, role, department, salary FROM users ORDER BY id;

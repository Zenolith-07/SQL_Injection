const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

/**
 * POST /api/auth/login
 * Authenticates a user by email and password.
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    /*
     * ===================================================
     * ⚠️  INTENTIONAL SQL INJECTION VULNERABILITY
     * ===================================================
     * This query is deliberately unsafe for lab purposes.
     * It uses string concatenation instead of parameterized
     * queries, making it vulnerable to SQL injection.
     *
     * DEMO PAYLOADS (enter in email field):
     *   Login Bypass:       ' OR '1'='1' --
     *   Login as Admin:     admin@securecorp.com' --
     *   Role-based bypass:  ' OR role='admin' --
     *
     * Password field: type anything (e.g. "anything")
     * ===================================================
     */
    const query = `SELECT * FROM users WHERE email='${email}' AND password='${password}'`;
    const result = await pool.query(query);

    // ✅ SECURE VERSION — Uncomment to demonstrate mitigation
    /*
     * Uses parameterized queries ($1, $2) which treat user input
     * as data, never as executable SQL. Even if a user enters
     * ' OR '1'='1'--, it is passed as a literal string to the DB,
     * breaking the injection entirely.
     *
     * This is the industry-standard fix for SQL Injection.
     */
    /*
    const query = 'SELECT * FROM users WHERE email=$1 AND password=$2';
    const result = await pool.query(query, [email, password]);
    */

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Store user data in session (excluding password)
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      salary: user.salary,
      phone: user.phone,
      joined_date: user.joined_date,
    };

    res.json({ success: true, role: user.role });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

/**
 * POST /api/auth/logout
 * Destroys the current session.
 */
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to log out.' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

module.exports = router;

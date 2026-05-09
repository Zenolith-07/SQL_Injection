const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const sessionCheck = require('../middleware/sessionCheck');

// Apply auth middleware to all employee routes
router.use(sessionCheck);

/**
 * GET /api/employees
 * Returns all employee records.
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, role, salary, department, joined_date FROM users ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch employees error:', err.message);
    res.status(500).json({ error: 'Failed to fetch employees.' });
  }
});

/**
 * GET /api/employees/:id
 * Fetches data for a single employee.
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (req.session.user.role !== 'admin' && req.session.user.id !== parseInt(id, 10)) {
    return res.status(403).json({ error: 'Unauthorized.' });
  }

  try {
    const result = await pool.query(
      'SELECT id, name, email, phone, role, salary, department, joined_date FROM users WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fetch employee error:', err.message);
    res.status(500).json({ error: 'Failed to fetch employee.' });
  }
});

/**
 * PUT /api/employees/:id
 * Updates an employee's basic profile.
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, department, salary } = req.body;

  if (req.session.user.role !== 'admin' && req.session.user.id !== parseInt(id, 10)) {
    return res.status(403).json({ error: 'Unauthorized.' });
  }

  try {
    const result = await pool.query(
      `UPDATE users SET 
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone = COALESCE($3, phone),
        department = COALESCE($4, department),
        salary = COALESCE($5, salary)
       WHERE id = $6 RETURNING id, name, email, phone, role, salary, department, joined_date`,
      [name, email, phone, department, salary, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update employee error:', err.message);
    res.status(500).json({ error: 'Failed to update employee profile.' });
  }
});

/**
 * PATCH /api/employees/:id/role
 * Updates the role of an employee.
 */
router.patch('/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Role must be "admin" or "user".' });
  }

  try {
    /*
     * ===================================================
     * ⚠️  INTENTIONAL SQL INJECTION VULNERABILITY
     * ===================================================
     * This UPDATE query uses string concatenation, making
     * it vulnerable to SQL injection via the role or id
     * parameters.
     *
     * In a real attack scenario, a malicious API call could
     * inject SQL through the role field to modify data,
     * drop tables, or extract information.
     * ===================================================
     */
    const query = `UPDATE users SET role='${role}' WHERE id=${id} RETURNING id, name, email, phone, role, salary, department, joined_date`;
    const result = await pool.query(query);

    // ✅ SECURE VERSION — Uncomment to demonstrate mitigation
    /*
     * Parameterized query prevents injection by treating
     * $1 and $2 as data values, not SQL code.
     */
    /*
    const query = 'UPDATE users SET role=$1 WHERE id=$2 RETURNING id, name, email, phone, role, salary, department, joined_date';
    const result = await pool.query(query, [role, id]);
    */

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Role update error:', err.message);
    res.status(500).json({ error: 'Failed to update role.' });
  }
});

/**
 * DELETE /api/employees/:id
 * Deletes an employee record.
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    res.json({ success: true, deletedId: parseInt(id, 10) });
  } catch (err) {
    console.error('Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete employee.' });
  }
});

module.exports = router;

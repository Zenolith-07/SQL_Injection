const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const sessionCheck = require('../middleware/sessionCheck');

router.use(sessionCheck);

// GET /api/analytics
router.get('/', async (req, res) => {
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized.' });
  }

  try {
    // Collect aggregated metrics
    const deptResult = await pool.query(`
      SELECT department, COUNT(*) as headcount, SUM(salary) as total_salary 
      FROM users 
      WHERE department IS NOT NULL
      GROUP BY department
    `);

    const roleResult = await pool.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);

    const requestResult = await pool.query(`
      SELECT status, COUNT(*) as count
      FROM requests
      GROUP BY status
    `);

    const userCountResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = parseInt(userCountResult.rows[0].count, 10);

    const salaryResult = await pool.query('SELECT SUM(salary) FROM users');
    const totalSalary = parseInt(salaryResult.rows[0].sum || 0, 10);

    res.json({
      totalUsers,
      totalSalary,
      departments: deptResult.rows,
      roles: roleResult.rows,
      requests: requestResult.rows
    });
  } catch (err) {
    console.error('Fetch analytics error:', err.message);
    res.status(500).json({ error: 'Failed to fetch analytics.' });
  }
});

module.exports = router;

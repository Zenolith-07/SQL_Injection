const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const sessionCheck = require('../middleware/sessionCheck');

router.use(sessionCheck);

// GET /api/security/logs
router.get('/logs', async (req, res) => {
  // Only admins can view security logs
  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Unauthorized. Admin access required.' });
  }

  try {
    const result = await pool.query('SELECT * FROM security_logs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch security logs error:', err.message);
    res.status(500).json({ error: 'Failed to fetch security logs.' });
  }
});

module.exports = router;

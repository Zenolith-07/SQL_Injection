const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const sessionCheck = require('../middleware/sessionCheck');

router.use(sessionCheck);

// GET /api/requests/:userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  
  // Security check: Only admins or the user themselves can view their requests
  if (req.session.user.role !== 'admin' && req.session.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ error: 'Unauthorized access to user requests.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM requests WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch requests error:', err.message);
    res.status(500).json({ error: 'Failed to fetch requests.' });
  }
});

// POST /api/requests
router.post('/', async (req, res) => {
  // A regular user can only submit requests for themselves
  const user_id = req.session.user.id;
  const { type, from_date, to_date, days, reason } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO requests (user_id, type, from_date, to_date, days, reason, status, submitted) 
       VALUES ($1, $2, $3, $4, $5, $6, 'pending', 'Just now') RETURNING *`,
      [user_id, type, from_date, to_date, days, reason]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create request error:', err.message);
    res.status(500).json({ error: 'Failed to create request.' });
  }
});

// PUT /api/requests/:id/status (Admin Only)
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (req.session.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can approve/reject requests.' });
  }

  try {
    const result = await pool.query(
      'UPDATE requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update request status error:', err.message);
    res.status(500).json({ error: 'Failed to update request status.' });
  }
});

module.exports = router;

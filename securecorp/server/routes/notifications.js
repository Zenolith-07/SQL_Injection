const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const sessionCheck = require('../middleware/sessionCheck');

router.use(sessionCheck);

// GET /api/notifications/:userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  
  if (req.session.user.role !== 'admin' && req.session.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ error: 'Unauthorized access to user notifications.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY id DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch notifications error:', err.message);
    res.status(500).json({ error: 'Failed to fetch notifications.' });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', async (req, res) => {
  const { id } = req.params;
  
  try {
    // In a real app we'd verify the notification belongs to the user or an admin
    const result = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Mark read error:', err.message);
    res.status(500).json({ error: 'Failed to mark notification as read.' });
  }
});

// PUT /api/notifications/user/:userId/read-all
router.put('/user/:userId/read-all', async (req, res) => {
  const { userId } = req.params;
  
  if (req.session.user.role !== 'admin' && req.session.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ error: 'Unauthorized.' });
  }

  try {
    const result = await pool.query(
      'UPDATE notifications SET is_read = TRUE WHERE user_id = $1',
      [userId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Mark all read error:', err.message);
    res.status(500).json({ error: 'Failed to mark all as read.' });
  }
});

// DELETE /api/notifications/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM notifications WHERE id = $1', [id]);
    res.json({ success: true, deletedId: parseInt(id, 10) });
  } catch (err) {
    console.error('Delete notification error:', err.message);
    res.status(500).json({ error: 'Failed to delete notification.' });
  }
});

module.exports = router;

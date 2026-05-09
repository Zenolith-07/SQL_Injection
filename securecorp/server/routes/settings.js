const express = require('express');
const router = express.Router();
const pool = require('../db/pool');
const sessionCheck = require('../middleware/sessionCheck');

router.use(sessionCheck);

// GET /api/settings/:userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  
  if (req.session.user.role !== 'admin' && req.session.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ error: 'Unauthorized access to user settings.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM user_settings WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      // Return defaults if none found
      return res.json({
        email_notifs: true, push_notifs: true, leave_alerts: true, security_alerts: true,
        two_fa_enabled: false, dark_mode: true, show_salary: true, language: 'en', timezone: 'UTC-5'
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fetch settings error:', err.message);
    res.status(500).json({ error: 'Failed to fetch settings.' });
  }
});

// PUT /api/settings/:userId
router.put('/:userId', async (req, res) => {
  const { userId } = req.params;
  const {
    email_notifs, push_notifs, leave_alerts, security_alerts,
    two_fa_enabled, dark_mode, show_salary, language, timezone
  } = req.body;
  
  if (req.session.user.role !== 'admin' && req.session.user.id !== parseInt(userId, 10)) {
    return res.status(403).json({ error: 'Unauthorized update of user settings.' });
  }

  try {
    const query = `
      INSERT INTO user_settings 
        (user_id, email_notifs, push_notifs, leave_alerts, security_alerts, two_fa_enabled, dark_mode, show_salary, language, timezone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (user_id) DO UPDATE SET
        email_notifs = EXCLUDED.email_notifs,
        push_notifs = EXCLUDED.push_notifs,
        leave_alerts = EXCLUDED.leave_alerts,
        security_alerts = EXCLUDED.security_alerts,
        two_fa_enabled = EXCLUDED.two_fa_enabled,
        dark_mode = EXCLUDED.dark_mode,
        show_salary = EXCLUDED.show_salary,
        language = EXCLUDED.language,
        timezone = EXCLUDED.timezone
      RETURNING *
    `;

    const result = await pool.query(query, [
      userId, email_notifs, push_notifs, leave_alerts, security_alerts,
      two_fa_enabled, dark_mode, show_salary, language, timezone
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update settings error:', err.message);
    res.status(500).json({ error: 'Failed to update settings.' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const sessionCheck = require('../middleware/sessionCheck');

// Apply auth middleware
router.use(sessionCheck);

/**
 * GET /api/user/me
 * Returns the currently logged-in user's data from the session.
 */
router.get('/me', (req, res) => {
  res.json({ user: req.session.user });
});

module.exports = router;

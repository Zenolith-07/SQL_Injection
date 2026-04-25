/**
 * Session Authentication Middleware
 *
 * Checks for an active session with user data.
 * Apply to all routes requiring authentication.
 */
function sessionCheck(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ error: 'Unauthorized — Please log in to access this resource.' });
  }
  next();
}

module.exports = sessionCheck;

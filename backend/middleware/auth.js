const jwt = require('jsonwebtoken');

/**
 * verifyJWT — Express middleware
 * Validates the Bearer JWT in Authorization header.
 * Attaches decoded payload to req.user.
 */
function verifyJWT(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(403).json({ error: 'Invalid token. Please log in again.' });
  }
}

module.exports = { verifyJWT };

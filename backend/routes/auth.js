const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const passport = require('passport');
const db       = require('../config/db');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5500';

// ── Utility ──────────────────────────────────────────────────────────────────
function generateToken(user) {
  return jwt.sign(
    {
      id:             user.id,
      email:          user.email,
      name:           user.name,
      avatar:         user.avatar,
      role:           user.role,
      profileComplete: user.profile_complete === 1,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'Name, email, and password are required.' });

  if (password.length < 8)
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
    return res.status(400).json({ error: 'Please enter a valid email address.' });

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing)
      return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });

    const hash   = await bcrypt.hash(password, 12);
    const result = db.prepare(
      'INSERT INTO users (email, password, name, profile_complete) VALUES (?, ?, ?, 0)'
    ).run(email.toLowerCase(), hash, name.trim());

    const user  = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role, profileComplete: false },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Server error during signup. Please try again.' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());

    if (!user)
      return res.status(401).json({ error: 'Invalid email or password.' });

    if (!user.password)
      return res.status(401).json({ error: 'This account uses Google Sign-In. Please click "Continue with Google".' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user.id, email: user.email, name: user.name,
        avatar: user.avatar, role: user.role,
        profileComplete: user.profile_complete === 1,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login. Please try again.' });
  }
});

// ── GET /api/auth/google ──────────────────────────────────────────────────────
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// ── GET /api/auth/google/callback ────────────────────────────────────────────
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${FRONTEND_URL}/?auth=failed` }),
  (req, res) => {
    const token = generateToken(req.user);
    const profileComplete = req.user.profile_complete === 1 ? '1' : '0';
    res.redirect(
      `${FRONTEND_URL}/auth-callback.html?token=${token}&profileComplete=${profileComplete}`
    );
  }
);

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
  const header = req.headers['authorization'];
  const token  = header && header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = db.prepare('SELECT id, email, name, avatar, role, profile_complete FROM users WHERE id = ?').get(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ ...user, profileComplete: user.profile_complete === 1 });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  if (req.logout) req.logout(() => {});
  res.json({ message: 'Logged out successfully.' });
});

module.exports = router;

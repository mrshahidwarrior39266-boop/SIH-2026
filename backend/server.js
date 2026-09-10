require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const path = require('path');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
require('./config/passport')(passport);

const app = express();
const PORT = process.env.PORT || 3001;

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    // Allow file://, any localhost, and configured FRONTEND_URL
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'http://localhost:3001',
    ];
    if (!origin || allowed.indexOf(origin) !== -1) return cb(null, true);
    cb(null, true); // open in dev — tighten in production
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── SESSION (required for Google OAuth / Passport) ────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'skillbridge-dev-session',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true },
}));

app.use(passport.initialize());
app.use(passport.session());

// ── STATIC FRONTEND ──────────────────────────────────────────────────────────
// Serves the parent directory so the API server can also host the HTML files
app.use(express.static(path.join(__dirname, '..')));

// ── API ROUTES ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SkillBridge API', version: '1.0.0', timestamp: new Date().toISOString() });
});

// ── START ─────────────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════╗');
    console.log(`║  SkillBridge Backend  v1.0.0           ║`);
    console.log('╠════════════════════════════════════════╣');
    console.log(`║  API:    http://localhost:${PORT}/api      ║`);
    console.log(`║  Health: http://localhost:${PORT}/api/health  ║`);
    console.log(`║  Google: http://localhost:${PORT}/api/auth/google ║`);
    console.log('╚════════════════════════════════════════╝\n');
  });
}

module.exports = app;

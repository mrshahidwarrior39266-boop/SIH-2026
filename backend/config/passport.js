const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

module.exports = (passport) => {
  // ── GOOGLE OAUTH 2.0 ───────────────────────────────────────────────────────
  passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
  }, (_accessToken, _refreshToken, profile, done) => {
    const email    = profile.emails[0].value;
    const name     = profile.displayName;
    const avatar   = profile.photos[0]?.value || null;
    const googleId = profile.id;

    try {
      // Try to find existing user by Google ID or email
      let user = db.prepare('SELECT * FROM users WHERE google_id = ? OR email = ?').get(googleId, email);

      if (user) {
        // Attach Google ID if the user previously signed up with email
        if (!user.google_id) {
          db.prepare("UPDATE users SET google_id = ?, avatar = ?, updated_at = datetime('now') WHERE id = ?")
            .run(googleId, avatar, user.id);
          user = db.prepare('SELECT * FROM users WHERE id = ?').get(user.id);
        }
        return done(null, user);
      }

      // Create brand-new user
      const result = db.prepare(
        'INSERT INTO users (email, google_id, name, avatar, profile_complete) VALUES (?, ?, ?, ?, 0)'
      ).run(email, googleId, name, avatar);

      user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
      return done(null, user);
    } catch (err) {
      console.error('Google OAuth error:', err);
      return done(err, null);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    done(null, user || false);
  });
};

const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const db      = require('../config/db');
const { verifyJWT } = require('../middleware/auth');

// ── GET /api/profile ──────────────────────────────────────────────────────────
router.get('/', verifyJWT, (req, res) => {
  const user = db.prepare(
    'SELECT id, email, name, avatar, role, profile_complete, created_at FROM users WHERE id = ?'
  ).get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const tableMap = {
    student:     'student_profiles',
    recruiter:   'recruiter_profiles',
    faculty:     'faculty_profiles',
    institution: 'institution_profiles',
  };

  let profile = null;
  if (user.role && tableMap[user.role]) {
    profile = db.prepare(`SELECT * FROM ${tableMap[user.role]} WHERE user_id = ?`).get(user.id);
    // Parse JSON arrays
    if (profile && profile.skills)  profile.skills  = JSON.parse(profile.skills);
    if (profile && profile.domains) profile.domains = JSON.parse(profile.domains);
  }

  res.json({ user: { ...user, profileComplete: user.profile_complete === 1 }, profile });
});

// Helper: node:sqlite requires null instead of undefined for SQL parameters
function n(val) {
  return val === undefined ? null : val;
}

// ── POST /api/profile ─────────────────────────────────────────────────────────
// Used during profile setup wizard (first-time setup)
router.post('/', verifyJWT, (req, res) => {
  const { role } = req.body;
  const validRoles = ['student', 'recruiter', 'faculty', 'institution'];

  if (!validRoles.includes(role))
    return res.status(400).json({ error: 'Invalid role. Must be one of: student, recruiter, faculty, institution.' });

  try {
    // 1. Update user's role + mark profile complete
    db.prepare("UPDATE users SET role = ?, profile_complete = 1, updated_at = datetime('now') WHERE id = ?")
      .run(role, req.user.id);

    // 2. Upsert role-specific profile data
    if (role === 'student') {
      const { institution, department, year, cgpa, skills, student_id, linkedin, github } = req.body;
      const row = db.prepare('SELECT id FROM student_profiles WHERE user_id = ?').get(req.user.id);
      if (row) {
        db.prepare(`UPDATE student_profiles
          SET institution=?,department=?,year=?,cgpa=?,skills=?,student_id=?,linkedin=?,github=?
          WHERE user_id=?`
        ).run(n(institution), n(department), n(year), n(cgpa), JSON.stringify(skills||[]), n(student_id), n(linkedin), n(github), req.user.id);
      } else {
        db.prepare(`INSERT INTO student_profiles
          (user_id,institution,department,year,cgpa,skills,student_id,linkedin,github)
          VALUES (?,?,?,?,?,?,?,?,?)`
        ).run(req.user.id, n(institution), n(department), n(year), n(cgpa), JSON.stringify(skills||[]), n(student_id), n(linkedin), n(github));
      }
    }
    else if (role === 'recruiter') {
      const { company, designation, linkedin, domains, website } = req.body;
      const row = db.prepare('SELECT id FROM recruiter_profiles WHERE user_id = ?').get(req.user.id);
      if (row) {
        db.prepare(`UPDATE recruiter_profiles SET company=?,designation=?,linkedin=?,domains=?,website=? WHERE user_id=?`)
          .run(n(company), n(designation), n(linkedin), JSON.stringify(domains||[]), n(website), req.user.id);
      } else {
        db.prepare(`INSERT INTO recruiter_profiles (user_id,company,designation,linkedin,domains,website) VALUES (?,?,?,?,?,?)`)
          .run(req.user.id, n(company), n(designation), n(linkedin), JSON.stringify(domains||[]), n(website));
      }
    }
    else if (role === 'faculty') {
      const { institution, department, designation, specialization, scholar_url, orcid } = req.body;
      const row = db.prepare('SELECT id FROM faculty_profiles WHERE user_id = ?').get(req.user.id);
      if (row) {
        db.prepare(`UPDATE faculty_profiles SET institution=?,department=?,designation=?,specialization=?,scholar_url=?,orcid=? WHERE user_id=?`)
          .run(n(institution), n(department), n(designation), n(specialization), n(scholar_url), n(orcid), req.user.id);
      } else {
        db.prepare(`INSERT INTO faculty_profiles (user_id,institution,department,designation,specialization,scholar_url,orcid) VALUES (?,?,?,?,?,?,?)`)
          .run(req.user.id, n(institution), n(department), n(designation), n(specialization), n(scholar_url), n(orcid));
      }
    }
    else if (role === 'institution') {
      const { institution, naac_grade, nirf_rank, role_title, city } = req.body;
      const row = db.prepare('SELECT id FROM institution_profiles WHERE user_id = ?').get(req.user.id);
      if (row) {
        db.prepare(`UPDATE institution_profiles SET institution=?,naac_grade=?,nirf_rank=?,role_title=?,city=? WHERE user_id=?`)
          .run(n(institution), n(naac_grade), n(nirf_rank), n(role_title), n(city), req.user.id);
      } else {
        db.prepare(`INSERT INTO institution_profiles (user_id,institution,naac_grade,nirf_rank,role_title,city) VALUES (?,?,?,?,?,?)`)
          .run(req.user.id, n(institution), n(naac_grade), n(nirf_rank), n(role_title), n(city));
      }
    }

    // 3. Reissue JWT with updated claims
    const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
    const token = jwt.sign(
      { id: updatedUser.id, email: updatedUser.email, name: updatedUser.name,
        avatar: updatedUser.avatar, role: updatedUser.role, profileComplete: true },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ token, message: 'Profile setup complete!', role });
  } catch (err) {
    console.error('Profile setup error:', err);
    res.status(500).json({ error: err.message || 'Server error. Please try again.' });
  }
});

// ── PUT /api/profile ──────────────────────────────────────────────────────────
// Update existing profile
router.put('/', verifyJWT, (req, res) => {
  // Attach the user's existing role if not provided
  if (!req.body.role) req.body.role = req.user.role;
  // Delegate to POST handler logic by calling it directly
  router.handle(Object.assign(req, { method: 'POST' }), res, () => {});
});

module.exports = router;

const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, email, avatar_url, bio, total_distance, created_at FROM users WHERE id=$1',
      [req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/me', auth, async (req, res) => {
  const { name, bio, avatar_url } = req.body;
  try {
    const { rows } = await db.query(
      `UPDATE users SET
         name=COALESCE($1,name),
         bio=COALESCE($2,bio),
         avatar_url=COALESCE($3,avatar_url)
       WHERE id=$4 RETURNING id, name, email, avatar_url, bio, total_distance`,
      [name, bio, avatar_url, req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, avatar_url, bio, total_distance, created_at FROM users WHERE id=$1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

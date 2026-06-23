const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.post('/start', auth, async (req, res) => {
  const { club_id, title } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO runs (user_id, club_id, title, started_at) VALUES ($1,$2,$3,NOW()) RETURNING *',
      [req.user.id, club_id || null, title || 'Run']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/end', auth, async (req, res) => {
  const { distance, duration, route } = req.body;
  const pace = duration && distance > 0.05 ? (duration / 60) / distance : null;
  try {
    const { rows } = await db.query(
      `UPDATE runs SET distance=$1, duration=$2, pace=$3, route=$4, ended_at=NOW()
       WHERE id=$5 AND user_id=$6 RETURNING *`,
      [distance, duration, pace, JSON.stringify(route), req.params.id, req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Run not found' });
    await db.query(
      'UPDATE users SET total_distance = total_distance + $1 WHERE id=$2',
      [distance || 0, req.user.id]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/my', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM runs WHERE user_id=$1 AND ended_at IS NOT NULL ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/club/:clubId', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT r.*, u.name as user_name, u.avatar_url
       FROM runs r JOIN users u ON u.id=r.user_id
       WHERE r.club_id=$1 AND r.ended_at IS NOT NULL ORDER BY r.created_at DESC`,
      [req.params.clubId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

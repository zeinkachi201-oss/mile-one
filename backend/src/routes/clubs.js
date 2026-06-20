const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT rc.*, u.name as owner_name FROM run_clubs rc JOIN users u ON u.id=rc.owner_id ORDER BY rc.created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  const { name, description, location, is_private } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO run_clubs (name, description, location, owner_id, is_private) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [name, description, location, req.user.id, is_private || false]
    );
    await db.query(
      'INSERT INTO club_members (club_id, user_id, role) VALUES ($1,$2,$3)',
      [rows[0].id, req.user.id, 'admin']
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT rc.*, u.name as owner_name FROM run_clubs rc JOIN users u ON u.id=rc.owner_id WHERE rc.id=$1',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Club not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/join', auth, async (req, res) => {
  try {
    await db.query(
      'INSERT INTO club_members (club_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [req.params.id, req.user.id]
    );
    await db.query(
      'UPDATE run_clubs SET member_count = member_count + 1 WHERE id=$1',
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/leave', auth, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM club_members WHERE club_id=$1 AND user_id=$2',
      [req.params.id, req.user.id]
    );
    await db.query(
      'UPDATE run_clubs SET member_count = GREATEST(member_count - 1, 0) WHERE id=$1',
      [req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/members', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT u.id, u.name, u.avatar_url, cm.role, cm.joined_at FROM club_members cm JOIN users u ON u.id=cm.user_id WHERE cm.club_id=$1',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/posts', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT cp.*, u.name as user_name, u.avatar_url FROM club_posts cp JOIN users u ON u.id=cp.user_id WHERE cp.club_id=$1 ORDER BY cp.created_at DESC',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/posts', auth, async (req, res) => {
  const { content, image_url, run_id } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO club_posts (club_id, user_id, content, image_url, run_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [req.params.id, req.user.id, content, image_url, run_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

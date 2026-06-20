const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

router.get('/club/:clubId', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
       FROM messages m JOIN users u ON u.id=m.sender_id
       WHERE m.club_id=$1 ORDER BY m.created_at ASC LIMIT 100`,
      [req.params.clubId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/club/:clubId', auth, async (req, res) => {
  const { content } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO messages (sender_id, club_id, content) VALUES ($1,$2,$3) RETURNING *',
      [req.user.id, req.params.clubId, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/dm-list', auth, async (req, res) => {
  const me = req.user.id;
  try {
    const { rows } = await db.query(
      `SELECT DISTINCT ON (other_user)
         CASE WHEN m.sender_id=$1 THEN m.dm_user_id ELSE m.sender_id END as other_user,
         u.name as other_name, u.avatar_url as other_avatar,
         m.content as last_message, m.created_at as last_at
       FROM messages m
       JOIN users u ON u.id = CASE WHEN m.sender_id=$1 THEN m.dm_user_id ELSE m.sender_id END
       WHERE m.club_id IS NULL AND (m.sender_id=$1 OR m.dm_user_id=$1)
       ORDER BY other_user, m.created_at DESC`,
      [me]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/dm/:userId', auth, async (req, res) => {
  const me = req.user.id;
  const other = req.params.userId;
  try {
    const { rows } = await db.query(
      `SELECT m.*, u.name as sender_name, u.avatar_url as sender_avatar
       FROM messages m JOIN users u ON u.id=m.sender_id
       WHERE m.club_id IS NULL AND (
         (m.sender_id=$1 AND m.dm_user_id=$2) OR
         (m.sender_id=$2 AND m.dm_user_id=$1)
       ) ORDER BY m.created_at ASC LIMIT 100`,
      [me, other]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/dm/:userId', auth, async (req, res) => {
  const { content } = req.body;
  try {
    const { rows } = await db.query(
      'INSERT INTO messages (sender_id, dm_user_id, content) VALUES ($1,$2,$3) RETURNING *',
      [req.user.id, req.params.userId, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

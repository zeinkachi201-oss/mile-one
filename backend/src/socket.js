const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

let io;

function initSocket(server) {
  io = new Server(server, { cors: { origin: '*' } });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    socket.join(`user:${userId}`);

    socket.on('join_club', (clubId) => socket.join(`club:${clubId}`));
    socket.on('leave_club', (clubId) => socket.leave(`club:${clubId}`));

    socket.on('send_club_message', ({ clubId, content }) => {
      const message = {
        id: uuidv4(),
        sender_id: userId,
        club_id: clubId,
        content,
        created_at: new Date().toISOString(),
      };
      io.to(`club:${clubId}`).emit('new_club_message', message);
    });

    socket.on('send_dm', ({ toUserId, content }) => {
      const message = {
        id: uuidv4(),
        sender_id: userId,
        dm_user_id: toUserId,
        content,
        created_at: new Date().toISOString(),
      };
      io.to(`user:${toUserId}`).emit('new_dm', message);
      socket.emit('new_dm', message);
    });

    socket.on('location_update', ({ runId, lat, lng }) => {
      socket.to(`run:${runId}`).emit('runner_location', { userId, lat, lng });
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = { initSocket, getIO };

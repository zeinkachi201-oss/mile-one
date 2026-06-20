const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const { initSocket } = require('./socket');
const authRoutes = require('./routes/auth');
const clubRoutes = require('./routes/clubs');
const messageRoutes = require('./routes/messages');
const runRoutes = require('./routes/runs');
const userRoutes = require('./routes/users');

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/users', userRoutes);

app.get('/health', (_, res) => res.json({ status: 'ok' }));

initSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

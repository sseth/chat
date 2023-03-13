const http = require('http');
const express = require('express');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  },
});

const crypto = require('crypto');
const randomId = () => crypto.randomBytes(8).toString('hex');

const { InMemorySessionStore } = require('./sessionStore');
const sessionStore = new InMemorySessionStore();

io.use((socket, next) => {
  const { sessionID } = socket.handshake.auth;
  if (sessionID) {
    const session = sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }

  const { username } = socket.handshake.auth;
  if (!username) return next(new Error('invalid username'));
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.username = username;
  next();
});

app.get('/', (req, res) => {
  res.send('<h1>test</h1>');
});

io.on('connection', (socket) => {
  console.log('connected:', socket.id);

  const users = [];
  const sockets = io.of('/').sockets;
  for (let [id, socket] of sockets) {
    users.push({
      id,
      name: socket.username,
    });
  }
  socket.emit('users', users);

  socket.broadcast.emit('user_connected', {
    id: socket.id,
    name: socket.username,
  });

  socket.on('message', ({ id, to, content }) => {
    socket.to(to).emit('message', {
      id,
      content,
      from: socket.id,
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user_disconnected', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});

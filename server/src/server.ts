import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());

interface User {
  id: string;
  name: string;
  vote: string | null;
}

const rooms: { [key: string]: User[] } = {};

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-room', ({ roomId, name }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }
    // Check if the user is already in the room
    const existingUser = rooms[roomId].find(user => user.name === name);
    if (!existingUser) {
      rooms[roomId].push({ id: socket.id, name, vote: null });
    } else {
      existingUser.id = socket.id; // Update the socket id for existing user
    }
    io.to(roomId).emit('update-users', rooms[roomId]);
  });

  socket.on('vote', ({ roomId, vote }) => {
    const room = rooms[roomId];
    const user = room.find(u => u.id === socket.id);
    if (user) {
      user.vote = vote;
      io.to(roomId).emit('update-users', room);
    }
  });

  socket.on('reveal-votes', (roomId) => {
    io.to(roomId).emit('votes-revealed');
  });

  socket.on('reset-votes', (roomId) => {
    const room = rooms[roomId];
    room.forEach(user => user.vote = null);
    io.to(roomId).emit('update-users', room);
  });

  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(user => user.id !== socket.id);
      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      } else {
        io.to(roomId).emit('update-users', rooms[roomId]);
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

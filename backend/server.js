const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();

const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running');
});

// Middleware to handle errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Set to store all room IDs
const rooms = new Set();

io.on('connection', (socket) => {
    console.log('New client connected');

    // Event for creating a room
    socket.on('createRoom', (roomId) => {
        try {
            socket.join(roomId);
            rooms.add(roomId); // Add room ID to the set
            io.emit('roomCreated', roomId); // Notify all clients about the new room
            console.log(`Room created: ${roomId}`);
        } catch (error) {
            console.error(`Error creating room ${roomId}:`, error);
            socket.emit('error', 'Error creating room');
        }
    });

    // Event for joining a room
    socket.on('join', (roomId) => {
        try {
            socket.join(roomId);
            io.to(roomId).emit('newUserJoined', roomId);
            console.log(`Client joined room ${roomId}`);
        } catch (error) {
            console.error(`Error joining room ${roomId}:`, error);
            socket.emit('error', 'Error joining room');
        }
    });

    // Event for receiving a message
    socket.on('message', (message) => {
        try {
            console.log('Received message:', message);
            io.emit('message', message);
        } catch (error) {
            console.error('Error handling message:', error);
            socket.emit('error', 'Error handling message');
        }
    });

    // Event for leaving a room
    socket.on('leave', (roomId) => {
        try {
            socket.leave(roomId);
            io.to(roomId).emit('userLeft', roomId);
            console.log(`Client left room ${roomId}`);

            const room = io.sockets.adapter.rooms.get(roomId);
            if (!room) {
                rooms.delete(roomId); // Remove room ID from the set if empty
                io.emit('allUsersLeft', roomId);
                console.log(`All users left room ${roomId}`);
            }
        } catch (error) {
            console.error(`Error leaving room ${roomId}:`, error);
            socket.emit('error', 'Error leaving room');
        }
    });

    // Event for leaving all rooms
    socket.on('leaveAll', () => {
        try {
            const socketRooms = Array.from(socket.rooms).slice(1); // Exclude the socket ID room
            socketRooms.forEach((roomId) => {
                socket.leave(roomId);
                io.to(roomId).emit('userLeft', roomId);
                console.log(`Client left room ${roomId}`);

                const room = io.sockets.adapter.rooms.get(roomId);
                if (!room) {
                    rooms.delete(roomId); // Remove room ID from the set if empty
                    io.emit('allUsersLeft', roomId);
                    console.log(`All users left room ${roomId}`);
                }
            });
        } catch (error) {
            console.error('Error leaving all rooms:', error);
            socket.emit('error', 'Error leaving all rooms');
        }
    });

    // Event for client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Event for handling socket errors
    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
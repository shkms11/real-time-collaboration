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

// Function to check if a room exists
const checkRoomExists = (roomId) => {
    return rooms.has(roomId);
};

// Store socket instances
const sockets = new Map();

// HTTP endpoint to get all rooms
app.get('/api/rooms', (req, res) => {
    res.json(Array.from(rooms));
});

// HTTP endpoint to create a room
app.post('/api/rooms', (req, res) => {
    const { roomId } = req.body;
    try {
        if (checkRoomExists(roomId)) {
            return res.status(400).json({ error: 'Room already exists' });
        }
        rooms.add(roomId); // Add room ID to the set
        io.emit('roomCreated', roomId); // Notify all clients about the new room
        console.log(`Room created: ${roomId}`);
        res.status(201).json({ message: `Room ${roomId} created` });
    } catch (error) {
        console.error(`Error creating room ${roomId}:`, error);
        res.status(500).json({ error: 'Error creating room' });
    }
});

// HTTP endpoint to join a room
app.post('/api/rooms/:roomId/join', (req, res) => {
    const { roomId } = req.params;
    try {
        if (!checkRoomExists(roomId)) {
            return res.status(404).json({ error: 'Room not found' });
        }
        //debuugging
        console.log('current sockets: ', Array.from(sockets.keys()));
        // Use the first connected socket to join the room
        const socket = Array.from(sockets.values())[0];
        if (socket) {
            socket.join(roomId);
            io.to(roomId).emit('newUserJoined', roomId);
            console.log(`Client joined room ${roomId}`);
            res.status(200).json({ message: `Joined room ${roomId}` });
        } else {
            res.status(500).json({ error: 'No active socket connection' });
        }
    } catch (error) {
        console.error(`Error joining room ${roomId}:`, error);
        res.status(500).json({ error: 'Error joining room' });
    }
});

// HTTP endpoint to leave a room
app.post('/api/rooms/:roomId/leave', (req, res) => {
    const { roomId } = req.params;
    try {
        // Use the first connected socket to leave the room
        const socket = Array.from(sockets.values())[0];
        if (socket) {
            socket.leave(roomId);
            io.to(roomId).emit('userLeft', roomId);
            console.log(`Client left room ${roomId}`);

            const room = io.sockets.adapter.rooms.get(roomId);
            if (!room) {
                rooms.delete(roomId); // Remove room ID from the set if empty
                io.emit('allUsersLeft', roomId);
                console.log(`All users left room ${roomId}`);
            }
            res.status(200).json({ message: `Left room ${roomId}` });
        } else {
            res.status(500).json({ error: 'No active socket connection' });
        }
    } catch (error) {
        console.error(`Error leaving room ${roomId}:`, error);
        res.status(500).json({ error: 'Error leaving room' });
    }
});

// HTTP endpoint to send a message
app.post('/api/messages', (req, res) => {
    const { content } = req.body;
    try {
        // Logic to handle the message
        io.emit('message', content);
        res.status(200).json({ message: 'Message sent' });
    } catch (error) {
        console.error('Error handling message:', error);
        res.status(500).json({ error: 'Error handling message' });
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');
    sockets.set(socket.id, socket);

    // Send the list of existing rooms to the new client
    socket.emit('existingRooms', Array.from(rooms));

    // Event for creating a room
    socket.on('createRoom', (roomId) => {
        try {
            if (checkRoomExists(roomId)) {
                socket.emit('error', 'Room already exists');
                return;
            }
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
    socket.on('joinRoom', (roomId) => {
        try {
            if (!checkRoomExists(roomId)) {
                socket.emit('error', 'Room does not exist');
                return;
            }
            socket.join(roomId);
            io.to(roomId).emit('newUserJoined', roomId);
            console.log(`Client joined room ${roomId}`);
            socket.emit('joinedRoom', { message: `Joined room ${roomId}` });
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
    socket.on('leaveRoom', (roomId) => {
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
    socket.on('leaveAllRooms', () => {
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
        sockets.delete(socket.id);
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
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// App setup
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static('public')); // Ensure static files like CSS and JS are served

// Root route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Store users
const users = {};

// Handle socket.io connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // When a new user joins
    socket.on('new-user', (name) => {
        users[socket.id] = name; // Map socket ID to username
        socket.broadcast.emit('user-joined', name); // Notify others
        io.emit('update-users', Object.values(users)); // Update live user panel
    });

    // When a user sends a message
    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message, name: users[socket.id] });
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        const name = users[socket.id];
        if (name) {
            delete users[socket.id]; // Remove user from the list
            socket.broadcast.emit('user-left', name); // Notify others
            io.emit('update-users', Object.values(users)); // Update live user panel
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

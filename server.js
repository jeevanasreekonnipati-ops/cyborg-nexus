const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Keep track of connected nodes (users)
let activeNodesCount = 14200; // Starting baseline to look realistic
const activeUsers = new Set();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    // Assign a random 'Callsign' to the user
    const callsign = 'Node-' + Math.floor(Math.random() * 9000 + 1000);
    activeUsers.add(socket.id);
    
    // Broadcast updated active nodes count
    const currentNodes = activeNodesCount + activeUsers.size;
    io.emit('active_nodes_update', currentNodes);

    // Send welcome message to the connected user
    socket.emit('chat_message', {
        sender: 'SYSTEM',
        text: `Welcome to the Neural Comm Link, ${callsign}. Connections secure.`,
        isSystem: true
    });

    // Handle incoming chat messages
    socket.on('chat_message', (msg) => {
        // Broadcast message to everyone
        io.emit('chat_message', {
            sender: callsign,
            text: msg,
            isSystem: false
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        activeUsers.delete(socket.id);
        // Broadcast updated active nodes count
        const currentNodes = activeNodesCount + activeUsers.size;
        io.emit('active_nodes_update', currentNodes);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Cyborg Nexus Server running on http://localhost:${PORT}`);
});

const net = require('net');

const clientsStatus = {}; // To track last heartbeat time for each client
const TIMEOUT = 5000; // Timeout in milliseconds (5 seconds)

// Start a server
const server = net.createServer((socket) => {
    const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`[INFO] New client connected: ${clientAddress}`);
    clientsStatus[clientAddress] = Date.now();

    // Handle incoming data
    socket.on('data', (data) => {
        const message = data.toString().trim();
        if (message === 'HEARTBEAT') {
            console.log(`[HEARTBEAT] Received from ${clientAddress}`);
            clientsStatus[clientAddress] = Date.now();
        } else {
            console.log(`[WARNING] Unexpected message from ${clientAddress}: ${message}`);
        }
    });

    // Handle client disconnection
    socket.on('end', () => {
        console.log(`[INFO] Client disconnected: ${clientAddress}`);
        delete clientsStatus[clientAddress];
    });

    // Handle errors
    socket.on('error', (err) => {
        console.error(`[ERROR] Error with client ${clientAddress}: ${err.message}`);
    });
});

// Periodically monitor client heartbeats
setInterval(() => {
    const currentTime = Date.now();
    for (const [client, lastSeen] of Object.entries(clientsStatus)) {
        if (currentTime - lastSeen > TIMEOUT) {
            console.log(`[ALERT] Client ${client} missed heartbeat!`);
            delete clientsStatus[client];
        }
    }
}, 1000); // Check every second

// Start the server
const PORT = 5555;
server.listen(PORT, () => {
    console.log(`[INFO] Server is running on port ${PORT}`);
});
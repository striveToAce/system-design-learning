const net = require('net');

const HOST = '127.0.0.1';
const PORT = 5555;
const HEARTBEAT_INTERVAL = 2000; // Interval in milliseconds (2 seconds)

// Connect to the server
const client = net.createConnection({ host: HOST, port: PORT }, () => {
    console.log(`[INFO] Connected to server at ${HOST}:${PORT}`);
});

// Send periodic heartbeats
const sendHeartbeat = () => {
    client.write('HEARTBEAT');
    console.log(`[HEARTBEAT] Sent`);
};

// Start sending heartbeats at regular intervals
const heartbeatInterval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

// Handle server disconnection
client.on('end', () => {
    console.log(`[INFO] Disconnected from server`);
    clearInterval(heartbeatInterval);
});

// Handle errors
client.on('error', (err) => {
    console.error(`[ERROR] Error: ${err.message}`);
    clearInterval(heartbeatInterval);
});
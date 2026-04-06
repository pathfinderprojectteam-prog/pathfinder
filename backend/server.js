
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const http = require('http');
const initSocket = require('./socket');

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
const io = initSocket(server);

// Make io globally available if needed by controllers later
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});


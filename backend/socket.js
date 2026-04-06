const socketIo = require('socket.io');

const initSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  const onlineUsers = new Map(); // Map userId -> socketId

  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // User comes online
    socket.on('register_user', (userId) => {
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      socket.userId = userId;
      console.log(`👤 User ${userId} is now online (socket: ${socket.id})`);
      // Broadcast to EVERYONE that this user came online
      io.emit('user_status_change', { userId, status: 'online' });
      
      // Send CURRENT online users to the newly connected user
      const onlineUserIds = Array.from(onlineUsers.keys());
      socket.emit('initial_online_users', onlineUserIds);
    });

    // Join a specific conversation room
    socket.on('join_room', (conversationId) => {
      if (!conversationId) return;
      socket.join(conversationId);
      console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    // Leave a specific conversation room
    socket.on('leave_room', (conversationId) => {
      if (!conversationId) return;
      socket.leave(conversationId);
      console.log(`Socket ${socket.id} left conversation ${conversationId}`);
    });

    // Handle new message (the saving to DB still happens via REST, 
    // we use this just to broadcast the raw saved message instantly)
    socket.on('send_message', (data) => {
      const { conversationId, message } = data;
      // Broadcast to everyone else in the room
      socket.to(conversationId).emit('receive_message', message);
    });

    // Typing indicators
    socket.on('typing_start', (data) => {
      const { conversationId, userId } = data;
      socket.to(conversationId).emit('user_typing', { conversationId, userId, isTyping: true });
    });

    socket.on('typing_stop', (data) => {
      const { conversationId, userId } = data;
      socket.to(conversationId).emit('user_typing', { conversationId, userId, isTyping: false });
    });

    // Read receipts
    socket.on('mark_as_read', (data) => {
      const { conversationId, userId, messageIds } = data;
      // Tell everyone in the room that these messages were read by this user
      socket.to(conversationId).emit('messages_read', { conversationId, userId, messageIds });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      if (socket.userId) {
        onlineUsers.delete(socket.userId);
        io.emit('user_status_change', { userId: socket.userId, status: 'offline' });
      }
    });
  });

  return io;
};

module.exports = initSocket;

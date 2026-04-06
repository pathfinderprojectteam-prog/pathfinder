import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5001';

let socket = null;

export const initSocket = (userId) => {
  if (socket) return socket;
  
  socket = io(SOCKET_URL, {
    withCredentials: true
  });
  
  socket.on('connect', () => {
    console.log('Connected to socket server');
    if (userId) {
      socket.emit('register_user', userId);
    }
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

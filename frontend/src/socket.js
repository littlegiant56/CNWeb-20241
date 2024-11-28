import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? "https://web-20232.onrender.com" : 'http://localhost:5001';

// Create a socket connection
export const socket = io(URL, {
  query: {
    userId: localStorage.getItem('userId')
  },
  autoConnect: false
});
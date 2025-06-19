// src/sockets/socket.js
import { io } from "socket.io-client";

// Make sure this URL matches your backend (dev: localhost, prod: Render)
export const socket = io("https://poll-system-server.onrender.com");

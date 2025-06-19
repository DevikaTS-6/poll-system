// src/sockets/socket.js
import { io } from "socket.io-client";

// Make sure this URL matches your backend (dev: localhost, prod: Render)
export const socket = io("http://localhost:5000");

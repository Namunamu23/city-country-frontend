// frontend/src/socket.js

import { io } from "socket.io-client";

// Use the environment variable for the backend URL
const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; 
// Default to localhost if the variable isn't set

const socket = io(backendUrl); // Initialize socket with backend URL

export default socket;
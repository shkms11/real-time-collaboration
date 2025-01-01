import axios from "axios";
import { io } from "socket.io-client";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
});

// Initialize Socket.IO client
const socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"],
});

socket.on("connect", () => {
    console.log("Connected to Socket.IO server");
});

socket.on("disconnect", () => {
    console.log("Disconnected from Socket.IO server");
});

// Fetch the list of existing rooms
export const getRooms = async () => {
    try {
        const response = await api.get("/rooms");
        return response.data;
    } catch (error) {
        console.error("Error fetching rooms:", error);
        throw error;
    }
};

// Create a new room
export const createRoom = async (roomId: string) => {
    try {
        const response = await api.post("/rooms", { roomId });
        return response.data;
    } catch (error) {
        console.error("Error creating room:", error);
        throw error;
    }
};

// Join an existing room
export const joinRoom = async (roomId: string) => {
    try {
        const response = await api.post(`/rooms/${roomId}/join`);
        return response.data;
    } catch (error) {
        console.error("Error joining room:", error);
        throw error;
    }
};

// Leave a room
export const leaveRoom = async (roomId: string) => {
    try {
        const response = await api.post(`/rooms/${roomId}/leave`);
        return response.data;
    } catch (error) {
        console.error("Error leaving room:", error);
        throw error;
    }
};

// Send a message
export const sendMessage = async (content: string) => {
    try {
        const response = await api.post("/messages", { content });
        return response.data;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

// Export the socket instance for use in other components
export { socket };

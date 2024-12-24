import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentRoomId } from "./socketSlice";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const Chat: React.FC = () => {
    const [message, setMessage] = useState<string>("");
    const [messages, setMessages] = useState<string[]>([]);
    const currentRoomId = useSelector(selectCurrentRoomId);

    useEffect(() => {
        // Listen for incoming messages
        socket.on("message", (newMessage: string) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // Cleanup on component unmount
        return () => {
            socket.off("message");
        };
    }, []);

    const sendMessage = () => {
        if (message.trim() !== "" && currentRoomId) {
            socket.emit("message", message);
            setMessage(""); // Clear the input field after sending the message
        } else if (!currentRoomId) {
            alert("You must be in a room to send a message.");
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default Chat;

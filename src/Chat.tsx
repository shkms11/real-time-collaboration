import "./chat.css";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentRoomId } from "./redux/socketSlice";
import { socket } from "./api";

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
        <div className="flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">Chat</h2>
            <div className="w-full max-w-lg mb-4 p-4 border rounded bg-gray-100">
                {messages.map((msg, index) => (
                    <p key={index} className="mb-2">
                        {msg}
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                className="mb-2 px-4 py-2 border rounded w-full max-w-lg"
            />
            <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
                Send
            </button>
        </div>
    );
};

export default Chat;

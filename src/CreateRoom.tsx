import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const CreateRoom: React.FC = () => {
    const [newRoomId, setNewRoomId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        socket.on("error", (errorMessage: string) => {
            setError(errorMessage);
        });

        return () => {
            socket.off("error");
        };
    }, []);

    const createRoom = () => {
        if (newRoomId.trim() !== "") {
            console.log(`Creating room: ${newRoomId}`); // Debugging log
            socket.emit("createRoom", newRoomId);
            setNewRoomId("");
            setError(null);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={newRoomId}
                onChange={(e) => setNewRoomId(e.target.value)}
                placeholder="Enter room ID"
            />
            <button onClick={createRoom}>Create Room</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default CreateRoom;

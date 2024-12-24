import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store";
import {
    setConnectedUsers,
    setCurrentRoomId,
    selectCurrentRoomId,
} from "./socketSlice";
import io from "socket.io-client";
import CreateRoom from "./CreateRoom";

const socket = io("http://localhost:5000");

const RoomList: React.FC = () => {
    const dispatch = useDispatch();
    const rooms = useSelector(
        (state: RootState) => state.socket.connectedUsers
    );
    const currentRoomId = useSelector(selectCurrentRoomId);
    const [availableRooms, setAvailableRooms] = useState<string[]>([]);

    useEffect(() => {
        // Listen for existing rooms when the client connects
        socket.on("existingRooms", (rooms: string[]) => {
            setAvailableRooms(rooms);
        });

        // Listen for new users joining rooms
        socket.on("newUserJoined", (roomId: string) => {
            setAvailableRooms((prevRooms) => {
                if (!prevRooms.includes(roomId)) {
                    return [...prevRooms, roomId];
                }
                return prevRooms;
            });
        });

        // Listen for new rooms being created
        socket.on("roomCreated", (roomId: string) => {
            setAvailableRooms((prevRooms) => {
                if (!prevRooms.includes(roomId)) {
                    return [...prevRooms, roomId];
                }
                return prevRooms;
            });
        });

        // Cleanup on component unmount
        return () => {
            socket.off("existingRooms");
            socket.off("newUserJoined");
            socket.off("roomCreated");
        };
    }, []);

    const joinRoom = (roomId: string) => {
        socket.emit("join", roomId);
        dispatch(setCurrentRoomId(roomId));
        dispatch(setConnectedUsers([...rooms, roomId]));
    };

    return (
        <div>
            <div>
                <h2>Available Rooms:</h2>
                <ul>
                    {availableRooms.map((roomId) => (
                        <li key={roomId}>
                            <button onClick={() => joinRoom(roomId)}>
                                Join Room {roomId}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2>Create a Room</h2>
                <CreateRoom />
            </div>
            <div>
                <h2>Current Room</h2>
                {currentRoomId ? (
                    <p>{currentRoomId}</p>
                ) : (
                    <p>No room selected</p>
                )}
            </div>
        </div>
    );
};

export default RoomList;

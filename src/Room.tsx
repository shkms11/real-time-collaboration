import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRooms, createRoom, joinRoom, leaveRoom, socket } from "./api";
import Chat from "./Chat";
import { RootState, AppDispatch } from "./redux/store";
import { setRooms, addRoom, setCurrentRoomId } from "./redux/socketSlice";

const Room = () => {
    const rooms = useSelector((state: RootState) => state.socket.rooms);
    const currentRoomId = useSelector(
        (state: RootState) => state.socket.currentRoomId
    );
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        // Fetch the list of existing rooms when the component mounts
        const fetchRooms = async () => {
            try {
                const rooms = await getRooms();
                dispatch(setRooms(rooms));
            } catch (error) {
                console.error("Error fetching rooms:", error);
            }
        };

        fetchRooms();

        // Handle socket events
        socket.on("roomCreated", (roomId) => {
            console.log(`Room created: ${roomId}`);
            dispatch(addRoom(roomId));
        });

        socket.on("newUserJoined", (roomId) => {
            console.log(`New user joined room: ${roomId}`);
        });

        return () => {
            // Clean up socket events
            socket.off("roomCreated");
            socket.off("newUserJoined");
        };
    }, [dispatch]);

    const handleCreateRoom = async () => {
        const roomId = prompt("Enter room ID to create:");
        if (roomId) {
            try {
                const response = await createRoom(roomId);
                console.log(response.message);
                dispatch(addRoom(roomId));
            } catch (error) {
                console.error("Error creating room:", error);
            }
        }
    };

    const handleJoinRoom = async (roomId: string) => {
        try {
            const response = await joinRoom(roomId);
            console.log(response.message);
            dispatch(setCurrentRoomId(roomId));
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    const handleLeaveRoom = async () => {
        if (currentRoomId) {
            try {
                const response = await leaveRoom(currentRoomId);
                console.log(response.message);
                dispatch(setCurrentRoomId(null));
            } catch (error) {
                console.error("Error leaving room:", error);
            }
        }
    };

    return (
        <div>
            <h1>Real-Time Collaboration Test</h1>
            <div>
                <h2>Rooms</h2>
                <ul>
                    {rooms.map((room) => (
                        <li key={room}>
                            {room}
                            <button onClick={() => handleJoinRoom(room)}>
                                Join
                            </button>
                        </li>
                    ))}
                </ul>
                <button onClick={handleCreateRoom}>Create Room</button>
            </div>
            {currentRoomId && (
                <div>
                    <h2>Current Room: {currentRoomId}</h2>
                    <button onClick={handleLeaveRoom}>Leave Room</button>
                    <Chat />
                </div>
            )}
        </div>
    );
};

export default Room;

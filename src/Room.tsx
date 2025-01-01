import "./input.css";
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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Real-Time Collaboration Test
            </h1>
            <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Rooms</h2>
                <ul className="list-disc pl-5">
                    {rooms.map((room) => (
                        <li key={room} className="mb-2">
                            {room}
                            <button
                                className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
                                onClick={() => handleJoinRoom(room)}
                            >
                                Join
                            </button>
                        </li>
                    ))}
                </ul>
                <button
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    onClick={handleCreateRoom}
                >
                    Create Room
                </button>
            </div>
            {currentRoomId && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">
                        Current Room: {currentRoomId}
                    </h2>
                    <button
                        className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                        onClick={handleLeaveRoom}
                    >
                        Leave Room
                    </button>
                    <Chat />
                </div>
            )}
        </div>
    );
};

export default Room;

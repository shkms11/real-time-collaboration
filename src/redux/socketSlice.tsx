import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface RoomState {
    rooms: string[];
    currentRoomId: string | null;
    connectedUsers: string[];
}

const initialState: RoomState = {
    rooms: [],
    currentRoomId: null,
    connectedUsers: [],
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setRooms(state, action: PayloadAction<string[]>) {
            state.rooms = action.payload;
        },
        addRoom(state, action: PayloadAction<string>) {
            state.rooms.push(action.payload);
        },
        setCurrentRoomId(state, action: PayloadAction<string | null>) {
            state.currentRoomId = action.payload;
        },
        setConnectedUsers(state, action: PayloadAction<string[]>) {
            state.connectedUsers = action.payload;
        },
    },
});

export const selectCurrentRoomId = (state: RootState) =>
    state.socket.currentRoomId;
export const selectRooms = (state: RootState) => state.socket.rooms;
export const selectConnectedUsers = (state: RootState) =>
    state.socket.connectedUsers;

export const { setRooms, addRoom, setCurrentRoomId, setConnectedUsers } =
    socketSlice.actions;
export default socketSlice.reducer;

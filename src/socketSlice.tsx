import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

const initialState = {
    connectedUsers: [],
    currentRoomId: null,
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setConnectedUsers(state, action) {
            state.connectedUsers = action.payload;
        },
        setCurrentRoomId(state, action) {
            state.currentRoomId = action.payload;
        },
    },
});

export const selectCurrentRoomId = (state: RootState) =>
    state.socket.currentRoomId;

export const { setConnectedUsers, setCurrentRoomId } = socketSlice.actions;
export default socketSlice.reducer;

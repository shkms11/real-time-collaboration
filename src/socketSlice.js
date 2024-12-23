import { createSlice } from "@reduxjs/toolkit";


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


export const { setConnectedUsers, setCurrentRoomId } = socketSlice.actions;
export default socketSlice.reducer;
import { configureStore } from "@reduxjs/toolkit";
import socketReducer from "./socketSlice";

export const store = configureStore({
    reducer: {
        socket: socketReducer,
    },
});
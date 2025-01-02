// @ts-nocheck
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Room from "./Room";
import { setRooms, addRoom, setCurrentRoomId } from "./redux/socketSlice";
import "@testing-library/jest-dom"; // For custom matchers

const mockStore = configureStore([]);
const initialState = {
    socket: {
        rooms: ["room1", "room2"],
        currentRoomId: null,
    },
};

describe("Room Component", () => {
    let store;
    beforeEach(() => {
        store = mockStore(initialState);
    });

    it("renders the Room component", () => {
        render(
            <Provider store={store}>
                <Room />
            </Provider>
        );

        expect(
            screen.getByText("Real-Time Collaboration Test")
        ).toBeInTheDocument();
        expect(screen.getByText("Rooms")).toBeInTheDocument();
        expect(screen.getByText("room1")).toBeInTheDocument();
        expect(screen.getByText("room2")).toBeInTheDocument();
    });

    // it("handles creating a room", () => {
    //     window.prompt = vi.fn().mockReturnValue("NewRoom");

    //     render(
    //         <Provider store={store}>
    //             <Room />
    //         </Provider>
    //     );

    //     const createRoomButton = screen.getByText("Create Room");
    //     fireEvent.click(createRoomButton);

    //     // Dispatch the action to add the new room
    //     store.dispatch(addRoom("NewRoom"));

    //     expect(screen.getByText("NewRoom")).toBeInTheDocument();
    // });
});

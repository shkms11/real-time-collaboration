import "./input.css";
import { Provider } from "react-redux";
import store from "./store";
import RoomList from "./RoomList";
import Chat from "./Chat";

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <RoomList />
                <Chat />
            </div>
        </Provider>
    );
}

export default App;

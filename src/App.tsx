import "./input.css";
import { Provider } from "react-redux";
import store from "./store";
import RoomList from "./RoomList";

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <RoomList />
            </div>
        </Provider>
    );
}

export default App;

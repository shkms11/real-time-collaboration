import "./input.css";
import { Provider } from "react-redux";
import store from "./redux/store";

import Room from "./Room";
// import RoomList from "./RoomList";
// import Chat from "./Chat";

function App() {
    return (
        <Provider store={store}>
            <div className="App">
                <Room />
            </div>
        </Provider>
    );
}

export default App;

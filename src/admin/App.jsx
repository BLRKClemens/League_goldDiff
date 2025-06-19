import { useSetupSocket } from "../shared/hooks/useSetupSocket";
import { socket } from "../shared/socket";
import { useEffect, useState } from "react";
function App() {
  const [state, setState] = useState({});
  useSetupSocket(socket);
  useEffect(() => {
    socket.on("updateState", (newState) => {
      setState(newState);
    });
  }, []);

  const setStateAndEmit = (newState) => {
    setState(newState);
    socket.emit("updateState", newState);
  };

  return (
    <>
      <div className="App">
        <button
          onClick={() => {
            setStateAndEmit({ ...state, counter: state?.counter + 1 });
          }}
        >
          You pressed me {state.counter} times
        </button>
        <h1>{state.name}</h1>
      </div>
    </>
  );
}

export default App;

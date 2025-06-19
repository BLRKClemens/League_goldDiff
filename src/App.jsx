import { useEffect, useState } from "react";
import { socket } from "./shared/socket";
import { useSetupSocket } from "./shared/hooks/useSetupSocket";
function App() {
  const [state, setState] = useState({});

  useSetupSocket(socket);
  useEffect(() => {
    socket.on("updateState", (newState) => {
      setState(newState);
    });
  }, []);

  return (
    <>
      <h1>{state?.name}</h1>
      <h1>counter {state?.counter}</h1>
    </>
  );
}

export default App;

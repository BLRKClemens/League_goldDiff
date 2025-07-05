import { useEffect, useState } from "react";
import { socket } from "./shared/socket";
import { useSetupSocket } from "./shared/hooks/useSetupSocket";
import LeaderBoard from "./shared/LeaderBoard";
function App() {
  const [state, setState] = useState({});

  useSetupSocket(socket);
  useEffect(() => {
    socket.on("updateState", (newState) => {
      setState(newState);
    });

    return () => socket.off("updateState");
  }, []);

  return (
    <div>
      <LeaderBoard
        leaderBoard={state?.leaderBoard}
        isVisible={state?.visible?.table}
      ></LeaderBoard>
    </div>
  );
}

export default App;

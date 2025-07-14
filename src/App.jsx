import { useEffect, useState } from "react";
import { socket } from "./shared/socket";
import { useSetupSocket } from "./shared/hooks/useSetupSocket";
import LeaderBoard from "./shared/LeaderBoard";
import backgroundImage from "./img/DKBGD3CamsNoTable.png";
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
      <img src={backgroundImage} className="opacity-0" alt="" />
    </div>
  );
}

export default App;

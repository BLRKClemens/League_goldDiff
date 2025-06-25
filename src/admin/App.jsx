import { useSetupSocket } from "../shared/hooks/useSetupSocket";
import { socket } from "../shared/socket";
import { useEffect, useState } from "react";
import LeaderBoard from "../shared/LeaderBoard";
import TeamButton from "./TeamButton";
import GoldDiffInput from "./GoldDiffInput";
import StartPollButton from "./StartPollButton";
function App() {
  const [state, setState] = useState({});
  useSetupSocket(socket);
  useEffect(() => {
    socket.on("updateState", (newState) => {
      console.log(newState);
      setState(newState);
    });
    return () => socket.off("updateState");
  }, []);

  return (
    <>
      <div className="App">
        <div className="flex justify-center items-center flex-col gap-1.5">
          <div className="flex gap-1.5">
            <TeamButton
              socket={socket}
              teamName={"red"}
              teamNameString={"rot"}
              leadingTeam={state.leadingTeam}
            ></TeamButton>
            <TeamButton
              socket={socket}
              teamName={"blue"}
              teamNameString={"blau"}
              leadingTeam={state.leadingTeam}
            ></TeamButton>
          </div>

          <div>
            <GoldDiffInput state={state} setState={setState}></GoldDiffInput>
            <StartPollButton
              socket={socket}
              polling={state.polling}
              goldDiffGoal={state.goldDiffGoal}
            ></StartPollButton>
            {state.polling && (
              <>
                <p>polling...</p>
                <h1>{state?.pollingTime}</h1>
              </>
            )}
          </div>
        </div>

        <LeaderBoard leaderBoard={state?.leaderBoard} />
      </div>
    </>
  );
}

export default App;

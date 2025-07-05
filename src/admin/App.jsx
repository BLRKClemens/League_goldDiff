import { useSetupSocket } from "../shared/hooks/useSetupSocket";
import { socket } from "../shared/socket";
import { useEffect, useState } from "react";
import LeaderBoard from "../shared/LeaderBoard";
import TeamButton from "./TeamButton";
import GoldDiffInput from "./GoldDiffInput";
import StartPollButton from "./StartPollButton";
import CaptainGuess from "./CaptainGuess";
import ToggleButton from "./toggleButton";
import { team } from "../shared/types";
import ResetButton from "./ResetButton";
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
        <div className="flex justify-center items-center flex-col">
          <div className="flex justify-center items-center flex-col gap-1.5 boder-solid border-3 w-fit p-3 rounded-2xl relative z-1 bg-white">
            <div className="flex gap-1.5 justify-center items-center">
              <img
                src="../img/blrk_alpha.png"
                className="w-25 h-auto absolute bottom-0 left-0"
                alt=""
              />
              <CaptainGuess
                socket={socket}
                team={team.red}
                captainGuesses={state.captainGuesses}
                state={state}
                setState={setState}
              ></CaptainGuess>
              <div className="border-dotted border-3 rounded p-3 flex drop-shadow-xl items-center justify-center flex-col">
                <h3 className="font-semibold">LEADING TEAM</h3>
                <div>
                  <TeamButton
                    socket={socket}
                    teamName={"red"}
                    teamNameString={team.red}
                    leadingTeam={state.leadingTeam}
                  ></TeamButton>
                  <TeamButton
                    socket={socket}
                    teamName={"blue"}
                    teamNameString={team.blue}
                    leadingTeam={state.leadingTeam}
                  ></TeamButton>
                </div>
              </div>

              <CaptainGuess
                socket={socket}
                team={team.blue}
                captainGuesses={state.captainGuesses}
                state={state}
                setState={setState}
              ></CaptainGuess>
            </div>

            <div>
              <GoldDiffInput state={state} setState={setState}></GoldDiffInput>
              <StartPollButton
                socket={socket}
                polling={state.polling}
                goldDiffGoal={state.goldDiffGoal}
              ></StartPollButton>
            </div>

            <div className="flex gap-1.5">
              <ToggleButton
                socket={socket}
                state={state}
                setState={setState}
                text={"solution"}
                id={"solution"}
              ></ToggleButton>
              <ToggleButton
                socket={socket}
                state={state}
                setState={setState}
                text={"community vote"}
                id={"table"}
              ></ToggleButton>
              <ResetButton socket={socket}></ResetButton>
            </div>
          </div>
          {/* {state.polling && ( */}
          <div
            className={`flex justify-center items-center font-extrabold flex-col transition-transform duration-1000 -translate-y-12 relative z-0 ${
              state.polling ? "-translate-y-0!" : ""
            }`}
          >
            <h1 className="text-red-600">polling...</h1>
            <h1>{state?.pollingTime}</h1>
          </div>
          {/* )} */}
        </div>

        <LeaderBoard leaderBoard={state?.leaderBoard} />
      </div>
    </>
  );
}

export default App;

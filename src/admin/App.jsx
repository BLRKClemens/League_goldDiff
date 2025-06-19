import { useSetupSocket } from "../shared/hooks/useSetupSocket";
import { socket } from "../shared/socket";
import { useEffect, useState } from "react";
import LeaderBoard from "../shared/LeaderBoard";
function App() {
  const [state, setState] = useState({});
  useSetupSocket(socket);
  useEffect(() => {
    socket.on("updateState", (newState) => {
      setState(newState);
    });
    return () => socket.off("updateState");
  }, []);

  function onTeamButtonClick(e) {
    socket.emit("selectLeadingTeam", e.target.name);
  }

  function onStart() {
    if (state.polling) return;
    const goldDiffGoal = parseInt(
      document.getElementById("goldDiffInput").value
    );
    socket.emit("startPolling", goldDiffGoal);
  }

  return (
    <>
      <div className="App">
        <div className="flex justify-center items-center flex-col gap-1.5">
          <div className="flex gap-1.5">
            <button
              onClick={onTeamButtonClick}
              name="red"
              className={`btn btn-red ${
                state.leadingTeam === "red" && "selected"
              }`}
              // className={state?.leadingTeam === "red" ? "selected" : ""}
            >
              Rot
            </button>
            <button
              onClick={onTeamButtonClick}
              name="blue"
              className={`btn btn-blue ${
                state.leadingTeam === "blue" && "selected"
              }`}
            >
              Blau
            </button>
          </div>

          <div>
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              type="number"
              id="goldDiffInput"
              placeholder="gold difference"
              // value={state?.goldDiffGoal}
            ></input>
            <button
              className="bg-transparent hover:bg-amber-500 text-amber-300-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
              onClick={onStart}
            >
              Start
            </button>
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

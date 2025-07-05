import { useState } from "react";

const CaptainGuess = ({ socket, team, state, setState }) => {
  function updateGuessTeamCaptain() {
    socket.emit("updateGuessTeamCaptain", team, state?.captainGuesses?.[team]);
  }

  return (
    <div className="">
      <input
        type="number"
        className="input"
        placeholder={`Guess Team Captain ${team}`}
        value={state?.captainGuesses?.[team] ?? ""}
        onChange={(e) => {
          const captainGuesses = {
            ...state.captainGuesses,
            [team]: e.target.value,
          };
          setState({ ...state, captainGuesses });
        }}
      ></input>
      <button className="startButton" onClick={updateGuessTeamCaptain}>
        SUBMIT
      </button>
    </div>
  );
};

export default CaptainGuess;

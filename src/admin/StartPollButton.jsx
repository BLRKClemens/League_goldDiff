import React from "react";

const StartPollButton = ({ socket, polling, goldDiffGoal }) => {
  function onStart() {
    if (polling) return;
    console.log(goldDiffGoal);
    socket.emit("startPolling", goldDiffGoal);
  }

  return (
    <button className="startButton" onClick={onStart}>
      Start
    </button>
  );
};

export default StartPollButton;

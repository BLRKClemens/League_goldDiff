import React from "react";

const StartPollButton = ({ socket, polling, goldDiffGoal }) => {
  function onStart() {
    if (polling) return;
    console.log(goldDiffGoal);
    socket.emit("startPolling", goldDiffGoal);
  }

  return (
    <button
      className="bg-transparent hover:bg-amber-500 text-amber-300-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      onClick={onStart}
    >
      Start
    </button>
  );
};

export default StartPollButton;

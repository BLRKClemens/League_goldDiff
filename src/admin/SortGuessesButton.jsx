import React from "react";

const SortGuessesButton = ({ socket, polling, pointGoal }) => {
  function onSort() {
    if (polling) return;
    console.log(pointGoal);
    socket.emit("sortGuesses", pointGoal);
  }

  return (
    <button className="startButton" onClick={onSort}>
      Sort Guesses
    </button>
  );
};

export default SortGuessesButton;

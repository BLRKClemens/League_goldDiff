import React from "react";

const TeamButton = ({ socket, teamName, teamNameString, leadingTeam }) => {
  function onTeamButtonClick(e) {
    socket.emit("selectLeadingTeam", e.target.name);
  }
  return (
    <button
      onClick={onTeamButtonClick}
      name={teamNameString}
      className={`btn btn-${teamName} ${
        leadingTeam === teamNameString && "selected"
      }`}
      // className={state?.leadingTeam === "${teamName}" ? "selected" : ""}
    >
      {teamName.toUpperCase()}
    </button>
  );
};

export default TeamButton;

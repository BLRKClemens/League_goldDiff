import React from "react";

const LeaderBoard = ({ leaderBoard }) => {
  return !leaderBoard || leaderBoard.length === 0 ? (
    <p>no LeaderBoard</p>
  ) : (
    <table className="leaderboard">
      <thead>
        <tr>
          <th>place</th>
          {Object.keys(leaderBoard[0]).map((key) => (
            <th>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {leaderBoard.map((entry, i) => (
          <Row row={entry} place={i + 1}></Row>
        ))}
      </tbody>
    </table>
  );
};

const Row = ({ row, place }) => {
  console.log(Object.entries(row)[1]);
  return (
    <tr>
      <td>{place}</td>
      {Object.values(row).map((value) => (
        <td>{value}</td>
      ))}
    </tr>
  );
};

export default LeaderBoard;

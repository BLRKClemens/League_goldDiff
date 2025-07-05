import React from "react";

const LeaderBoard = ({ leaderBoard, isVisible = true }) => {
  return (
    <div
      className={`transition-opacity duration-1000 flex justify-center ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {!leaderBoard || leaderBoard.length === 0 ? (
        <p className="font-extrabold">{"--- NO LEADERBOARD ---"}</p>
      ) : (
        <table className="leaderboard">
          <thead>
            <tr>
              <th>place</th>
              {Object.keys(leaderBoard[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leaderBoard.map((entry, i) => (
              <Row key={i} row={entry} place={i + 1}></Row>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const Row = ({ row, place }) => {
  return (
    <tr>
      <td>{place}</td>
      {Object.entries(row).map(([key, value]) => (
        <td key={key}>{value}</td>
      ))}
    </tr>
  );
};

export default LeaderBoard;

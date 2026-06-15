import React from "react";

const PointDiffInput = ({ state, setState }) => {
  return (
    <input
      className="input"
      type="number"
      placeholder="point goal"
      onChange={(e) => {
        const value = parseInt(e.target.value);
        const pointGoal = Number.isNaN(value) ? "" : value;
        setState({ ...state, pointGoal });
      }}
      value={state.pointGoal ?? ""}
    ></input>
  );
};

export default PointDiffInput;

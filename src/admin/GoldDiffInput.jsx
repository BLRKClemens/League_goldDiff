import React from "react";

const GoldDiffInput = ({ state, setState }) => {
  return (
    <input
      className="input"
      type="number"
      placeholder="gold difference goal"
      onChange={(e) => {
        const value = parseInt(e.target.value);
        const goldDiffGoal = Number.isNaN(value) ? "" : value;
        setState({ ...state, goldDiffGoal });
      }}
      value={state.goldDiffGoal ?? ""}
    ></input>
  );
};

export default GoldDiffInput;

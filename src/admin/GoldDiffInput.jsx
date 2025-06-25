import React from "react";

const GoldDiffInput = ({ state, setState }) => {
  return (
    <input
      className="bg-gray-200 appearance-none border-2 border-gray-200 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
      type="number"
      placeholder="gold difference"
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

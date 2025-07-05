import React from "react";

const ToggleButton = ({ socket, state, text, id }) => {
  const isVisible = state?.visible?.[id] ?? false;
  function onButtonPressed() {
    socket.emit(`toggle${id}`, !isVisible);
  }
  return (
    <button
      className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
      onClick={onButtonPressed}
    >{`${isVisible ? "Hide" : "Show"} ${text}`}</button>
  );
};

export default ToggleButton;

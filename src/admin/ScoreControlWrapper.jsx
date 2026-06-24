import React, { useContext } from "react";

const ScoreControlWrapper = ({ socket, state }) => {
  return (
    <div className="flex items-center flex-col gap-2">
      <button
        className="bg-orange-400 rounded-2xl text-2xl w-fit p-2 text-white hover:bg-orange-600 cursor-pointer"
        onClick={() => {
          socket.emit("toggleIsPointsVisible");
        }}
      >
        {state.isPointsVisible ? "Hide Points" : "Show Points"}
      </button>

      <div className="flex gap-4 w-full">
        <div className="bg-gray-50 p-2 rounded-2xl border-3 w-full text-center">
          <h1 className="text-lg font-bold">
            Wichtiger ({state?.score?.[0] || 0})
          </h1>
          <ScoreControl socket={socket} scoreIndex={0} />
        </div>
        <div className="bg-gray-50 p-2 rounded-2xl border-3 w-full text-center">
          <h1 className="text-lg font-bold">
            Nooreax ({state?.score?.[1] || 0})
          </h1>
          <ScoreControl socket={socket} scoreIndex={1} />
        </div>
      </div>
    </div>
  );
};

const ScoreControl = ({ socket, scoreIndex }) => {
  return (
    <>
      <Spiel1 socket={socket} scoreIndex={scoreIndex} />
      <Spiel2 socket={socket} scoreIndex={scoreIndex} />
      <Spiel3 socket={socket} scoreIndex={scoreIndex} />
      <Spiel4 socket={socket} scoreIndex={scoreIndex} />
    </>
  );
};

const UpdateMaximumButton = ({ socket, score }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded cursor-pointer"
      onClick={() => socket.emit("updateScoreMaximum", score)}
    >
      update maximum ({score})
    </button>
  );
};

const Spiel1 = ({ socket, scoreIndex }) => {
  return (
    <div>
      <h1 className="text-lg font-bold p-2">
        Spiel 1 <UpdateMaximumButton socket={socket} score={2000} />
      </h1>
      <div className="grid grid-cols-4 gap-2">
        <ScoreButton
          score={25}
          isPositive={true}
          socket={socket}
          scoreIndex={scoreIndex}
        />
        <ScoreButton
          score={50}
          isPositive={true}
          socket={socket}
          scoreIndex={scoreIndex}
        />
        <ScoreButton
          score={75}
          isPositive={true}
          socket={socket}
          scoreIndex={scoreIndex}
        />
        <ScoreButton
          score={100}
          isPositive={true}
          socket={socket}
          scoreIndex={scoreIndex}
        />

        <ScoreButton
          score={25}
          isPositive={false}
          socket={socket}
          scoreIndex={scoreIndex}
        />
        <ScoreButton
          score={50}
          isPositive={false}
          socket={socket}
          scoreIndex={scoreIndex}
        />
        <ScoreButton
          score={75}
          isPositive={false}
          socket={socket}
          scoreIndex={scoreIndex}
        />
        <ScoreButton
          score={100}
          isPositive={false}
          socket={socket}
          scoreIndex={scoreIndex}
        />
      </div>
    </div>
  );
};

const Spiel2 = ({ socket, scoreIndex }) => {
  return (
    <div>
      <h1 className="text-lg font-bold p-2">
        Spiel 2 <UpdateMaximumButton socket={socket} score={2500} />
      </h1>
      <div className="grid grid-cols-3 gap-2">
        <ScoreButton
          score={100}
          isPositive={true}
          socket={socket}
          scoreIndex={scoreIndex}
        />

        <ScoreButton
          score={200}
          isPositive={true}
          socket={socket}
          scoreIndex={scoreIndex}
        />
        <ScoreButton
          score={300}
          isPositive={true}
          socket={socket}
          scoreIndex={scoreIndex}
        />

        <ScoreButton
          score={100}
          isPositive={false}
          socket={socket}
          scoreIndex={scoreIndex}
        />

        <ScoreButton
          score={200}
          isPositive={false}
          socket={socket}
          scoreIndex={scoreIndex}
        />
        <ScoreButton
          score={300}
          isPositive={false}
          socket={socket}
          scoreIndex={scoreIndex}
        />
      </div>
    </div>
  );
};

const Spiel3 = ({ socket, scoreIndex }) => {
  return (
    <div>
      <h1 className="text-lg font-bold p-2">
        Spiel 3 <UpdateMaximumButton socket={socket} score={1800} />
      </h1>
      <div className="grid grid-cols-2 gap-2">
        <ScoreButton
          score={100}
          isPositive={true}
          socket={socket}
          scoreIndex={scoreIndex}
        />
        <ScoreButton
          score={500}
          isPositive={true}
          socket={socket}
          scoreIndex={scoreIndex}
        />
        <ScoreButton
          score={100}
          isPositive={false}
          socket={socket}
          scoreIndex={scoreIndex}
        />
        <ScoreButton
          score={500}
          isPositive={false}
          socket={socket}
          scoreIndex={scoreIndex}
        />
      </div>
    </div>
  );
};

const Spiel4 = ({ socket, scoreIndex }) => {
  return (
    <div>
      <h1 className="text-lg font-bold p-2">
        Spiel 4 <UpdateMaximumButton socket={socket} score={6000} />
      </h1>
      <div className="grid grid-cols-1 gap-2">
        <ScoreButton
          score={500}
          isPositive={true}
          socket={socket}
          scoreIndex={scoreIndex}
        />

        <ScoreButton
          score={500}
          isPositive={false}
          socket={socket}
          scoreIndex={scoreIndex}
        />
      </div>
    </div>
  );
};
const ScoreButton = ({ score, isPositive, socket, scoreIndex }) => {
  return (
    <button
      className={`px-2 py-1 rounded ${isPositive ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600 text-white"} cursor-pointer`}
      onClick={() => {
        socket.emit("updateScore", isPositive ? score : -score, scoreIndex);
      }}
    >
      {isPositive ? "+" : "-"}
      {score}
    </button>
  );
};

export default ScoreControlWrapper;

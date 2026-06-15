import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { socket } from "./shared/socket";
import { useSetupSocket } from "./shared/hooks/useSetupSocket";
import LeaderBoard from "./shared/LeaderBoard";
import backgroundImage from "./img/DKBGD3CamsNoTable.png";
import skyPath from "./img/Sky Rules.png";

const MAX_NAME_FONT_SIZE = 30;
const MIN_NAME_FONT_SIZE = 12;

function App() {
  const [state, setState] = useState({});

  useSetupSocket(socket);
  useEffect(() => {
    socket.on("updateState", (newState) => {
      setState(newState);
    });

    return () => socket.off("updateState");
  }, []);

  return (
    <div>
      <div>
        <img src={skyPath} alt="Background" />
        <div className="l3-winner">
          <Header state={state} index={0} />
          <ScoreEntry state={state} index={0} />
          <ScoreEntry state={state} index={1} />
          <ScoreEntry state={state} index={2} />
        </div>
      </div>
    </div>
  );
}

const ScoreEntry = ({ state, index }) => {
  const { name, pointDiff } = state?.leaderBoard?.[index] || {};
  return (
    <div className="scoreEntry">
      <span>{index + 1}.</span>
      <AutoFitName name={name} />
      <span className="justify-self-center">{pointDiff}</span>
    </div>
  );
};

const AutoFitName = ({ name }) => {
  const nameRef = useRef(null);

  useEffect(() => {
    const element = nameRef.current;

    if (!element) {
      return undefined;
    }

    const fitName = () => {
      let fontSize = MAX_NAME_FONT_SIZE;

      element.style.fontSize = `${fontSize}px`;

      while (
        fontSize > MIN_NAME_FONT_SIZE &&
        element.scrollWidth > element.clientWidth
      ) {
        fontSize -= 1;
        element.style.fontSize = `${fontSize}px`;
      }
    };

    fitName();
  }, [name]);

  return (
    <span ref={nameRef} className="nameEntry">
      {name}
    </span>
  );
};

const Header = ({ state, index }) => {
  return (
    <div className="scoreEntry">
      <span></span>
      <span className="text-minion-blue whitespace-normal">NAME</span>
      <span className="justify-self-center">TIPP</span>
    </div>
  );
};

export default App;

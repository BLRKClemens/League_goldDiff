import { useEffect, useRef, useState } from "react";
import { socket } from "../shared/socket";
import { useSetupSocket } from "../shared/hooks/useSetupSocket";
import backgroundPath from "../img/FS_Score_Empty_ohne_Icon_v01a.png";
import referencePath from "../img/Reference_Score_Ohne_Icon_V01a 1.png";
import CountUp from "react-countup";

function App() {
  const [state, setState] = useState({});
  const previousScoreRef = useRef([0, 0]);
  const previousTotalRef = useRef(0);

  useSetupSocket(socket);
  useEffect(() => {
    socket.on("updateState", (newState) => {
      setState(newState);
    });

    return () => socket.off("updateState");
  }, []);
  const currentScores = state.score ?? [0, 0];
  const gesamtePunkte = state.score?.reduce((a, b) => a + b, 0) || 0;

  useEffect(() => {
    previousScoreRef.current = currentScores;
    previousTotalRef.current = gesamtePunkte;
  }, [currentScores, gesamtePunkte]);

  return (
    <div>
      <img src={backgroundPath} alt="Background" />
      <img
        src={referencePath}
        className="absolute top-0 right-0 opacity-0"
        alt="Reference"
      />
      <CountUp
        start={previousScoreRef.current[0]}
        separator="."
        end={currentScores[0]}
        className="score left"
      />
      <CountUp
        start={previousScoreRef.current[1]}
        separator="."
        end={currentScores[1]}
        className="score right"
      />

      <div className="gesamtpunktzahl">
        <CountUp
          start={previousTotalRef.current}
          className="place-self-end "
          separator="."
          end={gesamtePunkte}
        />
        <div> / {state.scoreMaximum?.toLocaleString("de-DE") || 0}</div>
      </div>
    </div>
  );
}

export default App;

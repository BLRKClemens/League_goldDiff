import { useEffect, useRef, useState } from "react";
import { socket } from "../shared/socket";
import { useSetupSocket } from "../shared/hooks/useSetupSocket";
import scoreEmptyPath from "../img/score_empty.png";
import gesamtpunktzahlPath from "../img/gesamtpunktzahl.png";
import CountUp from "react-countup";
import { useCountUp } from "react-countup";

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

  useEffect(() => {}, [state.isPointsVisible]);

  return (
    <div>
      <img src={gesamtpunktzahlPath} className="absolute" alt="Background" />
      <div
        style={{
          opacity: state.isPointsVisible ? 1 : 0,
          transition: "opacity 1s",
        }}
      >
        <img src={scoreEmptyPath} className="absolute " alt="Reference" />

        <CountUpComponent
          startValue={0}
          endValue={currentScores[0]}
          isPointsVisible={state.isPointsVisible}
          className="score left"
        />
        <CountUpComponent
          startValue={0}
          endValue={currentScores[1]}
          isPointsVisible={state.isPointsVisible}
          className="score right"
        />
      </div>

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

const CountUpComponent = ({
  startValue,
  endValue,
  isPointsVisible,
  className,
}) => {
  const countUpRef = useRef(null);
  const { start, pauseResume, reset, update } = useCountUp({
    ref: countUpRef,
    start: startValue,
    end: endValue,
    separator: ".",
    delay: 1,
    onReset: () => console.log("Resetted!"),
    onUpdate: () => console.log("Updated!"),
    onPauseResume: () => console.log("Paused or resumed!"),
    onStart: ({ pauseResume }) => console.log(pauseResume),
    onEnd: ({ pauseResume }) => console.log(pauseResume),
  });

  useEffect(() => {
    if (isPointsVisible) {
      start();
    }
  }, [isPointsVisible]);
  return <div className={className} ref={countUpRef} />;
};

export default App;

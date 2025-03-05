import { useEffect, useRef } from "react";
import Timer from "./Timer";

import type { Matrix, TimerRef } from "./types";

type TopBarProps = {
  loosed: boolean;
  won: boolean;
  started: boolean;
  matrix: Matrix;
  count: number;
};

const TopBar = (props: TopBarProps) => {
  const timerRef = useRef<TimerRef | null>(null);

  useEffect(() => {
    if (props.loosed || props.won) {
      timerRef.current?.stop();
    } else if (props.started) {
      timerRef.current?.start();
    } else {
      timerRef.current?.reset();
    }
  }, [props.started, props.won, props.loosed]);

  return (
    <div
      style={{
        padding: "8px 12px",
        marginBottom: 12,
        border: "1px solid gray",
        textAlign: "center",
      }}
    >
      <span>
        {props.loosed
          ? "You lose!"
          : props.won
          ? "You won!"
          : props.started
          ? `${
              props.matrix
                .map((row) => row.map((block) => block.flagged))
                .flat()
                .filter(Boolean).length
            } / ${props.count}`
          : "Click any block to start!"}
      </span>
      <Timer ref={timerRef} />
    </div>
  );
};

export default TopBar;

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import type { TimerRef } from "./types";

const toDigits = (num: number) => num.toString().padStart(2, "0");

const Timer = forwardRef<TimerRef>((_props, ref) => {
  const [time, setTime] = useState(0);
  const intervalRef = useRef(0);

  useImperativeHandle(
    ref,
    () => ({
      start() {
        setTime(0);
        intervalRef.current = setInterval(() => {
          setTime((time) => time + 1);
        }, 1000);
      },
      stop() {
        clearTimeout(intervalRef.current);
      },
      reset() {
        setTime(0);
        clearTimeout(intervalRef.current);
      },
    }),
    []
  );

  return (
    <div>
      <span>{toDigits(Math.floor((time / (60 * 60)) % 60))}:</span>
      <span>{toDigits(Math.floor((time / 60) % 60))}:</span>
      <span>{toDigits(Math.floor(time % 60))}</span>
    </div>
  );
});

export default Timer;

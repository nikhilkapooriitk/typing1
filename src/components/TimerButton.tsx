import { useState, useEffect } from "react";
import "./TimerButton.css";

interface TimerButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  initialTime: number;
  isTimerRunning: number;
  updateIsTimerRunning: React.Dispatch<React.SetStateAction<number>>;
  handleTimerEnd?: () => void;
  provideCurrentTime?: (input:number) => void;
}


const TimerButton = ({
  initialTime,
  isTimerRunning,
  updateIsTimerRunning,
  handleTimerEnd,
  provideCurrentTime,
}: TimerButtonProps) => {
  const [time, setTime] = useState(initialTime);

  // will run and update time, when isTimerRunning starts. Will pause, when isTimerRunning is 0
  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setTime(time - 1);
        updateIsTimerRunning(isTimerRunning + 1);
        provideCurrentTime?.(time);
      }, 1000);

      if (time === 0 || isTimerRunning === 0) {
        if(time === 0) {
          handleTimerEnd?.();
        }
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }
  }, [isTimerRunning]);

  // will increment time by 60 seconds
  const handleIncrement = () => {
    const newTime = time + 60;
    setTime(newTime);
  };

  // will decrement time by 60 seconds
  const handleDecrement = () => {
    if (time > 0) {
      const newTime = time - 60;
      setTime(newTime);
    }
  };

  const formattedTime = `${Math.floor(time / 60)}:${(time % 60)
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="timer-button">
      <div className="time-display">{formattedTime}</div>
      <div className="arrow-buttons">
        <button onClick={handleIncrement}>▲</button>
        <button onClick={handleDecrement}>▼</button>
      </div>
    </div>
  );
};

export default TimerButton;

import { useState, useEffect } from "react";
import "./TimerButton.css";

interface TimerButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  initialTime: number;
  isTimerRunning: number;
  updateIsTimerRunning: React.Dispatch<React.SetStateAction<number>>;
  handleTimerEnd?: () => void;
  provideCurrentTime?: (input:number) => void;
  setTime: React.Dispatch<React.SetStateAction<number>>; // Add this line
}

const TimerButton = ({
  initialTime,
  isTimerRunning,
  updateIsTimerRunning,
  handleTimerEnd,
  provideCurrentTime,
  setTime, // Add this line
}: TimerButtonProps) => {
  // Remove the local time state
  // const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (isTimerRunning) {
      const interval = setInterval(() => {
        setTime(prevTime => prevTime - 1); // Use setTime from props
        updateIsTimerRunning(isTimerRunning + 1);
        provideCurrentTime?.(initialTime); // Use initialTime instead of time
      }, 1000);

      if (initialTime === 0 || isTimerRunning === 0) { // Use initialTime instead of time
        if(initialTime === 0) { // Use initialTime instead of time
          handleTimerEnd?.();
        }
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }
  }, [isTimerRunning, initialTime]); // Add initialTime to dependencies

  // will increment time by 60 seconds
  const handleIncrement = () => {
    const newTime = initialTime + 60;
    setTime(newTime);
  };

  // will decrement time by 60 seconds
  const handleDecrement = () => {
    if (initialTime > 0) {
      const newTime = initialTime - 60;
      setTime(newTime);
    }
  };

  const formattedTime = `${Math.floor(initialTime / 60)}:${(initialTime % 60)
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

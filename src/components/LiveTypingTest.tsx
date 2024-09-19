import React, { useState, useEffect } from "react";
import TimerButton from "./TimerButton";
import { DEFAULT_TEST_TIME } from "../CONSTANTS";
import "./LiveTypingTest.css";
import ResultPopUp from "./ResultPopUp";
import useSound from 'use-sound'
import mySound from './../assets/typingSound1.mp3'

function LiveTypingTest() {
  const [userInput, setUserInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const sampleText =
    "The early years of the 20th century witnessed a surge in nationalist sentiment, culminating in the Non-Cooperation Movement and the Civil Disobedience Movement led by Mahatma Gandhi. These movements, characterized by peaceful protests and civil disobedience, galvanized the Indian people and posed a serious challenge to British rule. The Second World War marked a turning point in India's struggle for independence. While India supported the Allied cause, the British government's refusal to grant self-rule after the war fueled resentment and discontent. The Quit India Movement (1942) launched by Gandhi called for the immediate withdrawal of British forces from India. Although the movement was brutally suppressed, it demonstrated the unwavering determination of the Indian people to achieve freedom. The post-war years were marked by intense negotiations between Indian leaders and the British government. The Cabinet Mission Plan of 1946, aimed at partitioning India into Hindu-majority and Muslim-majority states, failed to satisfy all parties. Ultimately, the Mountbatten Plan of 1947 led to the partition of India into India and Pakistan, accompanied by a massive exchange of populations and widespread violence. On August 15, 1947, India achieved independence, becoming a sovereign and democratic republic. Jawaharlal Nehru, a prominent leader of the Indian National Congress, became the country's first Prime Minister. The task of nation-building was immense, with challenges such as integrating diverse regions, addressing economic disparities, and fostering social harmony.India's journey towards independence was a testament to the resilience and unity of its people. Despite facing numerous obstacles, the Indian people persevered in their pursuit of freedom and self-determination. The legacy of India's independence continues to inspire people around the world, serving as a beacon of hope and a reminder of the power of peaceful resistance.";
  const words = sampleText.split(" ");
  const [wordCorrectnessList, setWordCorrectnessList] = useState<boolean[]>( // list of words that the user has typed correctly
    Array(words.length).fill(false)
  );
  const [wordsTyped, setWordsTyped] = useState<string[]>( // list of words that the user has typed
    Array(words.length).fill("")
  );

  const [isTimerRunning, setIsTimerRunning] = useState(0); // used to check if the timer is running or not
  const [testStartTime, setTestStartTime] = useState(-1); // initial time when the test starts

  const [showPopup, setShowPopup] = useState(false); // This parameter is used to show the popup when the timer ends
  const [wpm, setWpm] = useState(0);

  const [time, setTime] = useState(DEFAULT_TEST_TIME);

  const testStartTimeHandler = (input: number) => {
    if (userInput.length < 2) {
      setTestStartTime(input);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Updated type
    if (isTimerRunning === 0) {
      setIsTimerRunning(1);
    }
    const value = e.target.value;
    const isBackspace =
      e.nativeEvent instanceof InputEvent &&
      e.nativeEvent.inputType === "deleteContentBackward";

    /*     If user has not pressed backspace and the last character is a space then we check if the last word is correct or not 
    and fill in the wordCorrectnessList with true or false and move to the next word */
    if (!isBackspace) {
      if (value.endsWith(" ")) {
        const lastWord = value.trim().split(" ").pop() || "";
        if (lastWord === words[currentWordIndex]) {
          setWordCorrectnessList((prev) => {
            const newList = [...prev];
            newList[currentWordIndex] = true;
            return newList;
          });
        }

        setWordsTyped((prev) => {
          const newList = [...prev];
          newList[currentWordIndex] = lastWord;
          return newList;
        });

        setCurrentWordIndex((prevIndex) =>
          Math.min(prevIndex + 1, words.length - 1)
        );
      }
    }

    setUserInput(value);
  };

  const handleTimerEnd = () => {
    const timeElapsed = (testStartTime - 0) / 60; // Convert seconds to minutes
    const calculatedWpm = currentWordIndex / timeElapsed;
    setWpm(calculatedWpm);
    setShowPopup(true); // Show popup when timer ends
    setIsTimerRunning(0);
  };

  const turnOffPopup = () => {
    setShowPopup(false);
  };

  const resetTimer = (newTime: number) => {
    setTime(newTime);
    setIsTimerRunning(0);
    setCurrentWordIndex(0);
    setUserInput("");
    setWordCorrectnessList(Array(words.length).fill(false));
    setWordsTyped(Array(words.length).fill(""));
    setTestStartTime(-1);
  };

  
  const [playSound, { stop: stopSound }] = useSound(mySound, { volume: 0.9 });

  useEffect(() => {
    if (isTimerRunning === 1) {
      playSound();
    } else if (isTimerRunning === 0) {
      stopSound();
    }
  }, [isTimerRunning, playSound, stopSound]);


  return (
    <div className="container mx-auto p-4">
      {showPopup && (
        <ResultPopUp
          testStartTime={testStartTime}
          currentWordIndex={currentWordIndex}
          isSummaryRequired={true}
          wordCorrectnessList={wordCorrectnessList}
          actualWords={words}
          wordsTyped={wordsTyped}
          turnOffPopup={turnOffPopup}
          resetTimer={resetTimer} // Pass resetTimer function
        />
      )}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Live Test</h1>
      </div>

      <div className="textAndInputContainer">
        <div className="text-container">
          <div className="timer-container">
            <TimerButton
              initialTime={time} // Use the time state instead of DEFAULT_TEST_TIME
              isTimerRunning={isTimerRunning}
              updateIsTimerRunning={setIsTimerRunning}
              handleTimerEnd={handleTimerEnd}
              provideCurrentTime={testStartTimeHandler}
              setTime={setTime} // Pass setTime function
            />
          </div>
          <p className="typing-text">
            {words.map((word, index) => (
              <span key={index} className="word">
                {word}{" "}
              </span>
            ))}
          </p>
        </div>
        <div className="inputOuterContainer">
          <textarea
            value={userInput}
            onChange={handleInputChange}
            placeholder="Start typing here..."
            className="typing-input"
            disabled={showPopup}
          />
        </div>
      </div>
    </div>
  );
}

export default LiveTypingTest;

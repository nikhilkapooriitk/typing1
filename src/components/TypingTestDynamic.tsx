import React, { useState, useEffect, useRef } from "react";
import TimerButton from "./TimerButton";
import { DEFAULT_TEST_TIME } from "../CONSTANTS";
import "./TypingTestDynamic.css";
import ResultPopUp from "./ResultPopUp";
import useSound from "use-sound";
import mySound from "./../assets/typingSound1.mp3";
// Import TypingData.json file
import typingData from "../assets/TypingData.json";

function TypingTestDynamic() {
  const [userInput, setUserInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  // initial sample text would be any random medium difficulty text from any category
  const textDifficultyLevelList = Object.keys(typingData);
  const textCategoryList = Object.keys(typingData.Medium);

  // select a random textDifficultyLevel value
  const randomDifficultyKey = Object.keys(typingData)[
    Math.floor(Math.random() * Object.keys(typingData).length)
  ] as keyof typeof typingData; // Ensure the key is a valid key of typingData
  // select a random category key from the selected difficulty level
  const randomCategoryKey = textCategoryList[
    Math.floor(Math.random() * textCategoryList.length)
  ] as keyof (typeof typingData)[typeof randomDifficultyKey];

  const randomTextIndex = Math.floor(Math.random() * typingData[randomDifficultyKey][randomCategoryKey].length);

  const [sampleText, setSampleText] = useState(
    typingData[randomDifficultyKey][randomCategoryKey][randomTextIndex]
  );
  const [sampleTextCategory, setSampleTextCategory] =
    useState(randomCategoryKey);
  const [sampleTextDifficulty, setSampleTextDifficulty] =
    useState(randomDifficultyKey);
  const words = sampleText.split(" ");

  const [wordCorrectnessList, setWordCorrectnessList] = useState<boolean[]>(
    Array(words.length).fill(false)
  );
  const [wordsTyped, setWordsTyped] = useState<string[]>(
    Array(words.length).fill("")
  );

  const [isTimerRunning, setIsTimerRunning] = useState(0);
  const [testStartTime, setTestStartTime] = useState(-1);

  const [showPopup, setShowPopup] = useState(false);
  const [wpm, setWpm] = useState(0);

  const [time, setTime] = useState(DEFAULT_TEST_TIME);

  const [playSound, { stop: stopSound }] = useSound(mySound, { volume: 0.9 });
  const soundStartedRef = useRef(false);

  const [isSoundSelected, setIsSoundSelected] = useState(false); // State for Sound button
  const [isHighlightWordsSelected, setIsHighlightWordsSelected] =
    useState(true); // State for Highlight button

  const showData = () => {
    // console.log(typingData.Easy["Current Affairs"][1]);
    console.log(Object.keys(typingData.Medium));
    // select a random item from a list in javascript
    // const randomItem = ;
    // console.log(randomItem);
  };

  const handleSampleTextSetup = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(Object.keys(typingData.Medium));
    console.log(e.target.value);
  };

  useEffect(() => {
    if (isTimerRunning > 0 && !soundStartedRef.current && isSoundSelected) {
      playSound();
      soundStartedRef.current = true;
    } else if (isTimerRunning === 0 || !isSoundSelected) {
      stopSound();
      soundStartedRef.current = false;
    }
  }, [isTimerRunning, playSound, stopSound, isSoundSelected]);

  const testStartTimeHandler = (input: number) => {
    if (userInput.length < 2) {
      setTestStartTime(input);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isTimerRunning === 0) {
      setIsTimerRunning(1);
    }
    const value = e.target.value;
    const isBackspace =
      e.nativeEvent instanceof InputEvent &&
      e.nativeEvent.inputType === "deleteContentBackward";

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
    const timeElapsed = (testStartTime - 0) / 60;
    const calculatedWpm = currentWordIndex / timeElapsed;
    setWpm(calculatedWpm);
    setShowPopup(true);
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as
      | "Current Affairs"
      | "Government Schemes"
      | "Law"
      | "Science and Technology"
      | "Environment"
      | "Economy"; // Type assertion
    setSampleTextCategory(value);

    const randomTextIndexNew = Math.floor(Math.random() * typingData[sampleTextDifficulty][value].length);
    setSampleText(typingData[sampleTextDifficulty][value][randomTextIndexNew]);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Ensure the value is one of the allowed types
    const value = e.target.value as keyof typeof typingData;
    setSampleTextDifficulty(value);
    const randomTextIndexNew = Math.floor(Math.random() * typingData[value][sampleTextCategory].length);
    setSampleText(typingData[value][sampleTextCategory][randomTextIndexNew]);
  };

  useEffect(() => {
    // Assert that sampleTextDifficulty and sampleTextCategory are valid keys
  }, [sampleTextCategory, sampleTextDifficulty]);

  return (
    <div className="container mx-auto p-4">
      {/* <button onClick={showData}>Show Data</button> */}
      {showPopup && (
        <ResultPopUp
          testStartTime={testStartTime}
          currentWordIndex={currentWordIndex}
          isSummaryRequired={true}
          wordCorrectnessList={wordCorrectnessList}
          actualWords={words}
          wordsTyped={wordsTyped}
          turnOffPopup={turnOffPopup}
          resetTimer={resetTimer}
        />
      )}
      <div
        className="text-center mb-4"
        style={{ marginTop: "0px", paddingTop: "0px" }}
      >
        <h1
          className="text-2xl font-bold"
          style={{ marginTop: "0px", paddingTop: "0px" }}
        >
          Typing Practice
        </h1>
      </div>
      <div className="text-container" style={{ height: "60vh" }}>
        <div className="timer-container">
          <select
            onChange={handleDifficultyChange}
            defaultValue={sampleTextDifficulty}
          >
            <option value="Difficulty" disabled>
              Difficulty
            </option>
            {textDifficultyLevelList.map((difficultyLevel) => (
              <option key={difficultyLevel} value={difficultyLevel}>
                {difficultyLevel}
              </option>
            ))}
          </select>
          <select
            onChange={handleCategoryChange}
            defaultValue={sampleTextCategory}
          >
            <option value="Category" disabled>
              Text Category
            </option>
            {textCategoryList.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button
            style={{
              marginRight: "10px",
              backgroundColor: isSoundSelected ? "blue" : "lightgrey", // Change color based on selection
              color: isSoundSelected ? "white" : "black", // Change text color for better visibility
            }}
            onClick={() => setIsSoundSelected(!isSoundSelected)}
          >
            Sound
          </button>
          <button
            style={{
              marginRight: "10px",
              backgroundColor: isHighlightWordsSelected ? "blue" : "lightgrey", // Change color based on selection
              color: isHighlightWordsSelected ? "white" : "black", // Change text color for better visibility
            }}
            onClick={() =>
              setIsHighlightWordsSelected(!isHighlightWordsSelected)
            }
          >
            Highlight Words
          </button>
          <TimerButton
            initialTime={time}
            isTimerRunning={isTimerRunning}
            updateIsTimerRunning={setIsTimerRunning}
            handleTimerEnd={handleTimerEnd}
            provideCurrentTime={testStartTimeHandler}
            setTime={setTime}
          />
        </div>
        <p className="typing-text">
          {words.map((word, index) => (
            <span
              key={index}
              className={`word ${
                isHighlightWordsSelected && index === currentWordIndex
                  ? "word-current"
                  : ""
              }`}
              style={{
                color: isHighlightWordsSelected
                  ? index >= currentWordIndex
                    ? "black" // Default color for untyped words
                    : wordCorrectnessList[index]
                    ? "green" // Color for correct words
                    : "red" // Color for incorrect words
                  : "inherit", // Use the default text color when highlighting is not selected
              }}
            >
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
      <div
        className="input-container"
        style={{ padding: "0px", height: "10px", marginTop: "30px" }}
      >
        <input
          value={userInput}
          onChange={handleInputChange}
          placeholder="Start typing here..."
          className="typing-input"
          disabled={showPopup}
        />
      </div>
    </div>
  );
}

export default TypingTestDynamic;

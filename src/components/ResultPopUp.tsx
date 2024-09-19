import React, { useRef, useEffect } from 'react';
import "./ResultPopUp.css";
import { DEFAULT_TEST_TIME } from '../CONSTANTS';

interface ResultPopUpProps{
    testStartTime:number;
    currentWordIndex:number;
    wordCorrectnessList:boolean[];
    isSummaryRequired:boolean;
    turnOffPopup?:() => void;
    actualWords:string[];
    wordsTyped:string[];
    resetTimer: (newTime: number) => void; // Add this line
}

function ResultPopUp({testStartTime, currentWordIndex, wordCorrectnessList, turnOffPopup, actualWords, wordsTyped, isSummaryRequired, resetTimer}:ResultPopUpProps){ 
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const popup = popupRef.current;
        if (!popup) return;

        let isDragging = false;
        let startX: number, startY: number, startLeft: number, startTop: number;

        const onMouseDown = (e: MouseEvent) => {
            if ((e.target as HTMLElement).classList.contains('popup-header')) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                startLeft = popup.offsetLeft;
                startTop = popup.offsetTop;
            }
        };

        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            popup.style.left = `${startLeft + deltaX}px`;
            popup.style.top = `${startTop + deltaY}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        document.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    const wpm = currentWordIndex*60/testStartTime;
    const effectiveWpm = wordCorrectnessList.filter(Boolean).length * 60/testStartTime;
    const accuracy = wordCorrectnessList.filter(Boolean).length * 100/ currentWordIndex;

    const handleRestart = () => {
        turnOffPopup?.();
        resetTimer(DEFAULT_TEST_TIME);
    };

    return (
    <div className="popup" ref={popupRef}>
        <div className="popup-content resizable">
        <div className="popup-header">
            <h2>{(wpm<45 || accuracy<80 || effectiveWpm<35) ? "FAILED!!!" : "Congratulations!!!"}</h2>
        </div>
        <p>Your WPM: {wpm.toFixed(2)}</p> 
        <p>Effective WPM: {effectiveWpm.toFixed(2)}</p>
        <p>Accuracy: {accuracy.toFixed(2)}%</p>
        
        {isSummaryRequired && (
            <div>
                <h3>Summary:</h3>
                <p>Words you typed correctly: {actualWords.filter((_, index) => wordCorrectnessList[index]).join(" ")}</p>
                <p>Where did you miss: {actualWords.slice(0, currentWordIndex).filter((_, index) => !wordCorrectnessList[index]).join(" ")}</p>
            </div>
        )}


        <button onClick={handleRestart}>Restart</button>
        {turnOffPopup && <button onClick={turnOffPopup}>Close</button>}
        </div>
    </div>
    );
}

export default ResultPopUp; 

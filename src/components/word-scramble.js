import React, {useEffect, useRef, useState} from "react";
import "./word-scramble.sass";
import "@fontsource/jost";
import "@fontsource/jost/900.css";
import WORDS from "./words.txt";
import Profiles from './profiles'


const WORDLIST = [];
fetch(WORDS)
    .then(row => row.text())
    .then(data => {
        data = data.split("\r\n");
        console.log(data)
        data.forEach(el => WORDLIST.push(el));
    });

let LEADERBOARD = [];

const WordScramble = () => {
    const [isGameStarted, setGameStarted] = useState(false);
    const [isGameFinished, setGameFinished] = useState(false);

    const [inputValue, setInputValue] = useState("");
    const [name, setName] = useState("");
    const [correctWord, setCorrectWord] = useState("");
    const [scrambledWord, setScrambledWord] = useState("");

    const [scoreValue, setScoreValue] = useState(0);
    const [timerValue, setTimerValue] = useState(30);
    const [countdown, setCountdown] = useState(30);

    const interValRef = useRef();
    useEffect(() => {
        if(isGameStarted) {
            interValRef.current = setInterval(() => {
                setCountdown(timer => timer - 1)
            }, 1000)
            
            return () => {
                clearInterval(interValRef.current)
            }
        }
    }, [isGameStarted])

    if (countdown === 0) {
        clearInterval(interValRef.current);
        setGameFinished(true);
        setCountdown(timerValue);
        setGameStarted(false);
    }

    const selectWord = () => {
        const randomIndex = Math.floor(Math.random() * WORDLIST.length);
        console.log(WORDLIST[randomIndex])
        return WORDLIST[randomIndex];
    };

    const createScrambledWord = (word) => {
        let shuffled = word.split('');

        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        return shuffled.join(" ");
    }

    const handleGameStart = () => {
        setGameFinished(false);
        setGameStarted(true);
        setInputValue("");
        const word = selectWord().toUpperCase();
        setCorrectWord(word);
        setScrambledWord(createScrambledWord(word));
        setCountdown(timerValue);
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value.toUpperCase());
    };

    const handleNameInput = (event) => {
        setName(event.target.value);
    }

    const handleTimerChange = (event) => {
        setTimerValue(Number(event.target.value));
    }

    const handleWordEnter = () => {
        if (inputValue !== "") {
            if (inputValue === correctWord) {
                setScoreValue(scoreValue + 100);
                handleGameStart();
            }
        }
    }

    if (name !== "" && isGameFinished) {
        LEADERBOARD.push({name: name, score: scoreValue});
        console.log(LEADERBOARD);
        LEADERBOARD = LEADERBOARD.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.name === value.name && t.score === value.score
            )))

        for(let i = 0; i < LEADERBOARD.length; i++) {
            for (let j = 1; j < LEADERBOARD.length; j++) {
                if (LEADERBOARD[i].name === LEADERBOARD[j].name) {
                    LEADERBOARD[i].score >= LEADERBOARD[j].score ? LEADERBOARD[j].score = LEADERBOARD[i].score
                        : LEADERBOARD[i].score = LEADERBOARD[j].score
                }
            }
        }
    }

    const resumeClick = () => {
        setGameStarted(false);
        setGameFinished(false);
        setScoreValue(0);
        setName("")
    }

    const newGameClick = () => {
        setScoreValue(0);
        handleGameStart();
    }

    return (
        <div className={"page-container"}>
            <header>
                <p className={"word"}>WORD</p>
                <p className={"scramble"}>SCRAMBLE</p>
            </header>
            {isGameStarted ? (
                <>
                    <div className={"progress-container"}>
                        <p> SCORE: {scoreValue} </p>
                        <div className={"timer-container"}>
                            <p> TIME LEFT: 00:{countdown < 10 ? '0' + countdown : countdown}</p>
                        </div>
                    </div>

                    <div className={"board"}>
                        {correctWord.split("").map((el, i) => (
                            <span key={`${el}_${i}`} className='square-bg'>
									{inputValue[i]}
								</span>
                        ))}
                    </div>
                    <p>{ scrambledWord }</p>
                    <div className={"user-input-field"}>
                        <input id={'guess'} type={"text"} onChange={handleInputChange} value={inputValue} />
                        <button onClick={handleWordEnter}>ENTER</button>
                    </div>
                </>
            ) : (isGameFinished ? (
                <>
                    <p>Game Over!</p>
                    <div className={"buttons"}>
                        <button onClick={newGameClick}>TRY AGAIN</button>
                        <button onClick={resumeClick}>NEW GAME</button>
                    </div>
                    <div className={'leaderboard'}>
                        <p id={"name"}>Leaderboard</p>
                        <Profiles Leaderboard={LEADERBOARD}></Profiles>
                    </div>

                </>
                ) : (
                <>
                    <div className={"info-container"}>
                        <div className={"user-info"}>
                            <p>Your nickname</p>
                            <input type={"text"} onChange={handleNameInput} value={name}/>
                        </div>
                        <div className={"timer-info"}>
                            <p>Set timer (s)</p>
                            <input type={"number"} step={5} min={10} max={50} value={timerValue} onKeyDown={() => false} onChange={handleTimerChange}/>
                        </div>
                    </div>

                    <button onClick={handleGameStart}>START</button>
                </>
            ))}
        </div>
    );
}

export default WordScramble;
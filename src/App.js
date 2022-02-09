import './App.css';
import React, { useEffect } from 'react';
import Die from './components/Die';
import Scores from './components/Scores';
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [count, setCount] = React.useState(0)
  const [tenzies, setTenzies] = React.useState(false)
  const [prevScore, setPrevScore] =  React.useState([])

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => firstValue === die.value)
    if (allHeld && allSameValue) {
      setTenzies(true)
    }  
  }, 
    [dice]
  )
  
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }
  
  const getPrevScore = () => {
    let prevScoreVal = localStorage.getItem("prevScore");
    setPrevScore(prevScoreVal ? JSON.parse(prevScoreVal) : [] )
  }
  
  useEffect(() => {
    getPrevScore()
  }, []);

  function rollDice() {
    setCount(prevCount => prevCount + 1)
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
      return die.isHeld ? die : generateNewDie()
    }))
    } else {
      setTenzies(false)
      setDice(allNewDice())
      localStorage.setItem("prevScore", JSON.stringify([count, ...prevScore]))
      getPrevScore();
      setCount(prevCount => 0)
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? {
        ...die,
        isHeld : !die.isHeld
      }: die
    }))
  }
  
  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++){
      newDice.push(generateNewDie())
    }
    return newDice
  }
  const diceElements = dice.map(die => (
    <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}/>))
  // console.log(allNewDice())
  return (
    <>
    <div className='d-flex'>
      <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button
        onClick={rollDice}
        className='roll-dice'
      >{tenzies ? "Reset Game" : "Roll"}</button>
      <p className='rolls-num'>{`Number of Dice rolls ${count}`}</p>
      {/* <Scores /> */}
      </main>
      {
        prevScore.length > 0 && <main className='ml-1 w-20'>
          {prevScore.map((val, index) => <h5 key={index}>Your recent score was {val}</h5>)}
        </main>
      }
      
    </div>
    <div>
        <h4>Developed by Shubham</h4>
      </div>
      </>
    
  );
}

export default App;

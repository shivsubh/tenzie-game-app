import './App.css';
import React from 'react';
import Die from './components/Die';
import { nanoid } from "nanoid"
import Confetti from "react-confetti"

function App() {
  const [dice, setDice] = React.useState(allNewDice())
  const [count, setCount] = React.useState(0)
  const [tenzies, setTenzies] = React.useState(false)
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
  
  function rollDice() {
    setCount(prevCount => prevCount + 1)
    if (!tenzies) {
      setDice(oldDice => oldDice.map(die => {
      return die.isHeld ? die : generateNewDie()
    }))
    } else {
      setTenzies(false)
      setDice(allNewDice())
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
    </main>
  );
}

export default App;

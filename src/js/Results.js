import React from 'react';

function calcScore(cards) {
  return cards.reduce((score, card) => {
    if (card.numFlips === 1) {
      score += 10;
    } else if (card.numFlips === 2) {
      score += 5;
    } else if (card.numFlips === 3) {
      score += 3;
    } else {
      score -= 5;
    }
    return score;
  }, 0);
}

export default function Results({ cards, onReset }) {
  return (
    <div className="results">
      <h1>SUCCESS!</h1>
      <h2>Your Score: {calcScore(cards)}</h2>
      <p>
        <button onClick={onReset}>Play Again!</button>
      </p>
    </div>
  );
}
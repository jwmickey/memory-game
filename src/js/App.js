import React, { useState } from 'react';
import Start from './Start';
import Card from './Card';
import Results from './Results';
import sets from './sets';

const NUM_PAIRS = 12;

function shuffle(a, b, c, d) {
    c = a.length;
    while (c) {
        b = Math.random() * c-- | 0;
        d = a[c];
        a[c] = a[b];
        a[b] = d;
    }
}

const cardTimeout = parseInt(window.localStorage.getItem('cardflip_timeout')) || 1000;

export default function App()  {
    const [cards, setCards] = useState([]);
    const [guess, setGuess] = useState(-1);
    const [numPaired, setNumPaired] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [selectedSet, setSelectedSet] = useState(null);

    const init = () => {
        setCards([]);
        setGuess(-1);
        setNumPaired(0);
        setIsLocked(false);
        setSelectedSet(null);
    };

    const loadSet = async index => {
        init();

        if (index < 0 || index > sets.length - 1) {
            index = 0;
        }

        let cards = [];
        let itemPool = [];
        let set = sets[index];
        let useImage = false;

        if (set.images !== null && set.images.length >= NUM_PAIRS) {
            shuffle(set.images);
            useImage = true;
            itemPool = set.images;
        } else if (set.hasOwnProperty('chars')) {
            let chars = set.chars;
            if (typeof chars === 'function') {
                chars = await set.chars();
            }
            shuffle(chars);
            itemPool = chars;
        } else {
            itemPool = Array.from(Array(NUM_PAIRS), (e, i) => i + 1);
        }

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < NUM_PAIRS; j++) {
                cards.push({
                    name: useImage ? j + 1 : itemPool[j],
                    image: useImage ? itemPool[j] : null,
                    flipped: false,
                    matched: false,
                    numFlips: 0
                });
            }
        }

        shuffle(cards);

        setCards(cards);
        setIsLocked(false);
        setSelectedSet(set.name);
    };

    const resetDeck = () => {
        for (let i = 0; i < cards.length; i++) {
            cards[i].flipped = false;
            cards[i].matched = false;
            cards[i].numFlips = 0;
        }
        shuffle(cards);

        init();
        setCards(cards);
    };

    const flipCard = index => {
        if (cards[index].flipped || cards[index].matched) {
            return;
        }

        cards[index].flipped = true;
        cards[index].numFlips++;

        if (guess >= 0) {
            if (cards[guess].name === cards[index].name) {
                // found a match
                cards[guess].matched = true;
                cards[index].matched = true;
                setCards(cards);
                setGuess(-1);
                setNumPaired(numPaired + 1);
            } else {
                // not a match
                setCards(cards);
                setIsLocked(true);

                // flip cards back after 1 second
                setTimeout(() => {
                    cards[guess].flipped = false;
                    cards[index].flipped = false;
                    setCards(cards);
                    setGuess(-1);
                    setIsLocked(false);
                }, cardTimeout);
            }
        } else {
            setCards(cards);
            setGuess(index);
        }
    };

    if (selectedSet !== null) {
        let results = null;
        let clickHandler = function() {};

        if (numPaired === NUM_PAIRS) {
            results = <Results cards={cards} onReset={resetDeck} />;
        } else if (!isLocked) {
            clickHandler = flipCard;
        }

        return (
            <div className={`board ${selectedSet}`}>
                {cards.map((card, i) => (
                  <div key={card.name + '-' + i} onClick={() => clickHandler(i)}>
                    <Card {...card} />
                  </div>
                ))}
                {results}
            </div>
        );
    } else {
        return <Start sets={sets} onChooseSet={loadSet} />;
    }
}

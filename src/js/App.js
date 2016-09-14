import React, { Component } from 'react';
import classNames from 'classnames';
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

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            cards: [],
            guess: -1,
            numPaired: 0,
            locked: false,
            started: false
        };
    }

    pickSet() {
        this.setState({
            cards: [],
            guess: -1,
            numPaired: 0,
            locked: false,
            started: false
        });
    }

    loadSet(index) {
        if (index < 0 || index > sets.length - 1) {
            index = 0;
        }

        let cards = [];
        let set = sets[index];
        let useImage = false;

        if (set.images != null && set.images.length >= NUM_PAIRS) {
            shuffle(set.images);
            useImage = true;
        }

        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < NUM_PAIRS; j++) {
                cards.push({
                    name: j + 1,
                    image: useImage ? set.images[j] : null,
                    flipped: false,
                    matched: false,
                    numFlips: 0
                });
            }
        }

        shuffle(cards);

        this.setState({
            cards: cards,
            guess: -1,
            numPaired: 0,
            locked: false,
            started: true
        });
    }

    reset() {
        let cards = this.state.cards;
        for (var i = 0; i < cards.length; i++) {
            cards[i].flipped = false;
            cards[i].matched = false;
            cards[i].numFlips = 0;
        }
        shuffle(cards);

        this.setState({
            cards: cards,
            guess: -1,
            numPaired: 0,
            locked: false,
            started: true
        });
    }

    flipCard(index) {
        let cards = this.state.cards;
        if (cards[index].flipped || cards[index].matched) {
            return;
        }

        cards[index].flipped = true;
        cards[index].numFlips++;

        if (this.state.guess >= 0) {
            if (cards[this.state.guess].name === cards[index].name) {
                // found a match
                cards[this.state.guess].matched = true;
                cards[index].matched = true;
                this.setState({
                    cards: cards,
                    guess: -1,
                    numPaired: this.state.numPaired + 1
                });
            } else {
                // not a match
                this.setState({
                    cards: cards,
                    locked: true
                });

                let that = this;
                setTimeout(function() {
                    cards[that.state.guess].flipped = false;
                    cards[index].flipped = false;
                    that.setState({
                        cards: cards,
                        guess: -1,
                        locked: false
                    });
                }, 1000);
            }
        } else {
            this.setState({
                cards: cards,
                guess: index
            });
        }
    }

    render() {
        if (this.state.started) {
            let results = null;
            let clickHandler = function() {};

            if (this.state.numPaired === NUM_PAIRS) {
                results = <Results cards={this.state.cards}
                    resetHandler={this.reset.bind(this)}
                    pickSetHandler={this.pickSet.bind(this)} />;
            } else if (!this.state.locked) {
                clickHandler = this.flipCard.bind(this);
            }

            return (
                <div className="board">
                    {this.state.cards.map(function(card, i) {
                        return (
                            <Card key={card.name + '-' + i} id={i} {...card}
                                clickHandler={clickHandler} />
                        );
                    })}
                    {results}
                </div>
            );
        } else {
            return <Start sets={sets} startHandler={this.loadSet.bind(this)} />;
        }
    }
}

class Start extends Component {
    render() {
        var that = this;
        return (
            <div className="start">
                <h1>Memory Game!</h1>
                <div className="sets">
                    {this.props.sets.map(function(set, i) {
                        let styles = {};
                        if (set.cover != null) {
                            let url = set.cover;
                            if (set.cover.substring(0, 4) !== 'http') {
                                url = require('../' + set.cover);
                            }
                            styles.backgroundImage = 'url(' + url + ')';
                        }

                        return (
                            <div key={set.name} style={styles}
                                onClick={that.props.startHandler.bind(null, i)} >
                                <h2>{set.name}</h2>
                                {set.credit != null ? <p className="credit">Courtesy{' '}
                                    <a onClick={(e) => e.preventBubble()} href={set.url}>{set.credit}</a></p> : null}
                            </div>
                        );
                    })}
                </div>
                <p>
                    View project on <a href="https://github.com/jwmickey/memory-game">GitHub</a>.
                </p>
            </div>
        );
    }
}

class Results extends Component {
    calcScore() {
        let score = 0;

        this.props.cards.forEach(function(card) {
            if (card.numFlips === 1) {
                score += 10;
            } else if (card.numFlips === 2) {
                score += 5;
            } else if (card.numFlips === 3) {
                score += 3;
            } else {
                score -= 5;
            }
        });

        return score;
    }

    render() {
        return (
            <div className="results">
                <h1>SUCCESS!</h1>
                <h2>Your Score: {this.calcScore()}</h2>
                <p>
                    <button onClick={this.props.resetHandler}>Play Again!</button>
                </p>
                <p>
                    <button onClick={this.props.pickSetHandler}>Choose Another Set</button>
                </p>
            </div>
        );
    }
}

class Card extends Component {
    flip(e) {
        e.preventDefault();
        this.props.clickHandler(this.props.id);
    }

    render() {
        let classes = classNames({
            card: true,
            matched: this.props.matched,
            horizontal: true
        });

        let innerClasses = classNames({
            'card-inner': true,
            flipped: this.props.flipped
        });

        let styles = {
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
        };
        if (this.props.image != null) {
            let url = this.props.image;
            if (url.substring(0, 4) !== 'http') {
                url = require('../' + url);
            }
            styles.backgroundImage = 'url(' + url + ')';
        }

        return (
            <div className={classes} onClick={this.flip.bind(this)}>
                <div className={innerClasses}>
                    <div className="front">?</div>
                    <div className="back" style={styles}>
                        {this.props.image ? null : this.props.name}
                    </div>
                </div>
            </div>
        );
    }
}

Card.defaultProps = {
    id: 0,
    image: null,
    name: '???',
    flipped: false,
    matched: false
};

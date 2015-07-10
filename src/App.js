import React, { Component } from 'react';
import classNames from 'classnames';

const NUM_PAIRS = 12;

function shuffle(a,b,c,d) {
    c=a.length;while(c)b=Math.random()*c--|0,d=a[c],a[c]=a[b],a[b]=d
}

export default class App extends Component {
    constructor(props) {
        super(props);

        let cards = [];
        for (var i = 0; i < 2; i++) {
            for (var j = 1; j <= NUM_PAIRS; j++) {
                cards.push({
                    name: j,
                    flipped: false,
                    matched: false,
                    numFlips: 0
                });
            }
        }
        shuffle(cards);

        this.state = {
            cards: cards,
            guess: -1,
            numPaired: 0,
            locked: false
        };
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
            locked: false
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
            if (cards[this.state.guess].name == cards[index].name) {
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
        if (this.state.numPaired == NUM_PAIRS) {
            return <Results cards={this.state.cards} resetHandler={this.reset.bind(this)} />
        } else {
            let clickHandler = this.state.locked ? function() {} : this.flipCard.bind(this);
            return (
                <div className="board">
                    {this.state.cards.map(function(card, i) {
                        return (
                            <Card key={card.name + '-' + i} id={i} {...card}
                                clickHandler={clickHandler} />
                        );
                    })}
                </div>
            );
        }
    }
}

class Results extends Component {
    calcScore() {
        let score = 0;

        this.props.cards.forEach(function(card) {
            if (card.numFlips == 1) {
                score += 10;
            } else if (card.numFlips == 2) {
                score += 5;
            } else if (card.numFlips == 3) {
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
                <h1>Winner!</h1>
                <h2>Your Score: {this.calcScore()}</h2>
                <button onClick={this.props.resetHandler}>Play Again!</button>
            </div>
        )
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
            flipped: this.props.flipped
        });

        return (
            <div className={classes} onClick={this.flip.bind(this)}>
                {this.props.flipped ? this.props.name : '?'}
            </div>
        );
    }
}

Card.defaultProps = {
    id: 0,
    name: '(unknown)',
    flipped: false,
    matched: false
}

import React, { Component } from 'react';
import classNames from 'classnames';

const NUM_PAIRS = 12;

// quick and dirty fisher-yates shuffle method
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
                    matched: false
                });
            }
        }
        shuffle(cards);

        this.state = {
            cards: cards,
            guess: -1,
            numPaired: 0
        };
    }

    reset() {
        let cards = this.state.cards;
        for (var i = 0; i < cards.length; i++) {
            cards[i].flipped = false;
            cards[i].matched = false;
        }
        shuffle(cards);

        this.setState({
            cards: cards,
            guess: -1,
            numPaired: 0
        });
    }

    flipCard(index) {
        let cards = this.state.cards;
        if (cards[index].flipped || cards[index].matched) {
            return;
        }

        cards[index].flipped = true;

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
                    cards: cards
                });

                let that = this;
                setTimeout(function() {
                    cards[that.state.guess].flipped = false;
                    cards[index].flipped = false;
                    that.setState({
                        cards: cards,
                        guess: -1
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
            return (
                <div className="win">
                    <h1>Winner!</h1>
                    <button onClick={this.reset.bind(this)}>Play Again!</button>
                </div>
            );
        } else {
            let clickHandler = this.flipCard.bind(this);
            return (
                <div className="board">
                    {this.state.cards.map(function(card, i) {
                        return (
                            <Card key={card.name + '-' + i} id={i} {...card} clickHandler={clickHandler} />
                        );
                    })}
                </div>
            );
        }
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

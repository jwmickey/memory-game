const sets = require('../../src/js/sets');

context('Play Game', () => {
    beforeEach(() => {
        cy.visit('/', {
            onBeforeLoad: function (window) {
                window.localStorage.setItem('cardflip_timeout', "50");
            }
        });
    });

    it('Wins impressively', () => {
        cy.get('div.sets > div > h2').contains(sets[0].name).click();
        cy.get('.board').should('be.visible');

        // cheat!
        cy.get('.board').then($board => {
            const pairs = new Map();
            $board.find('> div .back').each((index, $el) => {
                const text = $el.textContent;
                console.log(text);
                if (pairs.has(text)) {
                    pairs.set(text, [pairs.get(text), index]);
                } else {
                    pairs.set(text, [index]);
                }
            });
            return pairs;
        }).then((pairs) => {
            pairs.forEach(pair => {
                cy.get('.board > div').eq(pair[0]).click().within(() => {
                    cy.get('.back').should('be.visible');
                });
                cy.get('.board > div').eq(pair[1]).click().within(() => {
                    cy.get('.back').should('be.visible');
                });
            });
        }).then(() => {
            cy.get('.results')
                .should('be.visible')
                .should('contain.text', 'SUCCESS!');
        }).then(() => {
            cy.get('button').contains('Play Again!').click();
            cy.get('div.sets').should('be.visible');
        });
    });
});

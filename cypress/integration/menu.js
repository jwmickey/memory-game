const sets = require('../../src/js/sets');

context('Main Menu', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Displays each set on the menu page', () => {
        sets.forEach(set => {
            cy.get('div.sets > div > h2').contains(set.name).should('be.visible');
        });
    });

    it('Loads a set', () => {
        cy.get('div.sets > div > h2').contains(sets[0].name).click();
        cy.get('.board').should('be.visible');
        cy.get('.board > div').should('have.length', 24).each(el => {
           cy.wrap(el.find('.front')).should('contain.text', '?');
        });
    });
});

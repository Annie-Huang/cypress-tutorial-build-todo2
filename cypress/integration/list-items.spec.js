describe('List items', () => {
    beforeEach(() => {
        cy.seedAndVisit();
    });

    it('properly displays completed items', () => {
        cy.get('.todo-list li')
            .filter('.completed')
            .should('have.length', 1)
            .and('contain', 'Eggs')
            .find('.toggle')
            .should('be.checked');
    });

    it('Shows remaining todos in the footer', () => {
        cy.get('.todo-count')
            .filter('.completed')
            .and('contain', 3);
    });

    it('Removes a todo', () => {
        cy.route({
            url: '/api/todos/1',
            method: 'DELETE',
            status: 200,
            response: {}
        });

        // .click({force: true});
        cy.get('.todo-list li')
            .as('list');

        // The .invoke is for trigger the
        // .todo-list li:hover .destroy {
        //         display: block;
        // }
        // in styles.css
        cy.get('@list')
            .first()
            .find('.destroy')
            .invoke('show')
            .click();

        cy.get('@list')
            .should('have.length', 3)
            .and('not.contain', 'Milk')
    });

    it('Marks an incomplete item complete', () => {
        cy.fixture('todos')
            .then(todos => {
                // the '_' is the loadash function
                // Important: remember to use `` when you deal with ${target.id}, otherwise it will not work and it's hard to find out why...
                const target = Cypress._.head(todos);
                // console.log('target=', target);

                // Can skip adding status: 200 as that is the default value for status.
                cy.route(
                    'PUT',
                    `/api/todos/${target.id}`,
                    Cypress._.merge(target, {isComplete: true})
                );
            });

        cy.get('.todo-list li')
            .first()
            .as('first-todo');

        cy.get('@first-todo')
            .find('.toggle')
            .click()
            .should('be.checked');
        // I actually don't see any html value change on the checkbox when it's click, the value is always === on.
        // Even though I know it got the logic of checked={props.isComplete}.

        cy.get('@first-todo')
            .should('have.class', 'completed');

        cy.get('.todo-count')
            .should('contain', 2);
    });
});
/// <reference types="cypress" />

describe('Testing Create Workout screen', () => {
    beforeEach(() => {
        cy.visit('/')
    })
    it('Tests workout name input', () => {
        cy.get('input').type('Test Workout')
        cy.get('input').should('have.value', 'Test Workout')
        cy.end()
    })

    it('Tests add exercise button', () => {
        cy.contains('add exercise').click()
        cy.contains('Set')
        cy.contains('Weight')
        cy.contains('Reps')
    })
})
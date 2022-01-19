/// <reference types="cypress" />

describe('Create Workout screen', () => {
    beforeEach(() => {
        cy.visit('/')
    })

    it('input a workout name', () => {
        cy.get('input').type('Test Workout')
        cy.get('input').should('have.value', 'Test Workout')
        cy.end()
    })

    it('add an exercise', () => {
        cy.contains('add exercise').click()
        cy.contains('Set')
        cy.contains('Weight')
        cy.contains('Reps')
    })
})
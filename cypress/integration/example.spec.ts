/// <reference types="cypress" />

describe('Test 1', () => {
    beforeEach(() => {
        cy.visit('/')
    })
    it('Tests workout name input', () => {
        cy.get('input').type('Test Workout')
        cy.get('input').should('have.value', 'Test Workout')
        cy.end()
    })

    it('Tests add exercise button', () => {
        cy.get('[data-testid="addExercise"]').click()
        cy.contains('Set')
        cy.contains('Weight')
        cy.contains('Reps')
    })
})
/// <reference types="cypress" />

describe('first-time startup', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should show login screen', () => {
    cy.contains('Welcome to PR Club!');
  });
});

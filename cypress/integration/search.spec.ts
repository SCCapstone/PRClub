// <reference types="cypress" />

describe('Search', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(window) {
        window.localStorage.setItem('currentUser', '"debKjhaRMGqYRMOUkhgwm0etsfgZ"');
      },
    });
  });

  it('Can unfollow a user via search', () => {
    // navigate to search
    cy.get('a[href="/Main/Search"]').click();

    // type in a search keyboard
    cy.get('input[placeholder="search for users..."]').type('E');

    // click on "Emulator2"
    cy.contains('Emulator2').click();

    // confirm their profile loaded
    cy.contains('Unfollow').click();

    // navigate to home screen
    cy.get('a[href="/Main/Home"]').click();

    // confirm unfollow snackbar shows up
    cy.contains('Successfully unfollowed @Em2.');
  });

  it('Can follow a user via search', () => {
    // navigate to search
    cy.get('a[href="/Main/Search"]').click();

    // type in a search keyboard
    cy.get('input[placeholder="search for users..."]').type('E');

    // click on "EmTest1"
    cy.contains('EmTest1').click();

    // confirm their profile loaded
    cy.contains('Follow').click();

    // navigate to home screen
    cy.get('a[href="/Main/Home"]').click();

    // confirm one of their posts shows up
    cy.contains('First Workout!');
  });
});

/// <reference types="cypress" />

describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Can sign into an account and logout.', () => {
    // fill out sign up form
    cy.get('input[placeholder="email"]').type('duck@gmail.com');
    cy.get('input[placeholder="password"]').type('test123');

    // sign in
    cy.contains('Sign In').click();

    // access profile
    cy.get('a[href="/Main/Profile"]').click();

    // correct username should show up on profile screen
    cy.contains('@BigDuck');

    // access settings
    cy.get('a[href="/Main/Settings"]').click();

    // log out
    cy.contains('Log out').click();

    // sign in screen show now show up
    cy.contains('Sign In');
  });

  it('Can sign up for an account and logout.', () => {
    // fill out sign up form
    cy.contains("Don't have an account?").click();
    cy.get('input[placeholder="name"]').type('test');
    cy.get('input[placeholder="username"]').type('test');
    cy.get('input[placeholder="email"]').type('cypress@test.com');
    cy.get('input[placeholder="password"]').type('test123');
    cy.get('input[placeholder="confirm password"]').type('test123');

    // sign up
    cy.contains('Sign Up').click();

    // access profile
    cy.get('a[href="/Main/Profile"]').click();

    // correct username should show up on profile screen
    cy.contains('@test');

    // access settings
    cy.get('a[href="/Main/Settings"]').click();

    // log out
    cy.contains('Log out').click();

    // sign in screen show now show up
    cy.contains('Sign In');
  });

  it('Cannot sign into account with email that is not registered.', () => {
    // fill out sign up form
    cy.get('input[placeholder="email"]').type('wrong@test.com');
    cy.get('input[placeholder="password"]').type('test123');

    // try to sign in
    cy.contains('Sign In').click();

    // correct snackbar shows up
    cy.contains('Authentication error: Firebase: Error (auth/user-not-found).');
  });

  it('Cannot sign up for account with username that already exists.', () => {
    // fill out sign up form
    cy.contains("Don't have an account?").click();
    cy.get('input[placeholder="name"]').type('anotherduck');
    cy.get('input[placeholder="username"]').type('BigDuck');
    cy.get('input[placeholder="email"]').type('duck2@gmail.com');
    cy.get('input[placeholder="password"]').type('test123');
    cy.get('input[placeholder="confirm password"]').type('test123');

    // sign up
    cy.contains('Sign Up').click();

    // correct snackbar shows up
    cy.contains('Authentication error: Username already exists!');
  });

  it('Cannot sign up for account with email that already exists.', () => {
    // fill out sign up form
    cy.contains("Don't have an account?").click();
    cy.get('input[placeholder="name"]').type('anotherduck');
    cy.get('input[placeholder="username"]').type('BigDuck2');
    cy.get('input[placeholder="email"]').type('duck@gmail.com');
    cy.get('input[placeholder="password"]').type('test123');
    cy.get('input[placeholder="confirm password"]').type('test123');

    // sign up
    cy.contains('Sign Up').click();

    // correct snackbar shows up
    cy.contains('Authentication error: Firebase: Error (auth/email-already-in-use).');
  });
});

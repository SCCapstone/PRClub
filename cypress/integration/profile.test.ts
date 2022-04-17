/// <reference types="cypress" />

describe('Profile', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(window) {
        window.localStorage.setItem('currentUser', '"debKjhaRMGqYRMOUkhgwm0etsfgZ"');
      },
    });
  });

  it('Can delete one of your posts.', () => {
    // navigate to profile
    cy.get('a[href="/Main/Profile"]').click();

    // delete post
    cy
      .get('div[role="tablist"]')
      .eq(0)
      .get('div[style="font-family: ionicons; font-size: 18px; font-style: normal; font-weight: normal;"]')
      .eq(4)
      .click({ force: true });

    cy
      .contains('posted workout:')
      .parent()
      .parent()
      .get('span[style="color: rgb(0, 0, 0); font-family: ionicons; font-size: 24px; font-style: normal; font-weight: normal;"]')
      .eq(0)
      .click({ force: true });
    cy.contains('posted workout:').should('not.exist');
  });

  it('Can update your name.', () => {
    // navigate to profile
    cy.get('a[href="/Main/Profile"]').click();

    // edit profile
    cy.contains('Show View Options').click();
    cy.contains('Edit Profile').click();
    cy.get('input[value="Donald Duck"]').clear().type('Pato Donald');
    cy.contains('Save').click();

    // go back to profile
    cy.contains('').click();

    // confirm new name shows up on profile
    cy.contains('Pato Donald');
  });

  it('Can update your handle.', () => {
    // navigate to profile
    cy.get('a[href="/Main/Profile"]').click();

    // edit profile
    cy.contains('Show View Options').click();
    cy.contains('Edit Profile').click();
    cy.get('input[value="BigDuck"]').clear().type('PatoGrande');
    cy.contains('Save').click();

    // go back to profile
    cy.contains('').click();

    // confirm new name shows up on profile
    cy.contains('@PatoGrande');
  });
});

/// <reference types="cypress" />

describe('Posts', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(window) {
        window.localStorage.setItem('currentUser', '"debKjhaRMGqYRMOUkhgwm0etsfgZ"');
      },
    });
  });

  it('Can unlike and like a post.', () => {
    // navigate to home screen
    cy.get('a[href="/Main/Home"]').click();

    // get Susan's post
    cy
      .contains('@SusMan')
      .parent()
      .parent()
      .parent()
      .within(() => {
        // unlike it
        cy
          .get('div[style="color: rgb(239, 68, 68); font-family: ionicons; font-size: 24px; font-style: normal; font-weight: normal;"]')
          .click();
        cy.contains('1 like');

        // like it
        cy
          .get('div[style="color: rgb(0, 0, 0); font-family: ionicons; font-size: 24px; font-style: normal; font-weight: normal;"]')
          .click();
        cy.contains('2 likes');
      });
  });

  it('Can view a post in the home feed.', () => {
    // navigate to home screen
    cy.get('a[href="/Main/Home"]').click();

    // get Em2's post
    cy
      .contains('@SusMan')
      .parent()
      .parent()
      .parent()
      .within(() => {
        // view the posted workout
        cy.get('div[role="button"]').eq(0).click();

        // confirm it has the below exercise
        cy.contains('Trunk Rotation With Cable');
      });
  });
});

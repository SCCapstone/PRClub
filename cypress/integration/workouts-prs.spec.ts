/// <reference types="cypress" />

describe('Workouts and PRs', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(window) {
        window.localStorage.setItem('currentUser', '"debKjhaRMGqYRMOUkhgwm0etsfgZ"');
      },
    });
  });

  it('Can create a workout and respective PRs show up.', () => {
    // go to create workout screen
    cy.get('a[href="/Main/Create%20Workout"]').click();

    // add a name to the workout
    cy.get('input[placeholder="workout name"]').type("Big Duck's Big Workout");

    // add an exercise
    cy.contains('add exercise').click();
    cy.contains('Select Exercise').click();
    cy.contains('Chest').click({ force: true });
    cy.contains('Benchpress Dumbbells').click({ force: true });

    // add some sets
    cy.contains('add set').click();
    cy.get('input[placeholder="weight (lbs)"]').type('100');
    cy.get('input[placeholder="reps"]').type('10');

    cy.contains('add set').click();
    cy.get('input[placeholder="weight (lbs)"]').eq(1).type('120');
    cy.get('input[placeholder="reps"]').eq(1).type('10');

    cy.contains('add set').click();
    cy.get('input[placeholder="weight (lbs)"]').eq(2).type('140');
    cy.get('input[placeholder="reps"]').eq(2).type('10');

    // add another exercise
    cy.contains('add exercise').click({ force: true });
    cy.contains('Select Exercise').click();
    cy.contains('Arms').click({ force: true });
    cy.contains('Bench Press Narrow Grip').click({ force: true });

    // add some sets
    cy
      .contains('Bench Press Narrow Grip')
      // definitely a better way to find exercise item for this
      .parent()
      .parent()
      .parent()
      .parent()
      .parent()
      .parent()
      .within(() => {
        cy.contains('add set').click();
        cy.get('input[placeholder="weight (lbs)"]').type('50');
        cy.get('input[placeholder="reps"]').type('14');

        cy.contains('add set').click();
        cy.get('input[placeholder="weight (lbs)"]').eq(1).type('55');
        cy.get('input[placeholder="reps"]').eq(1).type('14');
      });

    // save workout
    cy.contains('save workout').click({ force: true });

    // go to profile page
    cy.get('a[href="/Main/Profile"]').click();

    // confirm the workout shows up
    cy.contains("Big Duck's Big Workout");

    // ensure new PRs show up
    cy.get('div[role="tablist"]')
      .eq(0)
      .get('div[style="font-family: ionicons; font-size: 18px; font-style: normal; font-weight: normal;"]')
      .eq(2)
      .click({ force: true });
    cy.contains('Bench Press Narrow Grip');
    cy.contains('Benchpress Dumbbells');
  });
});

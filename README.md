# PRClub
[![CICD](https://github.com/SCCapstone/PRClub/actions/workflows/cicd.yml/badge.svg)](https://github.com/SCCapstone/PRClub/actions/workflows/cicd.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/e177e10b-1448-43b1-b6fe-d879220c11c5/deploy-status)](https://app.netlify.com/sites/prclub/deploys)

**PR Club** is a fitness-oriented social networking app centered around users being able to share
their personal records (PRs) with each other. The goal of this project is to allow users to support
each other as they meet their fitness goals, all while being able to exchange each other's workouts
and meet others with the same interests.

## Technology
- Framework: [React Native](https://reactnative.dev/) (via [Expo](https://expo.dev/))
- Language: primarily [TypeScript](https://www.typescriptlang.org/)
- IDE: [Visual Studio Code](https://code.visualstudio.com/)
- Backend: [Firebase](https://firebase.google.com/)
- Hosting: [Netlify](https://www.netlify.com/)
- Artifact registry: [Expo Application Services (EAS)](https://expo.dev/eas)
- Key 3rd-party libraries:
  - [`react-native-paper`](https://github.com/callstack/react-native-paper) - component library
  - [`react-navigation`](https://github.com/react-navigation/react-navigation) - navigation/routing
  - [`redux-toolkit`](https://github.com/reduxjs/redux-toolkit) - state management
  - [`formik`](https://github.com/jaredpalmer/formik) - form building
  - [`firebase`](https://github.com/firebase/firebase-js-sdk) - Firebase Javascript SDK
  - [`reactfire`](https://github.com/FirebaseExtended/reactfire) - Firebase hooks for React
- Data sources: 
  - [wger.de REST API](https://wger.de/en/software/api) - primary exercise databank

## External Dependencies
### Required
- [`npm`](https://github.com/npm/cli)
- [`expo-cli`](https://github.com/expo/expo-cli)

### Optional
Testing:
- [`jest`](https://jestjs.io/)

Deployment:
- [`act`](https://github.com/nektos/act)

## Setup
1. Clone this repository. `cd` into its repo.
2. Run `npm install`.

## Running
Run `expo start` from the root directory of your local copy of this repository, and follow the
instructions returned by the command.

## Testing
### Testing Infrastructure
We are using `jest` for unit tests and `cypress` for behavioral tests.

### Running Tests
#### Behavioral Tests
* Located in `cypress/integration/`.
* To run:
  1. Build the web version of the app, run it, and wait for it to fully load: `npm run web:build`.
  2. In a parallel command prompt, run `npx cypress run --headless` to run tests in headless mode,
  or `npx cypress open` to run tests interactively in the browser. *This must be done from the
  root of this repository.*

#### Unit Tests
* Located in all `**/__tests__/` subfolders as appropriate.
  * e.g. in `services/__tests__/` for now but could also be added to `components/__tests__/` to
unit test React components.
* To run, simply run `npm test` from the root of this repository.

## Deployment
All deployments are done automatically on each merge into `main` using our
[`cicd` GitHub Action](.github/workflows/cicd.yml). First, a commit is linted and then **[TODO]**
must pass through unit and UI testing **[/TODO]**. Once these steps are successfully completed, it
is then deployed as a [Netlify static site](https://prclub-preview.netlify.app/) and built as an
Android apk on [EAS](https://expo.dev/accounts/prclub22/projects/PRClub/builds).

Our entire deployment pipeline can be run locally using a nifty tool called
[`act`](https://github.com/nektos/act)! To do so, follow the below steps:

1. Install [Docker](https://www.docker.com/), if you don't already have it. This is required for
`act` to be able to run workflows locally.

2. Install `act` using the instructions
[here](https://github.com/nektos/act/blob/master/README.md#installation).

3. Obtain a copy of the `cicd.env` file from a maintainer of this repository.

4. Start a Docker instance on your development environment.

5. Run `npm run deploy`. Monitor changes to the
[Netlify static site](https://prclub-preview.netlify.app/) and updates on the
[EAS dashboard](https://expo.dev/accounts/prclub22/projects/PRClub/builds).

## Maintainers
- Dhruv Pai ([GitHub](https://github.com/thatpaiguy) | [email](mailto:dhruv.k.pai@gmail.com))
- Ethan Schimelman ([GitHub](https://github.com/eschim) | [email](mailto:eschimelman@gmail.com))
- Ish Singh ([GitHub](https://github.com/singhish) | [email](mailto:ishratsingh00@gmail.com))
- John Angelidis ([GitHub](https://github.com/johnangelidis) | [email](mailto:johnangelidis12@gmail.com))
- Nick Yglesias ([GitHub](https://github.com/NickYglesias64) | [email](mailto:nyglesias64@outlook.com))

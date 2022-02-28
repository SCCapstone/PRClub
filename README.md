# PRClub
We are creating a social networking application where users will be able to create and share workouts with other users. The goal of this project is to allow users to share their passion for fitness by exchanging workouts and meeting new people with the same interests. Some of the features of our applications include:
- Creating a user profile
- Following other users
- Keeping track of your workout routines and progress
- Publicly posting workout routines
- Comment and like other users' workouts
- Instant messaging

## Technology
- Framework: React Native, Expo
- Languages: Typescript/Javascript
- IDE: Visual Studio Code
- Backend Server: Firebase
- Third Party Libraries: React Native Elements, ReduxJS Toolkit, Firebase Javascript SDK, ~~React Native Health~~\*
  - \* omitted -- only compatible with iOS, making it unusable on Android targets (build target for course)
- Third Party APIs: [wger Workout Manager REST API](https://wger.de/en/software/api) as our primary exercise databank, ~~MyFitnessPal API~~\*\*, ~~Fitbit API~~\*\*\*
  - \*\* currently unable to gain access as a public project landing page is required and OAuth/Activity Callback URLs are required (see their [form](https://docs.google.com/forms/d/e/1FAIpQLScRgAz4W_1QQ2He5QvUXsSfJxJ4xJZTbPUnzxo-uQahT3SESQ/viewform)).
  - \*\*\* blocked on this as none of our group members own a Fitbit; API also primarily focuses on biometric information rather than workout log data which is currently out of the scope of our PoC

## External Requirements
- Javascript
- Expo
- React Native
- npm

## Setup
1. Clone this repository. `cd` into its repo.
2. Run `npm install`.

## Running
1. Run `expo start` from the root directory of your local copy of this repository.

## Deployment

### To Android
1. Create an [Expo Application Services (EAS)](https://expo.dev/eas) account.
2. From the root directory, run `npx eas-cli build --platform android`.
3. Sign in to your EAS account to view the status of your build.
4. Monitor your build until it completes. Then, download its APK once it's complete.

### To Web
1. Create an account on [Netlify](www.netlify.com). Wait until you get to the below screen
with the following file upload box:
<image src="./assets/netlify.png" class="center">
2. From the root directory, run `expo build:web`. Confirm there are no issues by running
`npx serve web-build` and accessing the port specified in its output.
3. Drag-and-drop the `web-build/` folder created in the last step to the above file upload box.
4. Access the URL provided by Netlify.

# Testing
## Testing Technology
We are using `jest` for unit tests and `cypress` for behavioral tests.

## Running Tests
### Behavioral Tests
* Located in `cypress/integration/`.
* To run:
  1. Launch the expo web server, and wait for it to fully load: `npm run web`.
  2. In a parallel command prompt, run `npx cypress run --headless` to run tests in headless mode,
  or `npx cypress open` to run tests interactively in the browser. *This must be done from the
  root of this repository.*

### Unit Tests
* Located in all `**/__tests__/` subfolders as appropriate.
  * e.g. in `services/__tests__/` for now but could also be added to `components/__tests__/` to unit test React components.
* To run, simply run `npm test` from the root of this repository.

# Authors
- Dhruv Pai (dhruv.k.pai@gmail.com)
- John Angelidis (johnangelidis12@gmail.com)
- Ishrat Singh (ishrat512@icloud.com)
- Nick Yglesias  (nyglesias64@outlook.com)
- Ethan Schimelman (eschimelman@gmail.com)

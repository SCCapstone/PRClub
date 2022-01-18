# PRClub
*Project Structure Document: https://docs.google.com/document/d/1Q6jiE0bRHjM4UogHsJBCiUVq1bl6iZTmBYgcztHcrqo/edit?usp=sharing*

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
Run `expo start` from the root directory of this repository.

## Deployment
TODO

# Testing

## Testing Technology
We are using `cypress` for our behavioral tests, and `jest` for our unit tests.

## Running Tests
TODO

# Authors
- Dhruv Pai (dhruv.k.pai@gmail.com)
- John Angelidis (johnangelidis12@gmail.com)
- Ishrat Singh (ishrat512@icloud.com)
- Nick Yglesias  (nyglesias64@outlook.com)
- Ethan Schimelman (eschimelman@gmail.com)

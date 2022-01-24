# `state/`
This subdirectly contains all logic related to the Redux store that backs PRClub's frontend. Our
state management workflow in and of itself is fairly complicated so it deserves its own README.

## Structure of a Slice
Each slice is made up of the following five files. The first three are pretty straightforward:
- `index.ts`: where main slice creation & reducer logic lives.
- `state.ts`: holds declarations for a slice's adapter (an object that contains boilerplate code
  for selectors, reducers, etc.) and initial state.
- `selectors.ts`: contains definitions for React
  hooks that allow for real-time querying of data from store in components. A lot of these are
  already defined by the adapter that gets initialized in `state.ts` but it is still necessary to
  write custom selectors a lot of the time.

The last two are less trivial and keep track of all *asynchronous* interactions (usually database
interactions) with the Redux store.
- `saga.ts`: uses `redux-sagas` to handle syncing the database with the Redux store anytime an
  action is dispatched **via user input** (i.e. whenever you call `dispatch(...)` **inside** a
  React component). They listen to any time an action is dispatched so you don't need to call them
  directly in components (making our lives way easier at the end of the day).
- `thunks.ts`: uses `redux-thunk` to handle all {database <-> Redux store} interactions that occur
  **outside** of React components (e.g. to fetch all of a user's workouts from the database on
  startup). A good rule of thumb is to use a thunk any time you need to dispatch an action outside
  of a React component using `store.dispatch(...)` (e.g. at the top-level of `App.tsx`).

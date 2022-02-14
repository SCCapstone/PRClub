# `state/`
This subdirectly contains all logic related to the Redux store that backs PRClub's frontend. Our
state management workflow in and of itself is fairly complicated so it deserves its own README.

## Structure of a Slice
Each slice is made up of the following four files. The first three are pretty straightforward:
- `index.ts`: where main slice creation & reducer logic lives.
- `state.ts`: holds declarations for a slice's adapter (an object that contains boilerplate code
  for selectors, reducers, etc.) and initial state.
- `selectors.ts`: contains definitions for React
  hooks that allow for real-time querying of data from store in components. A lot of these are
  already defined by the adapter that gets initialized in `state.ts` but it is still necessary to
  write custom selectors a lot of the time.

The last is less trivial and keeps track of all *asynchronous* interactions (usually database
interactions) with the Redux store.
- `thunks.ts`: uses `redux-thunk` to handle all explicit {Firebase <-> Redux store} interactions.
  *[TODO] talk about dispatching thunks and normal dispatches together using handler pattern*

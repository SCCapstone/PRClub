import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import Navigator from './navigation/Navigator';
import store from './redux/store';
import { hydrateInitialState } from './redux/slices/workoutsSlice';

store.dispatch(hydrateInitialState());

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </Provider>
  );
}
